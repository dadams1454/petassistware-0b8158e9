
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

  return (
    <RefreshContext.Provider value={{
      refreshCounter,
      triggerRefresh,
      dateOffset,
      currentDate,
      setDateOffset,
      formatTimeRemaining,
      nextRefreshTime
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
