import { useState, useEffect, useCallback, useRef } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { compareDesc, isSameDay, startOfDay } from 'date-fns';
import { fetchDogCareLogs } from '@/services/dailyCare/careLogsService';

interface CareLog {
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
}

export const useCareLogsData = (dogs: DogCareStatus[], activeCategory: string = 'pottybreaks') => {
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const midnightCheckRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to check if it's midnight and trigger a refresh
  const setupMidnightCheck = useCallback(() => {
    // Clear any existing interval
    if (midnightCheckRef.current) {
      clearInterval(midnightCheckRef.current);
    }
    
    // Get current time and calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // Time until midnight in milliseconds
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    console.log(`⏰ Setting up midnight check: ${timeUntilMidnight / 1000 / 60} minutes until midnight refresh`);
    
    // Set timeout for immediate midnight reset
    midnightCheckRef.current = setTimeout(() => {
      console.log('🕛 Midnight reached - refreshing feeding data...');
      setCurrentDate(new Date());
      fetchCareLogs();
      
      // Set up daily check after first trigger
      midnightCheckRef.current = setInterval(() => {
        console.log('🕛 Daily midnight refresh triggered');
        setCurrentDate(new Date());
        fetchCareLogs();
      }, 24 * 60 * 60 * 1000); // Check every 24 hours
    }, timeUntilMidnight);
    
    return () => {
      if (midnightCheckRef.current) {
        clearTimeout(midnightCheckRef.current);
        clearInterval(midnightCheckRef.current);
      }
    };
  }, []);
  
  const fetchCareLogs = useCallback(async () => {
    if (!dogs || dogs.length === 0) return;
    setIsLoading(true);
    
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
    } catch (error) {
      console.error('Error fetching care logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dogs, activeCategory, currentDate]);
  
  // Fetch care logs when dogs list changes, active category changes, or current date changes
  useEffect(() => {
    fetchCareLogs();
  }, [fetchCareLogs]);
  
  // Set up midnight check when component mounts
  useEffect(() => {
    const cleanupMidnightCheck = setupMidnightCheck();
    return () => cleanupMidnightCheck();
  }, [setupMidnightCheck]);
  
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
    currentDate
  };
};
