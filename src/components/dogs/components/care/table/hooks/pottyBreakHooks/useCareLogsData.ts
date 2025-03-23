
import { useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { fetchDogCareLogs } from '@/services/dailyCare';
import { compareDesc, isSameDay, startOfDay } from 'date-fns';
import { useQueryWithRefresh } from '@/hooks/useQueryWithRefresh';
import { useRefreshTimestamp } from '@/contexts/refreshTimestamp';

interface CareLog {
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
}

export const useCareLogsData = (dogs: DogCareStatus[], activeCategory: string = 'pottybreaks') => {
  const { lastRefresh } = useRefreshTimestamp();
  const today = startOfDay(new Date());
  
  // Use React Query to fetch care logs
  const { 
    data: careLogs = [], 
    isLoading,
    refetch: refetchCareLogs
  } = useQueryWithRefresh({
    queryKey: ['careLogs', activeCategory, today.toISOString(), lastRefresh],
    queryFn: async () => {
      if (!dogs || dogs.length === 0) return [];
      
      try {
        // Create an array of promises to fetch all dogs' care logs
        const promises = dogs.map(dog => fetchDogCareLogs(dog.dog_id));
        
        // Wait for all promises to resolve
        const logsArrays = await Promise.all(promises);
        
        // Flatten the array of arrays into a single array
        const allLogs = logsArrays.flat();
        
        // Filter logs to include only the active category and current date
        const filteredLogs = allLogs.filter(log => {
          // First check if log is from today
          const logDate = new Date(log.timestamp);
          const isToday = isSameDay(logDate, today);
          
          if (!isToday) return false;
          
          // Then check category
          if (activeCategory === 'feeding') {
            return log.category === 'feeding';
          }
          return true; // When on potty tab, we show all logs in the observation column
        });
        
        console.log(`📊 Filtered ${filteredLogs.length} care logs for ${activeCategory} on ${today.toDateString()}`);
        return filteredLogs;
      } catch (error) {
        console.error('Error fetching care logs:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: dogs.length > 0,
    refreshLabel: 'care logs'
  });
  
  // Fetch care logs - now just a wrapper for the React Query refetch
  const fetchCareLogs = useCallback(async () => {
    if (dogs && dogs.length > 0) {
      await refetchCareLogs();
    }
  }, [dogs, refetchCareLogs]);
  
  // Check if a dog has care logged at a specific time slot
  const hasCareLogged = useCallback((dogId: string, timeSlot: string, category: string) => {
    // If category doesn't match active category, return false
    if (category !== activeCategory) return false;
    
    // Skip for potty breaks as they're handled separately
    if (category === 'pottybreaks') return false;
    
    return careLogs.some(log => {
      // Only consider logs for this dog and category
      if (log.dog_id !== dogId || log.category !== category) return false;
      
      // For feeding with named time slots
      if (category === 'feeding') {
        // Parse timestamp and check if it matches the time slot (Morning, Noon, Evening)
        const logDate = new Date(log.timestamp);
        const logHour = logDate.getHours();
        
        // Check time ranges:
        // Morning: 5-10, Noon: 10-3, Evening: 3-8
        if (timeSlot === 'Morning' && (logHour >= 5 && logHour < 10)) return true;
        if (timeSlot === 'Noon' && (logHour >= 10 && logHour < 15)) return true;
        if (timeSlot === 'Evening' && ((logHour >= 15 && logHour < 24) || (logHour >= 0 && logHour < 5))) return true;
        
        // Another option is to check the task_name directly
        return log.task_name === `${timeSlot} Feeding`;
      } else {
        // Original logic for other categories
        const logDate = new Date(log.timestamp);
        const logHour = logDate.getHours();
        const logMinutes = logDate.getMinutes();
        
        // Format for comparison (e.g., "8:00 AM")
        const period = logHour >= 12 ? 'PM' : 'AM';
        const hour12 = logHour === 0 ? 12 : logHour > 12 ? logHour - 12 : logHour;
        const formattedLogTime = `${hour12}:${logMinutes === 0 ? '00' : logMinutes} ${period}`;
        
        // Check if the normalized time matches the time slot
        return timeSlot === formattedLogTime;
      }
    });
  }, [careLogs, activeCategory]);
  
  return {
    careLogs,
    fetchCareLogs,
    isLoading,
    hasCareLogged,
    currentDate: today
  };
};
