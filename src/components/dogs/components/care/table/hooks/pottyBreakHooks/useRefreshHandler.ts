
import { useRef, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

export const useRefreshHandler = (onRefresh?: () => void) => {
  const isRefreshingRef = useRef(false);
  const lastRefreshRef = useRef<number>(Date.now());
  const MIN_REFRESH_INTERVAL = 3000; // 3 seconds between refreshes
  
  // Create debounced refresh function with an improved implementation
  const debouncedRefresh = useRef(
    debounce(async () => {
      // Skip if refresh already in progress
      if (isRefreshingRef.current) {
        console.log('🔄 Refresh already in progress, skipping');
        return;
      }
      
      // Check refresh interval
      const now = Date.now();
      if (now - lastRefreshRef.current < MIN_REFRESH_INTERVAL) {
        console.log('🔄 Skipping refresh - too soon after last refresh');
        return;
      }
      
      console.log('🔄 Performing refresh of potty break data');
      isRefreshingRef.current = true;
      lastRefreshRef.current = now;
      
      try {
        // Call the provided refresh function if available
        if (onRefresh) {
          await onRefresh();
        }
      } catch (error) {
        console.error('Error during refresh:', error);
      } finally {
        // Ensure we always reset the refreshing flag
        isRefreshingRef.current = false;
      }
    }, 300)
  ).current;
  
  // Clean up the debounced function when the component unmounts
  useEffect(() => {
    return () => {
      debouncedRefresh.cancel();
    };
  }, [debouncedRefresh]);
  
  // Handle manual refresh with debouncing
  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh requested in useRefreshHandler');
    debouncedRefresh();
  }, [debouncedRefresh]);

  return {
    handleRefresh,
    isRefreshing: isRefreshingRef.current
  };
};
