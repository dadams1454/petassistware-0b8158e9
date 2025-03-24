
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RefreshContextType {
  refreshAll: (showToast?: boolean) => Promise<void>;
  refreshSpecific: <T>(key: string, fetchFn: () => Promise<T>, showToast?: boolean) => Promise<T | null>;
  refreshStatus: Record<string, boolean>;
  lastRefreshTime: number;
  formatTimeRemaining: () => string;
  currentDate: Date;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshStatus, setRefreshStatus] = useState<Record<string, boolean>>({});
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const [currentDate, setCurrentDate] = useState(new Date());
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  // Auto-refresh every 3 minutes
  const REFRESH_INTERVAL = 180000; // 3 minutes
  
  // Set up automatic refresh timer
  useEffect(() => {
    // Start the refresh timer
    refreshTimerRef.current = setInterval(() => {
      console.log('Auto-refresh triggered');
      refreshAll(false);
    }, REFRESH_INTERVAL);
    
    // Clean up timer on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);
  
  // Update current date at midnight
  useEffect(() => {
    const checkDateChange = () => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate() || 
          now.getMonth() !== currentDate.getMonth() || 
          now.getFullYear() !== currentDate.getFullYear()) {
        console.log('Date changed, updating context date');
        setCurrentDate(now);
      }
    };
    
    // Check date change every hour
    const dateCheckInterval = setInterval(checkDateChange, 3600000);
    
    return () => {
      clearInterval(dateCheckInterval);
    };
  }, [currentDate]);
  
  // Refresh all data - central function
  const refreshAll = useCallback(async (showToast = true) => {
    try {
      if (showToast) {
        toast({
          title: "Refreshing data...",
          description: "Updating with the latest information",
          duration: 2000,
        });
      }
      
      // Set all refresh statuses to true
      setRefreshStatus(prev => {
        const newStatus: Record<string, boolean> = {};
        Object.keys(prev).forEach(key => {
          newStatus[key] = true;
        });
        return newStatus;
      });
      
      // Update refresh timestamp
      setLastRefreshTime(Date.now());
      
      // We don't actually fetch anything here - each component will handle 
      // its own data fetching in response to the refreshStatus change
      
      // Small delay to ensure the UI responds
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Reset all refresh statuses
      setRefreshStatus(prev => {
        const newStatus: Record<string, boolean> = {};
        Object.keys(prev).forEach(key => {
          newStatus[key] = false;
        });
        return newStatus;
      });
      
    } catch (error) {
      console.error('Error during refresh all:', error);
      
      if (showToast) {
        toast({
          title: "Refresh failed",
          description: "There was a problem updating the data",
          variant: "destructive",
        });
      }
      
      // Reset statuses on error
      setRefreshStatus({});
    }
  }, [toast]);
  
  // Refresh specific data with provided fetch function
  const refreshSpecific = useCallback(async <T,>(
    key: string, 
    fetchFn: () => Promise<T>,
    showToast = false
  ): Promise<T | null> => {
    try {
      // Set this specific item's refresh status
      setRefreshStatus(prev => ({
        ...prev,
        [key]: true
      }));
      
      if (showToast) {
        toast({
          title: "Refreshing data...",
          description: `Updating ${key} information`,
          duration: 2000,
        });
      }
      
      // Perform the actual data fetching
      const result = await fetchFn();
      
      // Reset this item's refresh status
      setRefreshStatus(prev => ({
        ...prev,
        [key]: false
      }));
      
      // Update the last refresh time
      setLastRefreshTime(Date.now());
      
      return result;
    } catch (error) {
      console.error(`Error refreshing ${key}:`, error);
      
      // Reset this item's refresh status on error
      setRefreshStatus(prev => ({
        ...prev,
        [key]: false
      }));
      
      if (showToast) {
        toast({
          title: "Refresh failed",
          description: `There was a problem updating ${key}`,
          variant: "destructive",
        });
      }
      
      return null;
    }
  }, [toast]);
  
  // Format time remaining until next refresh
  const formatTimeRemaining = useCallback(() => {
    const nextRefresh = lastRefreshTime + REFRESH_INTERVAL;
    const now = Date.now();
    const timeLeft = Math.max(0, nextRefresh - now);
    
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  }, [lastRefreshTime]);
  
  const value = {
    refreshAll,
    refreshSpecific,
    refreshStatus,
    lastRefreshTime,
    formatTimeRemaining,
    currentDate
  };
  
  return (
    <RefreshContext.Provider value={value}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (context === undefined) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
};
