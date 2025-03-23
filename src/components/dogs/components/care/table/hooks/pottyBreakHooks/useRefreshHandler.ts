
import { useCallback } from 'react';
import { useRefresh } from '@/contexts/refreshContext';

export const useRefreshHandler = (onRefresh?: () => void) => {
  // Use the centralized refresh context for the specific area
  const { isRefreshing, handleRefresh } = useRefresh('dailyCare');
  
  // Handle manual refresh with debouncing from central system
  const refreshHandler = useCallback(() => {
    console.log('🔄 Manual refresh requested in useRefreshHandler');
    
    // Call the provided refresh function if available
    if (onRefresh) {
      onRefresh();
    }
    
    // Also trigger the central refresh system
    handleRefresh(false);
  }, [onRefresh, handleRefresh]);

  return {
    handleRefresh: refreshHandler,
    isRefreshing
  };
};
