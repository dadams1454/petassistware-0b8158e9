
import { useState, useCallback, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';

export const useDailyCareRefresh = () => {
  const { loading, fetchAllDogsWithCareStatus } = useDailyCare();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const midnightCheckRef = useRef<NodeJS.Timeout | null>(null);
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  // Increase auto-refresh interval to reduce server load
  const AUTO_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Setup midnight check to refresh data at midnight
  const setupMidnightCheck = useCallback(() => {
    // Clear any existing interval
    if (midnightCheckRef.current) {
      clearTimeout(midnightCheckRef.current);
    }
    
    // Get current time and calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // Time until midnight in milliseconds
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    console.log(`⏰ Setting up midnight check: ${timeUntilMidnight / 1000 / 60} minutes until midnight refresh`);
    
    // Set timeout for midnight reset
    midnightCheckRef.current = setTimeout(() => {
      console.log('🕛 Midnight reached - refreshing all dog data!');
      const newDate = new Date();
      setCurrentDate(newDate);
      
      // Force refresh at midnight
      fetchAllDogsWithCareStatus(newDate, true)
        .then(dogs => {
          console.log(`✅ Midnight refresh: ${dogs.length} dogs loaded for ${format(newDate, 'PP')}`);
          setLastRefresh(new Date());
        })
        .catch(error => {
          console.error('❌ Error during midnight refresh:', error);
        });
    }, timeUntilMidnight);
    
    return () => {
      if (midnightCheckRef.current) {
        clearTimeout(midnightCheckRef.current);
      }
    };
  }, [fetchAllDogsWithCareStatus]);

  // Handle auto-refresh functionality
  useEffect(() => {
    const handleRefresh = async () => {
      console.log('🔄 Auto refresh triggered');
      
      try {
        const dogs = await fetchAllDogsWithCareStatus(currentDate, true);
        console.log(`✅ Auto refreshed: ${dogs.length} dogs loaded`);
        setLastRefresh(new Date());
      } catch (error) {
        console.error('❌ Error during auto refresh:', error);
      }
    };
    
    // Setup refresh interval
    autoRefreshRef.current = setInterval(handleRefresh, AUTO_REFRESH_INTERVAL);
    
    // Setup visibility change handler to refresh when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('🔍 Page became visible, triggering refresh');
        handleRefresh();
      }
    };
    
    // Listen for visibility changes (user returns to tab)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up on unmount
    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchAllDogsWithCareStatus, currentDate]);

  // Set up midnight check
  useEffect(() => {
    const cleanupMidnightCheck = setupMidnightCheck();
    return () => cleanupMidnightCheck();
  }, [setupMidnightCheck]);

  // Initial fetch only once on component mount
  useEffect(() => {
    console.log(`🚀 DailyCare page - initial fetch for ${format(currentDate, 'PP')}`);
    
    // Force a fetch on component mount to ensure we have data
    fetchAllDogsWithCareStatus(currentDate, true)
      .then(dogs => {
        console.log('✅ Initial fetch - dogs count:', dogs.length);
        setLastRefresh(new Date());
      })
      .catch(error => {
        console.error('❌ Error on initial fetch:', error);
      });
  }, [fetchAllDogsWithCareStatus, currentDate]);
  
  return {
    currentDate,
    lastRefresh,
    loading
  };
};
