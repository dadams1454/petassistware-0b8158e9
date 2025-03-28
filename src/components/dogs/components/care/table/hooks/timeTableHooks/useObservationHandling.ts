
import { useState, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { ObservationType } from '../../components/observation/ObservationDialog';

/**
 * Hook to manage observation functionality
 */
export const useObservationHandling = (
  dogsStatus: DogCareStatus[],
  activeCategory: string,
  onRefresh: () => void
) => {
  // State to hold observations
  const [observations, setObservations] = useState<Record<string, any[]>>({});
  
  // Handler for observation submission
  const handleObservationSubmit = useCallback(async (
    dogId: string, 
    observation: string, 
    observationType: ObservationType,
    timestamp?: Date
  ): Promise<void> => {
    console.log('Observation submitted:', { dogId, observation, observationType, timestamp });
    
    // Store the observation locally (would typically be saved to a database)
    setObservations(prev => {
      const dogObservations = prev[dogId] || [];
      return {
        ...prev,
        [dogId]: [
          ...dogObservations,
          {
            id: Date.now().toString(),
            observation,
            observation_type: observationType,
            created_at: (timestamp || new Date()).toISOString()
          }
        ]
      };
    });
    
    // After submission, refresh the data
    onRefresh();
    
    // Return a resolved promise to satisfy TypeScript
    return Promise.resolve();
  }, [onRefresh, setObservations]);

  return { observations, handleObservationSubmit };
};
