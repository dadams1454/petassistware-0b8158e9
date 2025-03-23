
import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { startOfDay, addDays } from 'date-fns';
import { 
  RefreshContextType, 
  RefreshProviderProps, 
  RefreshableArea, 
  RefreshCallbacks 
} from './types';
import { DEFAULT_REFRESH_INTERVAL, getInitialRefreshState, ALL_REFRESH_AREAS } from './utils';

export const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider: React.FC<RefreshProviderProps> = ({
  children,
  initialRefreshInterval = DEFAULT_REFRESH_INTERVAL,
  enableToasts = false
}) => {
  // Store refresh callbacks by area
  const callbacksRef = useRef<Record<RefreshableArea, RefreshCallbacks[]>>({
    dailyCare: [],
    dashboard: [],
    dogs: [],
    puppies: [],
    all: []
  });
  
  // Store refresh states for each area
  const [isRefreshing, setIsRefreshing] = useState<Record<RefreshableArea, boolean>>(
    getInitialRefreshState(ALL_REFRESH_AREAS, false)
  );
  
  // Track last refresh time for each area
  const [lastRefreshTime, setLastRefreshTime] = useState<Record<RefreshableArea, Date>>(
    getInitialRefreshState(ALL_REFRESH_AREAS, new Date())
  );
  
  // Current date state (for day changes)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Configurable refresh intervals for each area
  const [refreshInterval, setRefreshIntervalState] = useState<Record<RefreshableArea, number>>(
    getInitialRefreshState(ALL_REFRESH_AREAS, initialRefreshInterval)
  );
  
  // References for timers
  const intervalRefs = useRef<Record<RefreshableArea, NodeJS.Timeout | null>>(
    getInitialRefreshState(ALL_REFRESH_AREAS, null)
  );
  
  const midnightCheckRef = useRef<NodeJS.Timeout | null>(null);
  
  // Time until next refresh (in seconds) for each area
  const getTimeUntilNextRefresh = useCallback((area: RefreshableArea) => {
    const elapsed = (new Date().getTime() - lastRefreshTime[area].getTime()) / 1000;
    return Math.max(0, Math.floor((refreshInterval[area] / 1000) - elapsed));
  }, [lastRefreshTime, refreshInterval]);
  
  // Format time until next refresh (mm:ss)
  const formatTimeRemaining = useCallback((area: RefreshableArea = 'all') => {
    const seconds = getTimeUntilNextRefresh(area);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, [getTimeUntilNextRefresh]);
  
  // Register a component's refresh callback
  const registerCallback = useCallback((area: RefreshableArea, callbacks: RefreshCallbacks) => {
    callbacksRef.current[area].push(callbacks);
    
    // Return unregister function
    return () => {
      callbacksRef.current[area] = callbacksRef.current[area].filter(cb => cb !== callbacks);
    };
  }, []);
  
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
    
    // Set up new interval if greater than 0
    if (interval > 0) {
      intervalRefs.current[area] = setInterval(() => {
        handleRefresh(area, false);
      }, interval);
    }
  }, []);
  
  // Handle midnight date change
  const setupMidnightCheck = useCallback(() => {
    if (midnightCheckRef.current) {
      clearTimeout(midnightCheckRef.current);
    }
    
    // Calculate time until midnight
    const now = new Date();
    const tomorrow = startOfDay(addDays(now, 1));
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    console.log(`⏰ Setting up midnight check: ${timeUntilMidnight / 1000 / 60} minutes until midnight refresh`);
    
    // Set timeout for midnight reset
    midnightCheckRef.current = setTimeout(() => {
      console.log('🕛 Midnight reached - refreshing all data!');
      const newDate = new Date();
      setCurrentDate(newDate);
      
      // Notify all registered components about date change
      Object.keys(callbacksRef.current).forEach(area => {
        callbacksRef.current[area as RefreshableArea].forEach(callbacks => {
          if (callbacks.onDateChange) {
            callbacks.onDateChange(newDate);
          }
        });
      });
      
      // Trigger refresh for all areas
      handleRefresh('all', true);
      
      // Set up next midnight check
      setupMidnightCheck();
    }, timeUntilMidnight);
    
    return () => {
      if (midnightCheckRef.current) {
        clearTimeout(midnightCheckRef.current);
      }
    };
  }, []);
  
  // Core refresh function
  const handleRefresh = useCallback(async (area: RefreshableArea, showToast = false) => {
    // Skip if already refreshing this area
    if (isRefreshing[area]) return;
    
    try {
      // Update refresh state
      setIsRefreshing(prev => ({
        ...prev,
        [area]: true,
        ...(area === 'all' ? { dailyCare: true, dashboard: true, dogs: true, puppies: true } : {})
      }));
      
      // Show toast if requested
      if (showToast && enableToasts) {
        toast({
          title: `Refreshing ${area === 'all' ? 'all data' : area}...`,
          description: "Please wait while we update the latest information.",
          duration: 3000,
        });
      }
      
      // Determine which areas to refresh
      const areasToRefresh: RefreshableArea[] = 
        area === 'all' 
          ? ['dailyCare', 'dashboard', 'dogs', 'puppies', 'all'] 
          : [area];
      
      // Execute all registered callbacks for the specified areas
      const refreshPromises: Promise<any>[] = [];
      
      areasToRefresh.forEach(refreshArea => {
        callbacksRef.current[refreshArea].forEach(callbacks => {
          if (callbacks.onRefresh) {
            refreshPromises.push(callbacks.onRefresh(currentDate, showToast));
          }
        });
      });
      
      // Wait for all refresh operations to complete
      await Promise.all(refreshPromises);
      
      // Update last refresh time
      const now = new Date();
      setLastRefreshTime(prev => ({
        ...prev,
        [area]: now,
        ...(area === 'all' ? { dailyCare: now, dashboard: now, dogs: now, puppies: now } : {})
      }));
      
      // Show success toast if requested
      if (showToast && enableToasts) {
        toast({
          title: "Refresh complete",
          description: `Data has been updated successfully.`,
          duration: 3000,
        });
      }
      
    } catch (error) {
      console.error(`Error during ${area} refresh:`, error);
      
      if (showToast) {
        toast({
          title: "Refresh failed",
          description: `Unable to update ${area === 'all' ? 'data' : area}. Please try again.`,
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      // Reset refresh state
      setIsRefreshing(prev => ({
        ...prev,
        [area]: false,
        ...(area === 'all' ? { dailyCare: false, dashboard: false, dogs: false, puppies: false } : {})
      }));
    }
  }, [isRefreshing, currentDate, enableToasts]);
  
  // Set up refresh intervals for all areas on mount
  useEffect(() => {
    // Setup separate interval for each area
    Object.keys(refreshInterval).forEach(area => {
      const typedArea = area as RefreshableArea;
      if (refreshInterval[typedArea] > 0) {
        intervalRefs.current[typedArea] = setInterval(() => {
          handleRefresh(typedArea, false);
        }, refreshInterval[typedArea]);
      }
    });
    
    // Setup midnight check
    const cleanupMidnightCheck = setupMidnightCheck();
    
    // Cleanup all intervals on unmount
    return () => {
      Object.values(intervalRefs.current).forEach(interval => {
        if (interval) clearInterval(interval);
      });
      
      cleanupMidnightCheck();
    };
  }, [refreshInterval, setupMidnightCheck, handleRefresh]);
  
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
