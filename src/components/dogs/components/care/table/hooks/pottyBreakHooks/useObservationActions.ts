
import { useState, useCallback, useRef } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { ObservationMap } from './observationTypes';
import { getTimeSlotFromTimestamp } from './observationsUtils';

export const useObservationActions = (
  observations: ObservationMap,
  setObservations: React.Dispatch<React.SetStateAction<ObservationMap>>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionLock = useRef(false); // Use ref to prevent race conditions
  const { addCareLog } = useDailyCare();
  const { toast } = useToast();

  // Add a new observation
  const addObservation = useCallback(async (
    dogId: string, 
    observationText: string, 
    observationType: 'accident' | 'heat' | 'behavior' | 'other',
    timeSlot: string = '',
    category: string = 'observation',
    timestamp = new Date()
  ): Promise<void> => {
    // Prevent duplicate submissions with both state and ref
    if (isSubmitting || submissionLock.current) {
      console.log('Submission already in progress, skipping');
      return;
    }
    
    setIsSubmitting(true);
    submissionLock.current = true;
    
    try {
      // If observation text is empty, use the observation type as the text
      const defaultText = observationText.trim() || 
        `${observationType.charAt(0).toUpperCase() + observationType.slice(1)} observed`;
      
      // Format timestamp to string if it's a Date
      const timestampString = timestamp instanceof Date ? timestamp.toISOString() : timestamp;
      
      console.log('Submitting observation:', {
        dog_id: dogId,
        category,
        task: observationType, // Use task property as required by CareLogFormData
        timestamp: timestampString,
        notes: defaultText
      });
      
      const result = await addCareLog({
        dog_id: dogId,
        category: category,
        task: observationType, // Use task property as required by CareLogFormData
        timestamp: timestampString,
        notes: defaultText
      });
      
      if (result) {
        // Calculate the time slot
        const calculatedTimeSlot = getTimeSlotFromTimestamp(timestampString.toString());
        
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
          title: 'Observation Added',
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
      // Small delay before releasing lock to prevent rapid clicks
      setTimeout(() => {
        submissionLock.current = false;
      }, 300);
    }
  }, [addCareLog, toast, setObservations, isSubmitting]);

  return {
    addObservation,
    isSubmitting
  };
};
