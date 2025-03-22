
import { useState, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { ObservationsMap } from './observationTypes';
import { isObservationValid, convertCareLogToObservation } from './observationsUtils';

export const useObservationsFetch = (dogs: DogCareStatus[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchDogCareLogs } = useDailyCare();
  const { toast } = useToast();

  // Load observations for all dogs
  const fetchObservations = useCallback(async (): Promise<ObservationsMap> => {
    if (!dogs.length) return {};
    
    setIsLoading(true);
    try {
      // Create a map to store observations for each dog
      const observationsMap: ObservationsMap = {};
      
      // For each dog, fetch care logs with "observation" or "feeding_observation" category
      for (const dog of dogs) {
        const logs = await fetchDogCareLogs(dog.dog_id);
        const dogObservations = logs
          .filter(log => (log.category === 'observation' || log.category === 'feeding_observation'))
          .filter(log => isObservationValid(log.timestamp))
          .map(log => convertCareLogToObservation(log));
          
        if (dogObservations.length > 0) {
          observationsMap[dog.dog_id] = dogObservations;
        }
      }
      
      return observationsMap;
    } catch (error) {
      console.error('Failed to fetch observations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dog observations',
        variant: 'destructive'
      });
      return {};
    } finally {
      setIsLoading(false);
    }
  }, [dogs, fetchDogCareLogs, toast]);

  return {
    fetchObservations,
    isLoading
  };
};
