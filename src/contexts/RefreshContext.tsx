
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { startOfDay, addDays } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface RefreshContextType {
  // Core refresh state and functions
  isRefreshing: boolean;
  lastRefreshTime: Date;
  currentDate: Date;
  timeUntilRefresh: number;
  
  // Main actions
  refreshAll: (showToast?: boolean) => Promise<void>;
  refreshSpecific: (key: string, callback: () => Promise<any>, showToast?: boolean) => Promise<any>;
  
  // Helper functions
  formatTimeRemaining: () => string;
  setCurrentDate: (date: Date) => void;
  cancelScheduledRefreshes: () => void;
  
  // Status tracking for specific refresh operations
  refreshStatus: Record<string, boolean>;
}

interface RefreshProviderProps {
  children: React.ReactNode;
  refreshInterval?: number; // in milliseconds
  enableMidnightReset?: boolean;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider: React.FC<RefreshProviderProps> = ({
  children,
  refreshInterval = 15 * 60 * 1000, // Default: 15 minutes
  enableMidnightReset = true
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(refreshInterval / 1000);
  const [refreshStatus, setRefreshStatus] = useState<Record<string, boolean>>({});
  
  const { toast } = useToast();
  
  const intervalRef = useRef<number | null>(null);
  const midnightCheckRef = useRef<NodeJS.Timeout | null>(null);
  const activeRefreshesRef = useRef<Set<string>>(new Set());
  const refreshCallbacksRef = useRef<Map<string, () => Promise<any>>>(new Map());
  const isInitialMount = useRef(true);
  const debounceTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Setup timer for countdown display - but with less frequent updates to avoid UI flicker
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = (new Date().getTime() - lastRefreshTime.getTime()) / 1000;
      const remaining = Math.max(0, Math.floor((refreshInterval / 1000) - elapsed));
      setTimeUntilRefresh(remaining);
    }, 15000); // Update only every 15 seconds to reduce UI updates
    
    return () => clearInterval(timer);
  }, [refreshInterval, lastRefreshTime]);
  
  // Format time until next refresh
  const formatTimeRemaining = useCallback(() => {
    const minutes = Math.floor(timeUntilRefresh / 60);
    const seconds = Math.floor(timeUntilRefresh % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeUntilRefresh]);
  
  // Cancel all scheduled refreshes
  const cancelScheduledRefreshes = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (midnightCheckRef.current) {
      clearTimeout(midnightCheckRef.current);
      midnightCheckRef.current = null;
    }
    
    // Clear any debounce timers
    Object.values(debounceTimersRef.current).forEach(timer => {
      clearTimeout(timer);
    });
    debounceTimersRef.current = {};
  }, []);
  
  // Handle midnight reset if enabled
  const setupMidnightCheck = useCallback(() => {
    if (midnightCheckRef.current) {
      clearTimeout(midnightCheckRef.current);
    }
    
    if (!enableMidnightReset) return;
    
    // Get current time and calculate time until next midnight
    const now = new Date();
    const tomorrow = startOfDay(addDays(now, 1));
    
    // Time until midnight in milliseconds
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    console.log(`⏰ Setting up midnight check: ${timeUntilMidnight / 1000 / 60} minutes until midnight refresh`);
    
    // Set timeout for midnight reset
    midnightCheckRef.current = setTimeout(() => {
      console.log('🕛 Midnight reached - refreshing all data!');
      const newDate = new Date();
      setCurrentDate(newDate);
      refreshAll(true);
    }, timeUntilMidnight);
  }, [enableMidnightReset]);

  // Register a callback for specific refresh operations
  const registerRefreshCallback = useCallback((key: string, callback: () => Promise<any>) => {
    refreshCallbacksRef.current.set(key, callback);
  }, []);
  
  // Main refresh function for everything
  const refreshAll = useCallback(async (showToast = false) => {
    if (isRefreshing) {
      console.log('Global refresh already in progress, skipping');
      return;
    }
    
    try {
      setIsRefreshing(true);
      
      if (showToast) {
        toast({
          title: "Refreshing data...",
          description: "Updating all application data",
          duration: 3000,
        });
      }

      // Create a new status map with all operations set to true (refreshing)
      const newStatusMap: Record<string, boolean> = {};
      const promises: Promise<any>[] = [];
      
      // Execute all registered callbacks
      for (const [key, callback] of refreshCallbacksRef.current.entries()) {
        // Skip if this specific refresh is already in progress
        if (activeRefreshesRef.current.has(key)) {
          console.log(`Refresh for ${key} already in progress, skipping in refreshAll`);
          continue;
        }
        
        newStatusMap[key] = true;
        activeRefreshesRef.current.add(key);
        
        const promise = callback().finally(() => {
          activeRefreshesRef.current.delete(key);
          setRefreshStatus(prev => ({ ...prev, [key]: false }));
        });
        
        promises.push(promise);
      }
      
      // Update status map to show all refreshes in progress
      setRefreshStatus(newStatusMap);
      
      // Wait for all refreshes to complete
      await Promise.all(promises);
      
      const now = new Date();
      setLastRefreshTime(now);
      
      if (showToast) {
        toast({
          title: "Refresh complete",
          description: "All data has been updated successfully",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error during refresh:", error);
      if (showToast) {
        toast({
          title: "Refresh failed",
          description: "Unable to update some data. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, toast]);
  
  // Function to refresh specific items with debouncing to prevent rapid consecutive calls
  const refreshSpecific = useCallback(async (
    key: string, 
    callback: () => Promise<any>,
    showToast = false
  ) => {
    // Clear any existing debounce timer for this key
    if (debounceTimersRef.current[key]) {
      clearTimeout(debounceTimersRef.current[key]);
    }
    
    // Register this callback if it's not already registered
    registerRefreshCallback(key, callback);
    
    // Skip if this specific refresh is already in progress
    if (activeRefreshesRef.current.has(key)) {
      console.log(`Refresh for ${key} already in progress, skipping`);
      return null;
    }
    
    // Use debounce to prevent rapid consecutive calls
    return new Promise<any>((resolve) => {
      debounceTimersRef.current[key] = setTimeout(async () => {
        try {
          // Set status for this specific refresh
          setRefreshStatus(prev => ({ ...prev, [key]: true }));
          activeRefreshesRef.current.add(key);
          
          if (showToast) {
            toast({
              title: `Refreshing ${key}...`,
              description: "Please wait while we update the data",
              duration: 2000,
            });
          }
          
          // Run the callback
          const result = await callback();
          
          if (showToast) {
            toast({
              title: "Refresh complete",
              description: `${key} data has been updated`,
              duration: 2000,
            });
          }
          
          resolve(result);
          return result;
        } catch (error) {
          console.error(`Error refreshing ${key}:`, error);
          if (showToast) {
            toast({
              title: "Refresh failed",
              description: `Unable to update ${key} data`,
              variant: "destructive",
              duration: 3000,
            });
          }
          resolve(null);
          return null;
        } finally {
          activeRefreshesRef.current.delete(key);
          setRefreshStatus(prev => ({ ...prev, [key]: false }));
        }
      }, 300); // 300ms debounce
    });
  }, [registerRefreshCallback, toast]);
  
  // Set up interval for regular refreshes - but only after initial render is complete
  useEffect(() => {
    // Skip the first automatic refresh on mount to prevent too many initial refreshes
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const id = setInterval(() => {
      refreshAll(false);
    }, refreshInterval) as unknown as number;
    
    intervalRef.current = id;
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval, refreshAll]);
  
  // Setup midnight check on mount and when enabled status changes
  useEffect(() => {
    setupMidnightCheck();
    return () => {
      if (midnightCheckRef.current) {
        clearTimeout(midnightCheckRef.current);
      }
    };
  }, [setupMidnightCheck]);
  
  const contextValue: RefreshContextType = {
    isRefreshing,
    lastRefreshTime,
    currentDate,
    timeUntilRefresh,
    refreshAll,
    refreshSpecific,
    formatTimeRemaining,
    setCurrentDate,
    cancelScheduledRefreshes,
    refreshStatus
  };
  
  return (
    <RefreshContext.Provider value={contextValue}>
      {children}
    </RefreshContext.Provider>
  );
};

// Custom hook to use the refresh context
export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (context === undefined) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
};
