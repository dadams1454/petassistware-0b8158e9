
import { useEffect, useCallback } from 'react';
import { useRefresh, RefreshCallbacks } from '@/contexts/refreshContext';

interface AutoRefreshOptions {
  area?: 'dailyCare' | 'dashboard' | 'dogs' | 'puppies' | 'all';
  interval?: number; // in milliseconds
  onRefresh: (date?: Date, force?: boolean) => Promise<any>;
  enableToasts?: boolean;
  refreshOnMount?: boolean;
  refreshLabel?: string;
  midnightReset?: boolean;
}

export const useAutoRefresh = ({
  area = 'dailyCare',
  interval = 15 * 60 * 1000, // Default: 15 minutes
  onRefresh,
  enableToasts = false,
  refreshOnMount = true,
  refreshLabel = 'data',
  midnightReset = false
}: AutoRefreshOptions) => {
  // Create callbacks object for the refresh context
  const callbacks: RefreshCallbacks = {
    onRefresh,
    onDateChange: midnightReset ? (newDate) => onRefresh(newDate, true) : undefined
  };
  
  // Use the centralized refresh context
  const { 
    isRefreshing, 
    handleRefresh, 
    currentDate, 
    formatTimeRemaining,
    setRefreshInterval
  } = useRefresh(area, callbacks);
  
  // Set custom refresh interval if provided
  useEffect(() => {
    if (interval !== 15 * 60 * 1000) {
      setRefreshInterval(interval);
    }
  }, [interval, setRefreshInterval]);
  
  // Initial refresh on mount if requested
  useEffect(() => {
    if (refreshOnMount) {
      onRefresh(currentDate, false);
    }
  }, [refreshOnMount, onRefresh, currentDate]);
  
  // Create a manual refresh handler
  const manualRefresh = useCallback((showToast = true) => {
    return handleRefresh(showToast);
  }, [handleRefresh]);
  
  return {
    isRefreshing,
    handleRefresh: manualRefresh,
    formatTimeRemaining,
    currentDate
  };
};
