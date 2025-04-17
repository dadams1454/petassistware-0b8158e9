
import { useState } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { CareLog, DogCareStatus, CareLogFormData, DogCareObservation } from '@/types/dailyCare';
import { useToast } from '@/components/ui/use-toast';

export interface UseObservationActionsResult {
  addingObservation: boolean;
  markObservation: (dog: DogCareStatus, timeSlot: string, category: string) => Promise<void>;
  removeObservation: (observationId: string) => Promise<void>;
}

export const useObservationActions = (): UseObservationActionsResult => {
  const { addCareLog, deleteCareLog } = useDailyCare();
  const [addingObservation, setAddingObservation] = useState(false);
  const { toast } = useToast();

  // Function to mark an observation
  const markObservation = async (
    dog: DogCareStatus,
    timeSlot: string,
    category: string
  ): Promise<void> => {
    try {
      setAddingObservation(true);
      
      // Format timestamp based on timeSlot
      const now = new Date();
      const [hour, minute] = timeSlot.split(':').map(Number);
      
      now.setHours(hour);
      now.setMinutes(minute);
      now.setSeconds(0);
      now.setMilliseconds(0);
      
      const timestamp = now.toISOString();
      
      // Create an observation log
      const observationData: CareLogFormData = {
        dog_id: dog.dog_id,
        category,
        task_name: `${category} at ${timeSlot}`,
        task: `${category} at ${timeSlot}`, // Adding task as well
        timestamp,
        notes: `Automatic ${category} observation at ${timeSlot}`
      };
      
      await addCareLog(observationData);
      
      toast({
        title: "Observation recorded",
        description: `${category} observation at ${timeSlot} for ${dog.name || dog.dog_name} was recorded.`
      });
      
    } catch (error) {
      console.error("Error marking observation:", error);
      toast({
        title: "Failed to record observation",
        description: `Could not record ${category} observation. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setAddingObservation(false);
    }
  };
  
  // Function to remove an observation
  const removeObservation = async (observationId: string): Promise<void> => {
    try {
      await deleteCareLog(observationId);
      
      toast({
        title: "Observation removed",
        description: "The observation has been removed successfully."
      });
    } catch (error) {
      console.error("Error removing observation:", error);
      toast({
        title: "Failed to remove observation",
        description: "Could not remove the observation. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return {
    addingObservation,
    markObservation,
    removeObservation
  };
};

export default useObservationActions;
