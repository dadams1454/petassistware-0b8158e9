
import { useState, useCallback } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { ObservationsMap } from './observationTypes';
import { getTimeSlotFromTimestamp } from './observationsUtils';

/**
 * Hook for managing observation actions like adding new observations
 * 
 * @param observations - Current observations map keyed by dog ID
 * @param setObservations - Function to update the observations state
 * @returns Object with observation-related actions and loading state
 */
export const useObservationActions = (
  observations: ObservationsMap,
  setObservations: React.Dispatch<React.SetStateAction<ObservationsMap>>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCareLog } = useDailyCare();
  const { toast } = useToast();

  /**
   * Add a new observation for a dog
   * 
   * @param dogId - The ID of the dog
   * @param observationText - The observation text content
   * @param observationType - Type of observation (accident, heat, behavior, feeding, other)
   * @param timeSlot - Optional time slot for the observation
   * @param category - Category of the observation (defaults to 'observation')
   * @param timestamp - Optional timestamp for the observation (defaults to current time)
   * @returns Promise resolving to the loading state
   */
  const addObservation = useCallback(async (
    dogId: string, 
    observationText: string, 
    observationType: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
    timeSlot: string = '',
    category: string = 'observation',
    timestamp = new Date()
  ) => {
    if (isSubmitting) {
      return true; // Already submitting, prevent duplicate submissions
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the observation text or use a default based on type
      const defaultText = formatObservationText(observationText, observationType, timeSlot);
      
      // Use current timestamp for consistency
      const currentTimestamp = new Date();
      
      // Add the care log to the database
      const result = await addObservation_toDB(
        dogId, 
        defaultText, 
        observationType, 
        category, 
        currentTimestamp
      );
      
      if (result) {
        // Update the local state with the new observation
        updateLocalObservationsState(
          dogId, 
          result, 
          defaultText, 
          observationType, 
          category, 
          timeSlot || getTimeSlotFromTimestamp(currentTimestamp.toString())
        );
        
        // Show success toast
        showSuccessToast(category);
      }
    } catch (error) {
      // Handle and log error
      handleObservationError(error);
    } finally {
      setIsSubmitting(false);
    }
    
    return isSubmitting;
  }, [addCareLog, toast, setObservations, isSubmitting]);

  /**
   * Format observation text or use default text if empty
   */
  const formatObservationText = (
    text: string, 
    type: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
    timeSlot: string
  ): string => {
    const trimmedText = text.trim();
    if (trimmedText) return trimmedText;
    
    // Default text based on observation type
    if (type === 'feeding') {
      return `Didn't eat ${timeSlot} meal`;
    }
    
    return `${type.charAt(0).toUpperCase() + type.slice(1)} observed`;
  };

  /**
   * Add the observation to the database
   */
  const addObservation_toDB = async (
    dogId: string,
    notes: string,
    taskName: string,
    category: string,
    timestamp: Date
  ) => {
    return await addCareLog({
      dog_id: dogId,
      category: category,
      task_name: taskName,
      timestamp: timestamp,
      notes: notes
    });
  };

  /**
   * Update the local observations state with the new observation
   */
  const updateLocalObservationsState = (
    dogId: string,
    result: any,
    observationText: string,
    observationType: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
    category: string,
    timeSlot: string
  ) => {
    setObservations(prev => {
      const newObservations = { ...prev };
      const newObservation = {
        id: result.id,
        dog_id: result.dog_id,
        created_at: result.created_at,
        observation: result.notes || observationText,
        observation_type: observationType,
        created_by: result.created_by,
        expires_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
        timeSlot: timeSlot,
        category: category
      };
      
      if (!newObservations[dogId]) {
        newObservations[dogId] = [];
      }
      
      newObservations[dogId].push(newObservation);
      return newObservations;
    });
  };

  /**
   * Show success toast based on category
   */
  const showSuccessToast = (category: string) => {
    toast({
      title: category === 'feeding_observation' ? 'Feeding Issue Recorded' : 'Observation Added',
      description: 'Your observation has been recorded and will be visible for 24 hours'
    });
  };

  /**
   * Handle and log observation errors
   */
  const handleObservationError = (error: unknown) => {
    console.error('Failed to add observation:', error);
    toast({
      title: 'Error',
      description: 'Failed to add observation',
      variant: 'destructive'
    });
  };

  return {
    addObservation,
    isSubmitting
  };
};
