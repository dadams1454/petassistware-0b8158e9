
import { useRef, useCallback, useEffect } from 'react';
import { useDebounce } from './cellActions/useDebounce';

export const useRefreshHandler = (onRefresh?: () => void) => {
  const isRefreshingRef = useRef(false);
  const lastRefreshRef = useRef<number>(Date.now());
  const MIN_REFRESH_INTERVAL = 3000; // 3 seconds between refreshes
  const { debounce } = useDebounce(300);
  
  // Centralized refresh function with debouncing and throttling
  const handleRefresh = useCallback(() => {
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
    
    // Use debounce to prevent multiple rapid refreshes
    debounce(async () => {
      console.log('🔄 Performing refresh of data');
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
    });
  }, [debounce, onRefresh]);
  
  return {
    handleRefresh,
    isRefreshing: isRefreshingRef.current
  };
};
