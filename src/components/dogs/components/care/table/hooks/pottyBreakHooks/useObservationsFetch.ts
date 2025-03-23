
import { useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { ObservationsMap } from './observationTypes';
import { isObservationValid, convertCareLogToObservation } from './observationsUtils';
import { useQueryWithRefresh } from '@/hooks/useQueryWithRefresh';
import { useRefreshTimestamp } from '@/contexts/refreshTimestamp';

export const useObservationsFetch = (dogs: DogCareStatus[]) => {
  const { fetchDogCareLogs } = useDailyCare();
  const { toast } = useToast();
  const { lastRefresh } = useRefreshTimestamp();

  // Use React Query for observations
  const { 
    data: observationsMap = {}, 
    isLoading,
    refetch
  } = useQueryWithRefresh({
    queryKey: ['observations', dogs.map(d => d.dog_id).join(','), lastRefresh],
    queryFn: async () => {
      if (!dogs.length) return {};
      
      try {
        // Create a map to store observations for each dog
        const newObservationsMap: ObservationsMap = {};
        
        // For each dog, fetch care logs with "observation" or "feeding_observation" category
        for (const dog of dogs) {
          const logs = await fetchDogCareLogs(dog.dog_id);
          const dogObservations = logs
            .filter(log => (log.category === 'observation' || log.category === 'feeding_observation'))
            .filter(log => isObservationValid(log.timestamp))
            .map(log => convertCareLogToObservation(log));
            
          if (dogObservations.length > 0) {
            newObservationsMap[dog.dog_id] = dogObservations;
          }
        }
        
        return newObservationsMap;
      } catch (error) {
        console.error('Failed to fetch observations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dog observations',
          variant: 'destructive'
        });
        return {};
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: dogs.length > 0,
    refreshLabel: 'observations'
  });

  // Wrap the refetch function
  const fetchObservations = useCallback(async () => {
    if (dogs.length) {
      await refetch();
    }
    return observationsMap;
  }, [dogs, refetch, observationsMap]);

  return {
    fetchObservations,
    isLoading
  };
};
