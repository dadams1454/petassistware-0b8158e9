
import { useState, useCallback } from 'react';
import { RefreshableArea } from '../types';
import { getInitialRefreshState } from '../utils';

export function useRefreshState(areas: RefreshableArea[]) {
  // Track refresh states for each area
  const [isRefreshing, setIsRefreshing] = useState<Record<RefreshableArea, boolean>>(
    getInitialRefreshState(areas, false)
  );
  
  // Track last refresh time for each area
  const [lastRefreshTime, setLastRefreshTime] = useState<Record<RefreshableArea, Date>>(
    getInitialRefreshState(areas, new Date())
  );
  
  // Current date state (for day changes)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
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
