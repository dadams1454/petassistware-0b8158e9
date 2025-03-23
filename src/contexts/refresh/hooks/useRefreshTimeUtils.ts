
import { useCallback } from 'react';
import { RefreshableArea } from '../types';

/**
 * Hook that provides time utilities for refresh operations
 * Creates memoized functions for calculating and formatting refresh times
 */
export function useRefreshTimeUtils(lastRefreshTime: Record<RefreshableArea, Date>) {
  // Calculate time until next refresh
  const getTimeUntilNextRefresh = useCallback((area: RefreshableArea, refreshInterval: number) => {
    const elapsed = (new Date().getTime() - lastRefreshTime[area].getTime()) / 1000;
    return Math.max(0, Math.floor((refreshInterval / 1000) - elapsed));
  }, [lastRefreshTime]);
  
  // Format time until next refresh
  const formatTimeRemaining = useCallback((area: RefreshableArea, refreshInterval: number) => {
    const seconds = getTimeUntilNextRefresh(area, refreshInterval);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, [getTimeUntilNextRefresh]);
  
  return {
    getTimeUntilNextRefresh,
    formatTimeRemaining
  };
}
