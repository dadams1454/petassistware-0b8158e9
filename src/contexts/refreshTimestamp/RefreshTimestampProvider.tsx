
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { RefreshTimestampContextType, RefreshTimestampProviderProps } from './types';

// Create the context with a default value
export const RefreshTimestampContext = createContext<RefreshTimestampContextType | null>(null);

export const RefreshTimestampProvider: React.FC<RefreshTimestampProviderProps> = ({ 
  children, 
  initialInterval = 15 * 60 * 1000 // Default: 15 minutes
}) => {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshInterval, setRefreshInterval] = useState<number>(initialInterval);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Function to refresh the timestamp
  const refresh = useCallback(() => {
    console.log('🔄 Refreshing global timestamp');
    setLastRefresh(new Date());
  }, []);

  // Set up the interval for auto-refresh
  useEffect(() => {
    // Clear any existing timer
    if (timer) {
      clearInterval(timer);
    }
    
    // Only set interval if we have a positive interval value
    if (refreshInterval > 0) {
      console.log(`⏱️ Setting refresh interval to ${refreshInterval}ms`);
      const newTimer = setInterval(refresh, refreshInterval);
      setTimer(newTimer);
    }
    
    // Clean up on unmount or when interval changes
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [refresh, refreshInterval]);

  // Create the context value object
  const contextValue: RefreshTimestampContextType = {
    lastRefresh,
    refresh,
    refreshInterval,
    setRefreshInterval,
  };

  return (
    <RefreshTimestampContext.Provider value={contextValue}>
      {children}
    </RefreshTimestampContext.Provider>
  );
};
