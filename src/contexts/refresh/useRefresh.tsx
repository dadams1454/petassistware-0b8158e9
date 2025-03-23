
import { useContext, useEffect } from 'react';
import { RefreshContext } from './RefreshProvider';
import { RefreshableArea, UseRefreshResult } from './types';

// Custom hook to use refresh context
export const useRefresh = (area: RefreshableArea = 'all'): UseRefreshResult => {
  const context = useContext(RefreshContext);
  
  if (!context) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  
  return {
    isRefreshing: context.isRefreshing[area],
    lastRefreshTime: context.lastRefreshTime[area],
    currentDate: context.currentDate,
    handleRefresh: (showToast?: boolean) => context.handleRefresh(area, showToast),
    refreshAll: (showToast?: boolean) => context.handleRefresh('all', showToast),
    timeUntilNextRefresh: context.getTimeUntilNextRefresh(area),
    formatTimeRemaining: () => context.formatTimeRemaining(area),
    setRefreshInterval: (interval: number) => context.setRefreshInterval(area, interval)
  };
};
