
import { useState, useEffect, useCallback, useRef } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useDailyCare } from '@/contexts/dailyCare';

export const useCareLogsData = (sortedDogs: DogCareStatus[]) => {
  const [careLogs, setCareLogs] = useState<Record<string, Record<string, string[]>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { fetchDogCareLogs } = useDailyCare();
  
  // Add caching mechanism
  const cacheExpiryRef = useRef<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  const isFetchingRef = useRef(false);
  
  // Fetch care logs for each dog
  const fetchCareLogs = useCallback(async (forceRefresh = false) => {
    if (!sortedDogs.length) return;
    
    // Skip if already fetching
    if (isFetchingRef.current) {
      console.log('🔍 Already fetching care logs, skipping');
      return;
    }
    
    // Check cache unless force refresh is requested
    const now = Date.now();
    if (!forceRefresh && now < cacheExpiryRef.current) {
      console.log('📋 Using cached care logs, next refresh in', 
        Math.ceil((cacheExpiryRef.current - now) / 1000), 'seconds');
      return;
    }
    
    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      console.log('🔍 Fetching care logs for', sortedDogs.length, 'dogs');
      
      const logsMap: Record<string, Record<string, string[]>> = {};
      
      // For each dog, fetch care logs
      for (const dog of sortedDogs) {
        const logs = await fetchDogCareLogs(dog.dog_id);
        
        // Group logs by category and time slot
        logs.forEach(log => {
          const logDate = new Date(log.timestamp);
          const hour = logDate.getHours();
          const timeSlot = `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
          
          if (!logsMap[dog.dog_id]) {
            logsMap[dog.dog_id] = {};
          }
          
          if (!logsMap[dog.dog_id][log.category]) {
            logsMap[dog.dog_id][log.category] = [];
          }
          
          logsMap[dog.dog_id][log.category].push(timeSlot);
        });
      }
      
      setCareLogs(logsMap);
      
      // Update cache expiry
      cacheExpiryRef.current = Date.now() + CACHE_DURATION;
    } catch (error) {
      console.error('❌ Error fetching care logs:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [fetchDogCareLogs, sortedDogs]);
  
  useEffect(() => {
    fetchCareLogs();
  }, [fetchCareLogs]);

  // Check if a dog has a care log in a specific category and time slot
  const hasCareLogged = useCallback((dogId: string, timeSlot: string, category: string, hasPottyBreak: (dogId: string, timeSlot: string) => boolean) => {
    if (category === 'pottybreaks') {
      return hasPottyBreak(dogId, timeSlot);
    }
    
    return careLogs[dogId]?.[category]?.includes(timeSlot) || false;
  }, [careLogs]);
  
  return {
    careLogs,
    setCareLogs,
    isLoading,
    fetchCareLogs,
    hasCareLogged
  };
};
