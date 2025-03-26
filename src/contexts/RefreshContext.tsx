
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

interface RefreshContextValue {
  refreshCounter: number;
  triggerRefresh: () => void;
  dateOffset: number;
  currentDate: Date;
  setDateOffset: (offset: number) => void;
  formatTimeRemaining: (targetDate: Date) => string;
  nextRefreshTime: Date | null;
  refreshSpecific: <T>(key: string, fetchFn: () => Promise<T>, showToast?: boolean) => Promise<T | null>;
  refreshStatus: Record<string, boolean>;
  refreshAll: (showToast?: boolean) => Promise<void>;
}

const RefreshContext = createContext<RefreshContextValue | undefined>(undefined);

interface RefreshProviderProps {
  children: ReactNode;
}

export const RefreshProvider: React.FC<RefreshProviderProps> = ({ children }) => {
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [dateOffset, setDateOffset] = useState<number>(0);
  const [nextRefreshTime, setNextRefreshTime] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [refreshStatus, setRefreshStatus] = useState<Record<string, boolean>>({});

  // Update current date whenever date offset changes
  useEffect(() => {
    const now = new Date();
    const newDate = dateOffset === 0 ? now : dateOffset > 0 
      ? addDays(now, dateOffset) 
      : subDays(now, Math.abs(dateOffset));
    
    setCurrentDate(newDate);
    console.log(`Date set to: ${format(newDate, 'yyyy-MM-dd')} (offset: ${dateOffset})`);
  }, [dateOffset]);

  // Trigger a refresh of data
  const triggerRefresh = useCallback(() => {
    console.log('Manual refresh triggered');
    setRefreshCounter(prev => prev + 1);
    setNextRefreshTime(new Date(Date.now() + 3 * 60 * 1000)); // Next auto refresh in 3 minutes
    
    toast({
      title: "Data refreshed",
      description: "Dashboard data has been updated"
    });
  }, []);

  // Format time remaining until next refresh
  const formatTimeRemaining = useCallback((targetDate: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.round((targetDate.getTime() - now.getTime()) / 1000);
    
    if (diffInSeconds <= 0) return "refreshing...";
    
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, []);

  // Auto-refresh timer
  useEffect(() => {
    if (!nextRefreshTime) return;
    
    const checkRefresh = () => {
      const now = new Date();
      if (nextRefreshTime && now >= nextRefreshTime) {
        setRefreshCounter(prev => prev + 1);
        setNextRefreshTime(new Date(Date.now() + 3 * 60 * 1000)); // Next refresh in 3 minutes
      }
    };
    
    const interval = setInterval(checkRefresh, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [nextRefreshTime]);

  // Refresh a specific data set
  const refreshSpecific = useCallback(async <T,>(
    key: string, 
    fetchFn: () => Promise<T>, 
    showToast = false
  ): Promise<T | null> => {
    try {
      console.log(`Refreshing data for key: ${key}`);
      
      // Set loading state for this key
      setRefreshStatus(prev => ({ ...prev, [key]: true }));
      
      // If toast requested, show one
      if (showToast) {
        toast({
          title: "Refreshing data...",
          description: `Updating ${key} data`,
          duration: 2000,
        });
      }
      
      // Call the fetch function provided
      const result = await fetchFn();
      
      // Handle successful data fetch
      console.log(`Data refreshed for key: ${key}`);
      return result;
    } catch (error) {
      console.error(`Error refreshing data for ${key}:`, error);
      
      // Show error toast if requested
      if (showToast) {
        toast({
          title: "Refresh failed",
          description: `Could not update ${key} data`,
          variant: "destructive",
          duration: 3000,
        });
      }
      
      return null;
    } finally {
      // Clear loading state
      setRefreshStatus(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  // Refresh all data (global refresh)
  const refreshAll = useCallback(async (showToast = false) => {
    console.log('Refreshing all data');
    
    if (showToast) {
      toast({
        title: "Refreshing all data",
        description: "Updating all dashboard data",
        duration: 2000,
      });
    }
    
    // Trigger the global refresh counter
    setRefreshCounter(prev => prev + 1);
    
    // Set next auto-refresh time
    setNextRefreshTime(new Date(Date.now() + 3 * 60 * 1000));
  }, []);

  return (
    <RefreshContext.Provider value={{
      refreshCounter,
      triggerRefresh,
      dateOffset,
      currentDate,
      setDateOffset,
      formatTimeRemaining,
      nextRefreshTime,
      refreshSpecific,
      refreshStatus,
      refreshAll
    }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = (): RefreshContextValue => {
  const context = useContext(RefreshContext);
  if (context === undefined) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
};
