
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseAutoRefreshProps {
  onRefresh: () => Promise<boolean | void>;
  isRefreshing: boolean;
  interval?: number;
  initialRefreshOnMount?: boolean;
}

export const useAutoRefresh = ({ 
  onRefresh, 
  isRefreshing, 
  interval = 30 * 60 * 1000,  // 30 minutes by default
  initialRefreshOnMount = true
}: UseAutoRefreshProps) => {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const isRefreshingRef = useRef(false);
  const { toast } = useToast();
  
  // Create an AbortController ref for cancellable fetches
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Silent refresh without toast notifications
  const silentRefresh = useCallback(async () => {
    if (isRefreshingRef.current || isRefreshing) {
      console.log('🔄 Silent refresh skipped - refresh already in progress');
      return;
    }
    
    console.log('🔄 Silent auto-refresh triggered');
    isRefreshingRef.current = true;
    
    // Create a new AbortController for this fetch
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    try {
      // Add a timeout of 30 seconds for any refresh operation
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          console.log('⏱️ Auto-refresh timeout reached, aborting');
          abortControllerRef.current.abort();
        }
      }, 30000);
      
      // Execute the refresh with the signal
      await onRefresh();
      
      clearTimeout(timeoutId);
      setLastRefresh(new Date());
    } catch (error) {
      // Only log errors (no toast) for silent refreshes
      if ((error as Error).name !== 'AbortError') {
        console.error('❌ Error during silent refresh:', error);
      }
    } finally {
      isRefreshingRef.current = false;
      abortControllerRef.current = null;
    }
  }, [onRefresh, isRefreshing]);
  
  // Auto-refresh at specified interval
  useEffect(() => {
    const intervalId = setInterval(silentRefresh, interval);
    
    // Setup a check for user activity/visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('🔍 Document became visible, triggering refresh');
        silentRefresh();
      }
    };
    
    // Listen for visibility changes (user returns to tab)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Abort any in-progress fetch when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [silentRefresh, interval]);
  
  // Initial fetch when hook is initialized
  useEffect(() => {
    if (initialRefreshOnMount) {
      console.log('🚀 Initial refresh triggered');
      silentRefresh().catch(console.error);
    }
  }, [initialRefreshOnMount, silentRefresh]);
  
  return {
    lastRefresh,
    isRefreshingInternal: isRefreshingRef.current
  };
};
