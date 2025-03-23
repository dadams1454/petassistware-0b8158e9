
import React, { createContext, useState, useCallback } from 'react';
import { RefreshTimestampContextType, RefreshTimestampProviderProps } from './types';

// Create the context with a default value
export const RefreshTimestampContext = createContext<RefreshTimestampContextType | null>(null);

export const RefreshTimestampProvider: React.FC<RefreshTimestampProviderProps> = ({ children }) => {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Function to refresh the timestamp
  const refresh = useCallback(() => {
    console.log('🔄 Refreshing timestamp');
    setLastRefresh(new Date());
  }, []);

  // Create the context value object
  const contextValue: RefreshTimestampContextType = {
    lastRefresh,
    refresh,
  };

  return (
    <RefreshTimestampContext.Provider value={contextValue}>
      {children}
    </RefreshTimestampContext.Provider>
  );
};
