
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  
  // Enhanced refresh function with more robust error handling
  const handleRefresh = useCallback(async () => {
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
      toast({
        title: "Data refreshed",
        description: "All dog care data has been refreshed.",
      });
    } catch (error) {
      console.error('❌ Error during refresh:', error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh dog data. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Reset the flag after completion (with a small delay to prevent rapid re-clicking)
      setTimeout(() => {
        isRefreshingRef.current = false;
      }, 1000);
    }
  }, [onRefresh, isRefreshing, toast]);
  
  // Auto-refresh at specified interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Skip if refresh is already in progress
      if (isRefreshingRef.current || isRefreshing) {
        console.log('🔄 Auto refresh skipped - refresh already in progress');
        return;
      }
      
      console.log('🔄 Auto refresh triggered');
      isRefreshingRef.current = true;
      
      // Execute the refresh
      handleRefresh()
        .catch(error => {
          console.error('❌ Error during auto refresh:', error);
        })
        .finally(() => {
          // Reset the flag after auto-refresh is complete
          isRefreshingRef.current = false;
        });
    }, interval);
    
    return () => clearInterval(intervalId);
  }, [handleRefresh, isRefreshing, interval]);
  
  // Initial fetch when hook is initialized
  useEffect(() => {
    console.log('🚀 Initial refresh triggered');
    handleRefresh().catch(console.error);
  }, []);
  
  return {
    lastRefresh,
    handleRefresh,
    isRefreshingInternal: isRefreshingRef.current
  };
};
