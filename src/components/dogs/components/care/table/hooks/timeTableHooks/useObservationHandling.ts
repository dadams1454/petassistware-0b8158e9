
import { useCallback } from 'react';
import { useObservations } from '../pottyBreakHooks/useObservations';
import { DogCareStatus } from '@/types/dailyCare';
import { ObservationType } from '../pottyBreakHooks/observationTypes';

/**
 * Hook to manage observation functionality
 */
export const useObservationHandling = (
  dogsStatus: DogCareStatus[],
  activeCategory: string,
  onRefresh: () => void
) => {
  // Get observations and add observation function
  const { observations, addObservation } = useObservations(dogsStatus);
  
  // Handler for observation submission
  const handleObservationSubmit = useCallback(async (
    dogId: string, 
    observationText: string, 
    observationType: ObservationType,
    timestamp?: Date
  ): Promise<void> => {
    // Always use 'observation' category now that we only have potty breaks
    const category = 'observation';
    
    // Determine the time slot based on timestamp
    const timeSlot = timestamp ? `${timestamp.getHours() % 12 || 12}:00 ${timestamp.getHours() >= 12 ? 'PM' : 'AM'}` : '';
    
    // Add the observation
    await addObservation(dogId, observationText, observationType, timeSlot, category, timestamp);
    
    // Refresh data
    onRefresh();
  }, [activeCategory, addObservation, onRefresh]);

  return {
    observations,
    handleObservationSubmit
  };
};
