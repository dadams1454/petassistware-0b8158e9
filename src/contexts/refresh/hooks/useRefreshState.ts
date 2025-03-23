
import { useState } from 'react';
import { RefreshableArea } from '../types';
import { getInitialRefreshState } from '../utils';
import { useRefreshTimeUtils } from './useRefreshTimeUtils';
import { useCurrentDate } from './useCurrentDate';

export function useRefreshState(areas: RefreshableArea[]) {
  // Track refresh states for each area
  const [isRefreshing, setIsRefreshing] = useState<Record<RefreshableArea, boolean>>(
    getInitialRefreshState(areas, false)
  );
  
  // Track last refresh time for each area
  const [lastRefreshTime, setLastRefreshTime] = useState<Record<RefreshableArea, Date>>(
    getInitialRefreshState(areas, new Date())
  );
  
  // Get date state and time utilities from extracted hooks
  const { currentDate, setCurrentDate } = useCurrentDate();
  const { getTimeUntilNextRefresh, formatTimeRemaining } = useRefreshTimeUtils(lastRefreshTime);
  
  return {
    isRefreshing,
    setIsRefreshing,
    lastRefreshTime,
    setLastRefreshTime,
    currentDate,
    setCurrentDate,
    getTimeUntilNextRefresh,
    formatTimeRemaining
  };
}
