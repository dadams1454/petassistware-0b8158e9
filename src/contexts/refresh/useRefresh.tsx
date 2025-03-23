
import { useContext, useCallback } from 'react';
import { RefreshContext } from './RefreshProvider';
import { RefreshableArea, UseRefreshResult } from './types';
import { debounce } from 'lodash';

// Custom hook to use refresh context
export const useRefresh = (area: RefreshableArea = 'all'): UseRefreshResult => {
  const context = useContext(RefreshContext);
  
  if (!context) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  
  // Create a debounced version of the refresh handler
  const debouncedRefresh = useCallback(
    debounce((showToast?: boolean) => context.handleRefresh(area, showToast), 300),
    [context.handleRefresh, area]
  );
  
  return {
    isRefreshing: context.isRefreshing[area],
    lastRefreshTime: context.lastRefreshTime[area],
    currentDate: context.currentDate,
    handleRefresh: debouncedRefresh,
    refreshAll: useCallback((showToast?: boolean) => context.handleRefresh('all', showToast), [context.handleRefresh]),
    timeUntilNextRefresh: context.getTimeUntilNextRefresh(area),
    formatTimeRemaining: () => context.formatTimeRemaining(area),
    setRefreshInterval: (interval: number) => context.setRefreshInterval(area, interval)
  };
};
