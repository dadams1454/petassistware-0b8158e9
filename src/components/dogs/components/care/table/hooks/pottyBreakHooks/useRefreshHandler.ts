
import { useRef, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

export const useRefreshHandler = (onRefresh?: () => void) => {
  const isRefreshingRef = useRef(false);
  const lastRefreshRef = useRef<number>(Date.now());
  const MIN_REFRESH_INTERVAL = 5000; // Increased from 3s to 5s between refreshes to reduce server load
  
  // Create debounced refresh function with proper cleanup
  const debouncedRefresh = useRef(
    debounce(async () => {
      // Skip if refresh already in progress
      if (isRefreshingRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Refresh already in progress, skipping');
        }
        return;
      }
      
      // Check refresh interval
      const now = Date.now();
      if (now - lastRefreshRef.current < MIN_REFRESH_INTERVAL) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Skipping refresh - too soon after last refresh');
        }
        return;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Performing refresh of potty break data');
      }
      
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
        isRefreshingRef.current = false;
      }
    }, 500) // Increased from 300ms to 500ms to further reduce unnecessary refreshes
  ).current;
  
  // Ensure debounced function gets cleaned up properly
  useEffect(() => {
    return () => {
      debouncedRefresh.cancel();
    };
  }, [debouncedRefresh]);
  
  // Handle manual refresh with debouncing
  const handleRefresh = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Manual refresh requested in useRefreshHandler');
    }
    debouncedRefresh();
  }, [debouncedRefresh]);

  return {
    handleRefresh,
    isRefreshing: isRefreshingRef.current
  };
};
