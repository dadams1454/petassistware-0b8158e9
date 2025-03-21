
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { debounce } from '@/utils/debounce';

interface UseAutoRefreshProps {
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  interval?: number;
}

export const useAutoRefresh = ({ 
  onRefresh, 
  isRefreshing, 
  interval = 30 * 60 * 1000  // 30 minutes by default
}: UseAutoRefreshProps) => {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const isRefreshingRef = useRef(false);
  const initialRefreshDone = useRef(false);
  const { toast } = useToast();
  
  // Enhanced refresh function with more robust error handling and debouncing
  const handleRefresh = useCallback(async (showToast = true) => {
    // Skip if refresh is already in progress
    if (isRefreshingRef.current || isRefreshing) {
      console.log('🔄 Refresh skipped - refresh already in progress');
      return;
    }
    
    console.log('🔄 Manual refresh triggered');
    isRefreshingRef.current = true;
    
    try {
      // Execute the refresh
      await onRefresh();
      
      setLastRefresh(new Date());
      
      if (showToast) {
        toast({
          title: "Data refreshed",
          description: "All dog care data has been refreshed.",
        });
      }
    } catch (error) {
      console.error('❌ Error during refresh:', error);
      
      if (showToast) {
        toast({
          title: "Refresh failed",
          description: "Could not refresh dog data. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      // Reset the flag after completion (with a small delay to prevent rapid re-clicking)
      setTimeout(() => {
        isRefreshingRef.current = false;
      }, 1000);
    }
  }, [onRefresh, isRefreshing, toast]);
  
  // Debounced version of the refresh handler to prevent UI jitter
  const debouncedRefresh = useCallback(
    debounce((showToast: boolean) => handleRefresh(showToast), 300),
    [handleRefresh]
  );
  
  // Auto-refresh at specified interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Skip if refresh is already in progress
      if (isRefreshingRef.current || isRefreshing) {
        console.log('🔄 Auto refresh skipped - refresh already in progress');
        return;
      }
      
      console.log('🔄 Auto refresh triggered');
      handleRefresh(false); // Don't show toast for auto-refresh
    }, interval);
    
    return () => clearInterval(intervalId);
  }, [handleRefresh, isRefreshing, interval]);
  
  // Initial fetch when hook is initialized - only once
  useEffect(() => {
    if (!initialRefreshDone.current) {
      console.log('🚀 Initial refresh triggered');
      initialRefreshDone.current = true;
      handleRefresh(false).catch(console.error);
    }
  }, [handleRefresh]);
  
  return {
    lastRefresh,
    handleRefresh: (showToast = true) => debouncedRefresh(showToast),
    isRefreshingInternal: isRefreshingRef.current
  };
};
