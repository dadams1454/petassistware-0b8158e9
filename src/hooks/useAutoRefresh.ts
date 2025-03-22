
import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { startOfDay, addDays } from 'date-fns';

interface AutoRefreshOptions {
  interval?: number; // in milliseconds
  onRefresh: () => Promise<any>;
  enableToasts?: boolean;
  refreshOnMount?: boolean;
  refreshLabel?: string;
  midnightReset?: boolean; // Added this option
}

export const useAutoRefresh = ({
  interval = 15 * 60 * 1000, // Default: 15 minutes
  onRefresh,
  enableToasts = false,
  refreshOnMount = true,
  refreshLabel = 'data',
  midnightReset = false // Default to false
}: AutoRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Added current date state
  const intervalRef = useRef<number | null>(null);
  const midnightCheckRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(false);
  
  // Get time until next refresh in seconds
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(interval / 1000);
  
  // Counter for remaining time until next refresh
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = (new Date().getTime() - lastRefreshTime.getTime()) / 1000;
      const remaining = Math.max(0, Math.floor((interval / 1000) - elapsed));
      setTimeUntilRefresh(remaining);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [interval, lastRefreshTime]);
  
  // Format time until next refresh
  const formatTimeRemaining = useCallback(() => {
    const minutes = Math.floor(timeUntilRefresh / 60);
    const seconds = Math.floor(timeUntilRefresh % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeUntilRefresh]);
  
  // Handle the refresh process
  const handleRefresh = useCallback(async (showToast = false) => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      
      if (showToast) {
        toast({
          title: `Refreshing ${refreshLabel}...`,
          description: "Please wait while we update the latest information.",
          duration: 3000,
        });
      }
      
      await onRefresh();
      const now = new Date();
      setLastRefreshTime(now);
      setCurrentDate(now); // Update current date on refresh
      
      if (showToast && enableToasts) {
        toast({
          title: "Refresh complete",
          description: `${refreshLabel} has been updated successfully.`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error during refresh:", error);
      if (showToast) {
        toast({
          title: "Refresh failed",
          description: `Unable to update ${refreshLabel}. Please try again.`,
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, onRefresh, enableToasts, refreshLabel]);
  
  // Setup midnight check/reset functionality
  const setupMidnightCheck = useCallback(() => {
    if (midnightCheckRef.current) {
      clearTimeout(midnightCheckRef.current);
    }
    
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
      handleRefresh(true);
    }, timeUntilMidnight);
    
    return () => {
      if (midnightCheckRef.current) {
        clearTimeout(midnightCheckRef.current);
      }
    };
  }, [handleRefresh]);

  // Setup the midnight reset if enabled
  useEffect(() => {
    if (midnightReset) {
      const cleanup = setupMidnightCheck();
      return cleanup;
    }
  }, [midnightReset, setupMidnightCheck]);
  
  // Set up the interval for auto-refresh
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set new interval
    const id = setInterval(() => {
      handleRefresh(enableToasts);
    }, interval) as unknown as number;
    
    intervalRef.current = id;
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, handleRefresh, enableToasts]);
  
  // Initial refresh on mount
  useEffect(() => {
    if (refreshOnMount && !isMountedRef.current) {
      isMountedRef.current = true;
      handleRefresh(false);
    }
  }, [refreshOnMount, handleRefresh]);
  
  return {
    isRefreshing,
    lastRefreshTime,
    handleRefresh,
    timeUntilRefresh,
    formatTimeRemaining,
    currentDate // Now returning currentDate
  };
};
