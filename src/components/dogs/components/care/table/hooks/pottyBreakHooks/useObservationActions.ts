
import { useState, useCallback } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { ObservationsMap } from './observationTypes';
import { getTimeSlotFromTimestamp } from './observationsUtils';

export const useObservationActions = (
  observations: ObservationsMap,
  setObservations: React.Dispatch<React.SetStateAction<ObservationsMap>>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCareLog } = useDailyCare();
  const { toast } = useToast();

  // Add a new observation
  const addObservation = useCallback(async (
    dogId: string, 
    observationText: string, 
    observationType: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
    timeSlot: string = '',
    category: string = 'observation',
    timestamp = new Date()
  ) => {
    setIsSubmitting(true);
    try {
      // If observation text is empty, use the observation type as the text
      const defaultText = observationText.trim() || 
        observationType === 'feeding' 
          ? `Didn't eat ${timeSlot} meal`
          : `${observationType.charAt(0).toUpperCase() + observationType.slice(1)} observed`;
      
      // Always use current timestamp
      const currentTimestamp = new Date();
      
      const result = await addCareLog({
        dog_id: dogId,
        category: category,
        task_name: observationType,
        timestamp: currentTimestamp,
        notes: defaultText
      });
      
      if (result) {
        // Calculate the time slot based on category
        const calculatedTimeSlot = category === 'feeding_observation'
          ? timeSlot // Use the provided time slot for feeding
          : getTimeSlotFromTimestamp(currentTimestamp.toString());
        
        // Update local state
        setObservations(prev => {
          const newObservations = { ...prev };
          const newObservation = {
            id: result.id,
            dog_id: result.dog_id,
            created_at: result.created_at,
            observation: result.notes || defaultText,
            observation_type: observationType,
            created_by: result.created_by,
            expires_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
            timeSlot: calculatedTimeSlot,
            category: category
          };
          
          if (!newObservations[dogId]) {
            newObservations[dogId] = [];
          }
          
          newObservations[dogId].push(newObservation);
          return newObservations;
        });
        
        toast({
          title: category === 'feeding_observation' ? 'Feeding Issue Recorded' : 'Observation Added',
          description: 'Your observation has been recorded and will be visible for 24 hours'
        });
      }
    } catch (error) {
      console.error('Failed to add observation:', error);
      toast({
        title: 'Error',
        description: 'Failed to add observation',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
    
    return isSubmitting;
  }, [addCareLog, toast, setObservations]);

  return {
    addObservation,
    isSubmitting
  };
};
