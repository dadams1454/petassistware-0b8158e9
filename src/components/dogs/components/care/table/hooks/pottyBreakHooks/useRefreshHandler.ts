
import { useRef, useCallback, useState, useEffect } from 'react';
import { debounce } from '@/utils/debounce';

export const useRefreshHandler = (onRefresh?: () => void) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRefreshingRef = useRef(false);
  const lastRefreshRef = useRef<number>(Date.now());
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MIN_REFRESH_INTERVAL = 5000; // Increased to 5 seconds to reduce frequent refreshes
  
  // Cleanup function to clear any pending timeouts
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);
  
  // Create debounced refresh function with a longer delay
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
      
      console.log('🔄 Performing refresh of data');
      isRefreshingRef.current = true;
      setIsRefreshing(true);
      lastRefreshRef.current = now;
      
      try {
        // Call the provided refresh function if available
        if (onRefresh) {
          await onRefresh();
        }
      } finally {
        // Always make sure to reset the refreshing flag
        // Add a small delay before setting isRefreshing to false to avoid UI flicker
        refreshTimeoutRef.current = setTimeout(() => {
          isRefreshingRef.current = false;
          setIsRefreshing(false);
        }, 300);
      }
    }, 500) // Increased debounce delay to 500ms
  ).current;
  
  // Handle manual refresh with debouncing
  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh requested in useRefreshHandler');
    debouncedRefresh();
  }, [debouncedRefresh]);

  return {
    handleRefresh,
    isRefreshing
  };
};
