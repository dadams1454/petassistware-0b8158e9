
import React, { createContext, useEffect } from 'react';
import { RefreshContextType, RefreshProviderProps, RefreshableArea } from './types';
import { DEFAULT_REFRESH_INTERVAL, ALL_REFRESH_AREAS } from './utils';
import { useRefreshCore } from './hooks/useRefreshCore';
import { useRefreshIntervals } from './hooks/useRefreshIntervals';
import { useMidnightCheck } from './hooks/useMidnightCheck';

export const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider: React.FC<RefreshProviderProps> = ({
  children,
  initialRefreshInterval = DEFAULT_REFRESH_INTERVAL,
  enableToasts = false
}) => {
  // Use our extracted hooks
  const {
    isRefreshing,
    lastRefreshTime,
    currentDate,
    handleRefresh,
    handleMidnightReached,
    registerCallback,
    getTimeUntilNextRefresh: getTimeUntil,
    formatTimeRemaining: formatTime
  } = useRefreshCore(enableToasts);
  
  const {
    refreshInterval,
    setRefreshInterval,
    clearAllIntervals,
    setupInterval,
    intervalRefs
  } = useRefreshIntervals(ALL_REFRESH_AREAS, initialRefreshInterval);
  
  const {
    setupMidnightCheck,
    cleanupMidnightCheck
  } = useMidnightCheck(handleMidnightReached);
  
  // Format time until next refresh with current interval
  const formatTimeRemaining = (area: RefreshableArea = 'all') => {
    return formatTime(area, refreshInterval[area]);
  };
  
  // Get time until next refresh with current interval
  const getTimeUntilNextRefresh = (area: RefreshableArea) => {
    return getTimeUntil(area, refreshInterval[area]);
  };
  
  // Set up refresh intervals for all areas on mount
  useEffect(() => {
    // Setup separate interval for each area
    Object.keys(refreshInterval).forEach(area => {
      const typedArea = area as RefreshableArea;
      setupInterval(typedArea, () => {
        handleRefresh(typedArea, false);
      });
    });
    
    // Setup midnight check
    const cleanupMidnight = setupMidnightCheck();
    
    // Cleanup all intervals on unmount
    return () => {
      clearAllIntervals();
      cleanupMidnight();
      cleanupMidnightCheck();
    };
  }, [refreshInterval, setupMidnightCheck, handleRefresh, clearAllIntervals, cleanupMidnightCheck, setupInterval]);
  
  const contextValue: RefreshContextType = {
    isRefreshing,
    lastRefreshTime,
    currentDate,
    handleRefresh,
    getTimeUntilNextRefresh,
    formatTimeRemaining,
    refreshInterval,
    setRefreshInterval,
    registerCallback
  };
  
  return (
    <RefreshContext.Provider value={contextValue}>
      {children}
    </RefreshContext.Provider>
  );
};
