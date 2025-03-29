
import { useState, useCallback, useRef } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { ObservationMap } from './observationTypes';
import { isObservationValid, convertCareLogToObservation } from './observationsUtils';

export const useObservationsFetch = (dogs: DogCareStatus[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchDogCareLogs } = useDailyCare();
  const { toast } = useToast();
  const fetchInProgress = useRef(false);
  const cachedObservations = useRef<ObservationMap>({});
  const lastFetchTime = useRef<Record<string, number>>({});
  
  // Cache expiration time - 2 minutes
  const CACHE_EXPIRATION = 2 * 60 * 1000;

  // Load observations for all dogs with caching
  const fetchObservations = useCallback(async (forceRefresh = false): Promise<ObservationMap> => {
    if (!dogs.length) return {};
    
    // Skip if already fetching
    if (fetchInProgress.current && !forceRefresh) {
      console.log('Fetch already in progress, returning cached data');
      return cachedObservations.current;
    }
    
    setIsLoading(true);
    fetchInProgress.current = true;
    
    try {
      // Create a map to store observations for each dog
      const observationsMap: ObservationMap = {};
      const now = Date.now();
      let fetchCount = 0;
      
      // For each dog, fetch care logs with "observation" or "feeding_observation" category
      for (const dog of dogs) {
        const dogId = dog.dog_id;
        const lastFetch = lastFetchTime.current[dogId] || 0;
        
        // Skip if we fetched recently and don't need to force refresh
        if (!forceRefresh && now - lastFetch < CACHE_EXPIRATION && cachedObservations.current[dogId]) {
          console.log(`Using cached observations for dog ${dogId}, age: ${(now - lastFetch)/1000}s`);
          observationsMap[dogId] = cachedObservations.current[dogId];
          continue;
        }
        
        fetchCount++;
        const logs = await fetchDogCareLogs(dogId);
        const dogObservations = logs
          .filter(log => (log.category === 'observation' || log.category === 'feeding_observation'))
          .filter(log => isObservationValid(log.timestamp))
          .map(log => convertCareLogToObservation(log));
          
        if (dogObservations.length > 0) {
          observationsMap[dogId] = dogObservations;
          // Update last fetch time for this dog
          lastFetchTime.current[dogId] = now;
        }
      }
      
      console.log(`Fetched observations for ${fetchCount}/${dogs.length} dogs`);
      
      // Update cache with new data
      cachedObservations.current = {...cachedObservations.current, ...observationsMap};
      
      return observationsMap;
    } catch (error) {
      console.error('Failed to fetch observations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dog observations',
        variant: 'destructive'
      });
      return cachedObservations.current;
    } finally {
      setIsLoading(false);
      // Release lock after a small delay to prevent immediate refetch
      setTimeout(() => {
        fetchInProgress.current = false;
      }, 300);
    }
  }, [dogs, fetchDogCareLogs, toast]);

  return {
    fetchObservations,
    isLoading
  };
};
