import React, { createContext, useContext, useState, useCallback } from 'react';

// Define the type for refresh status
type RefreshStatus = {
  [key: string]: boolean;
};

// Define the context props
interface RefreshContextProps {
  refreshAll: (showToast?: boolean) => Promise<void>;
  refreshSpecific: <T>(key: string, fetchFunction: () => Promise<T>, showToast?: boolean) => Promise<T | null>;
  refreshStatus: RefreshStatus;
  formatTimeRemaining: (lastRefreshTime: number) => string;
  currentDate: Date;
}

// Create the context with default values
const RefreshContext = createContext<RefreshContextProps>({
  refreshAll: async () => {},
  refreshSpecific: async () => null,
  refreshStatus: {},
  formatTimeRemaining: () => '',
  currentDate: new Date(),
});

// Hook to use the context
export const useRefresh = () => useContext(RefreshContext);

// Provider component
export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Track refresh status for each operation
  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>({});
  
  // Keep track of current date (for time-based components)
  const [currentDate] = useState<Date>(new Date());
  
  // Function to refresh a specific operation
  const refreshSpecific = useCallback(async <T,>(
    key: string,
    fetchFunction: () => Promise<T>,
    showToast = false
  ): Promise<T | null> => {
    // Set the refresh status to true for this operation
    setRefreshStatus(prev => ({ ...prev, [key]: true }));
    
    try {
      console.log(`[REFRESH] Starting refresh for ${key}`);
      const result = await fetchFunction();
      console.log(`[REFRESH] Completed refresh for ${key}`);
      return result;
    } catch (error) {
      console.error(`[REFRESH] Error refreshing ${key}:`, error);
      return null;
    } finally {
      // Reset the refresh status
      setRefreshStatus(prev => ({ ...prev, [key]: false }));
    }
  }, []);
  
  // Function to refresh all operations
  const refreshAll = useCallback(async (showToast = false) => {
    console.log('[REFRESH] Starting refresh for all operations');
    
    // Here you would trigger any global refresh actions
    // This is a placeholder for now, as we don't have global actions defined yet
    
    console.log('[REFRESH] Completed refresh for all operations');
  }, []);
  
  // Helper function to format time remaining until next refresh
  const formatTimeRemaining = useCallback((lastRefreshTime: number): string => {
    const secondsElapsed = Math.floor((Date.now() - lastRefreshTime) / 1000);
    const minutesElapsed = Math.floor(secondsElapsed / 60);
    
    if (minutesElapsed < 1) {
      return 'just now';
    } else if (minutesElapsed === 1) {
      return '1 minute ago';
    } else {
      return `${minutesElapsed} minutes ago`;
    }
  }, []);
  
  return (
    <RefreshContext.Provider
      value={{
        refreshAll,
        refreshSpecific,
        refreshStatus,
        formatTimeRemaining,
        currentDate,
      }}
    >
      {children}
    </RefreshContext.Provider>
  );
};
