
import { useState, useEffect, useCallback, useRef } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { fetchDogCareLogs } from '@/services/dailyCare/careLogsService';
import { isSameDay, startOfDay } from 'date-fns';
import { useMidnightRefresh } from './useMidnightRefresh';
import { useCacheTimer } from './useCacheTimer';
import { CareLog } from './careLogsContext';
import { useHasCareLogged } from './useHasCareLogged';
import { useToast } from '@/components/ui/use-toast';

export const useCareLogsData = (dogs: DogCareStatus[], activeCategory: string = 'pottybreaks') => {
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [fetchErrors, setFetchErrors] = useState(0);
  const { toast } = useToast();
  
  // Cache for individual dog logs to prevent repeated failures
  const dogLogsCache = useRef<Record<string, CareLog[]>>({});
  
  // Use our specialized hooks
  const { shouldRefresh, updateCacheTimestamp, resetCache } = useCacheTimer();
  const { hasCareLogged } = useHasCareLogged(careLogs, activeCategory, dogs);
  
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
      // Reset error counter
      setFetchErrors(0);
      
      // Create an array of promises to fetch all dogs' care logs
      const logsPromises = dogs.map(dog => {
        // Check if we have cached logs for this dog
        if (dogLogsCache.current[dog.dog_id] && !forceRefresh) {
          console.log(`📋 Using cached logs for dog ${dog.dog_id}`);
          return Promise.resolve(dogLogsCache.current[dog.dog_id]);
        }
        
        // Otherwise fetch fresh logs
        return fetchDogCareLogs(dog.dog_id)
          .then(logs => {
            // Cache successful results
            if (logs && logs.length > 0) {
              dogLogsCache.current[dog.dog_id] = logs;
            }
            return logs;
          })
          .catch(err => {
            console.error(`Failed to fetch logs for dog ${dog.dog_id}:`, err);
            setFetchErrors(prev => prev + 1);
            // Return cached data if available, empty array otherwise
            return dogLogsCache.current[dog.dog_id] || [];
          });
      });
      
      // Wait for all promises to resolve, handling any errors
      const logsArrays = await Promise.allSettled(logsPromises);
      
      // Process results, using fulfilled values and ignoring rejected promises
      const allLogs = logsArrays.flatMap(result => 
        result.status === 'fulfilled' ? result.value : []
      );
      
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
      
      // Show toast if there were errors but we still have some data
      if (fetchErrors > 0 && filteredLogs.length > 0) {
        toast({
          title: "Partial data loaded",
          description: `Some dogs' data couldn't be loaded. Using cached data where available.`,
          variant: "default" // Changed from "warning" to "default"
        });
      }
      
      return filteredLogs;
    } catch (error) {
      console.error('❌ Error fetching care logs:', error);
      
      // Show toast only for complete failures
      if (careLogs.length === 0) {
        toast({
          title: "Data loading error",
          description: "Failed to load care logs. Please try refreshing.",
          variant: "destructive"
        });
      }
      
      return careLogs;
    } finally {
      setIsLoading(false);
    }
  }, [dogs, activeCategory, currentDate, careLogs, shouldRefresh, updateCacheTimestamp, toast]);
  
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
  
  return {
    careLogs,
    fetchCareLogs,
    isLoading,
    hasCareLogged,
    currentDate
  };
};
