
import { useRef, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

export const useRefreshHandler = (onRefresh?: () => void) => {
  const isRefreshingRef = useRef(false);
  const lastRefreshRef = useRef<number>(Date.now());
  const MIN_REFRESH_INTERVAL = 3000; // 3s between refreshes to reduce server load
  
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
        // Small delay before clearing refresh state for smoother UI
        setTimeout(() => {
          isRefreshingRef.current = false;
        }, 100);
      }
    }, 300) // Reduced from 500ms to 300ms for more responsive UI
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
  
  // Reset handler for testing or force refresh
  const resetRefreshTimer = useCallback(() => {
    lastRefreshRef.current = 0; // Reset the timer to allow immediate refresh
  }, []);

  return {
    handleRefresh,
    isRefreshing: isRefreshingRef.current,
    resetRefreshTimer,
    lastRefreshTime: lastRefreshRef.current
  };
};
