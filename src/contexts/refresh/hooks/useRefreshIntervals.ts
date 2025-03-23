
import { useCallback, useRef, useState } from 'react';
import { RefreshableArea } from '../types';
import { getInitialRefreshState } from '../utils';

export function useRefreshIntervals(
  areas: RefreshableArea[],
  initialRefreshInterval: number
) {
  // Configurable refresh intervals for each area
  const [refreshInterval, setRefreshIntervalState] = useState<Record<RefreshableArea, number>>(
    getInitialRefreshState(areas, initialRefreshInterval)
  );
  
  // References for timers
  const intervalRefs = useRef<Record<RefreshableArea, NodeJS.Timeout | null>>(
    getInitialRefreshState(areas, null)
  );
  
  // Set refresh interval for a specific area
  const setRefreshInterval = useCallback((area: RefreshableArea, interval: number) => {
    setRefreshIntervalState(prev => ({
      ...prev,
      [area]: interval
    }));
    
    // Clear existing interval
    if (intervalRefs.current[area]) {
      clearInterval(intervalRefs.current[area]!);
      intervalRefs.current[area] = null;
    }
  }, []);
  
  // Clear all intervals (for cleanup)
  const clearAllIntervals = useCallback(() => {
    Object.values(intervalRefs.current).forEach(interval => {
      if (interval) clearInterval(interval);
    });
  }, []);
  
  // Setup interval for a specific area
  const setupInterval = useCallback((area: RefreshableArea, callback: () => void) => {
    if (refreshInterval[area] > 0) {
      intervalRefs.current[area] = setInterval(callback, refreshInterval[area]);
    }
  }, [refreshInterval]);
  
  return {
    refreshInterval,
    setRefreshInterval,
    clearAllIntervals,
    setupInterval,
    intervalRefs
  };
}
