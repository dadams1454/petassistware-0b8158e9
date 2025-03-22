
import { useState, useEffect, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { fetchDogCareLogs } from '@/services/dailyCare';
import { isSameDay, startOfDay } from 'date-fns';
import { useMidnightRefresh } from './useMidnightRefresh';
import { useCacheTimer } from './useCacheTimer';
import { useTimeSlotMatching } from './useTimeSlotMatching';
import { CareLog } from './careLogsContext';

export const useCareLogsData = (dogs: DogCareStatus[], activeCategory: string = 'pottybreaks') => {
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Use our new hooks
  const { shouldRefresh, updateCacheTimestamp, resetCache } = useCacheTimer();
  const { matchTimeSlot } = useTimeSlotMatching();
  
  // Fetch care logs function
  const fetchCareLogs = useCallback(async (forceRefresh = false) => {
    if (!dogs || dogs.length === 0) return [];
    
    // Check cache before proceeding
    if (!shouldRefresh(forceRefresh)) {
      return careLogs;
    }
    
    setIsLoading(true);
    console.log(`🔄 Fetching care logs for ${dogs.length} dogs (category: ${activeCategory})`);
    
    try {
      // Create an array of promises to fetch all dogs' care logs
      const promises = dogs.map(dog => fetchDogCareLogs(dog.dog_id));
      
      // Wait for all promises to resolve
      const logsArrays = await Promise.all(promises);
      
      // Flatten the array of arrays into a single array
      const allLogs = logsArrays.flat();
      
      // Filter logs to include only the active category and current date
      const today = startOfDay(currentDate);
      
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
      setCareLogs(filteredLogs);
      updateCacheTimestamp();
      return filteredLogs;
    } catch (error) {
      console.error('❌ Error fetching care logs:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [dogs, activeCategory, currentDate, careLogs, shouldRefresh, updateCacheTimestamp]);
  
  // Handler for midnight refresh
  const handleMidnightRefresh = useCallback(() => {
    setCurrentDate(new Date());
    fetchCareLogs(true);
  }, [fetchCareLogs]);
  
  // Use the midnight refresh hook
  useMidnightRefresh(handleMidnightRefresh);
  
  // Fetch care logs when dogs list changes, active category changes, or current date changes
  useEffect(() => {
    console.log(`🔄 Care logs effect triggered - category: ${activeCategory}`);
    // Reset cache timeout when category or date changes
    resetCache();
    fetchCareLogs(true);
  }, [fetchCareLogs, activeCategory, currentDate, resetCache]);
  
  // Check if a dog has care logged at a specific time slot
  const hasCareLogged = useCallback((dogId: string, timeSlot: string, category: string) => {
    // If category doesn't match active category, return false
    if (category !== activeCategory) return false;
    
    // Skip for potty breaks as they're handled separately
    if (category === 'pottybreaks') return false;
    
    // For debugging
    if (category === 'feeding' && dogId) {
      const dogName = dogs.find(d => d.dog_id === dogId)?.dog_name || dogId;
      const hasRecord = careLogs.some(log => {
        if (log.dog_id === dogId && log.category === category) {
          return matchTimeSlot(log, timeSlot, category);
        }
        return false;
      });
      
      if (hasRecord) {
        console.log(`🍽️ Found feeding record for ${dogName} at ${timeSlot}`);
      }
    }
    
    return careLogs.some(log => {
      // Only consider logs for this dog and category
      if (log.dog_id !== dogId || log.category !== category) return false;
      
      // Use our new helper to match the time slot
      return matchTimeSlot(log, timeSlot, category);
    });
  }, [careLogs, activeCategory, dogs, matchTimeSlot]);
  
  return {
    careLogs,
    fetchCareLogs,
    isLoading,
    hasCareLogged,
    currentDate
  };
};
