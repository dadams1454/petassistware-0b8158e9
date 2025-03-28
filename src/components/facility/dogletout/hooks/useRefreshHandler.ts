
import { useState, useCallback } from 'react';

/**
 * Hook to handle refresh operations with loading state
 */
export const useRefreshHandler = (refreshFn: () => void) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Handle refresh with debounce and loading state
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) {
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      refreshFn();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      // Add slight delay to prevent quick successive refreshes
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  }, [refreshFn, isRefreshing]);
  
  return {
    isRefreshing,
    handleRefresh
  };
};
