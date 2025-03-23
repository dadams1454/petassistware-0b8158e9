
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { addCareLog } from '@/services/dailyCare/careLogsService';
import { useAuth } from '@/contexts/AuthProvider';
import { getTimeSlotFromTimestamp } from '../utils/timeSlotUtils';

// Types
export interface Observation {
  id: string;
  dog_id: string;
  observation: string;
  observation_type: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other';
  created_at: string;
  timeSlot?: string;
  category?: string;
}

/**
 * Hook for managing observations
 */
export const useObservations = (onRefresh?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Handle observation submission
  const handleObservationSubmit = useCallback(async (
    dogId: string,
    dogName: string,
    observation: string,
    observationType: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
    observationDate: Date,
    category: string = 'pottybreaks'
  ) => {
    if (!observation.trim()) {
      toast({
        title: "Error",
        description: "Please enter an observation",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!user?.id) {
        throw new Error("User ID not available");
      }
      
      // Determine the correct category based on context
      const careCategory = category === 'feeding' ? 'feeding_observation' : 'observation';
      
      await addCareLog({
        dog_id: dogId,
        category: careCategory,
        task_name: observationType,
        timestamp: observationDate,
        notes: observation
      }, user.id);
      
      toast({
        title: "Observation Saved",
        description: `Observation for ${dogName} was saved successfully`,
      });
      
      // Refresh data if needed
      if (onRefresh) onRefresh();
      
      // Return success
      return true;
    } catch (error) {
      console.error('Error saving observation:', error);
      toast({
        title: "Error",
        description: "Could not save observation. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast, user, onRefresh]);
  
  // Check if an observation exists for a given dog and time slot
  const hasObservation = useCallback((
    observations: Record<string, Observation[]>,
    dogId: string, 
    timeSlot: string = '', 
    category: string = 'pottybreaks'
  ): boolean => {
    const dogObservations = observations[dogId] || [];
    
    // If time slot is provided, filter by it
    if (timeSlot) {
      return dogObservations.some(obs => {
        const matchesCategory = category === 'feeding' 
          ? obs.category === 'feeding_observation'
          : obs.category === 'observation';
          
        return matchesCategory && obs.timeSlot === timeSlot;
      });
    }
    
    // Otherwise, just check if there are any observations for this dog in this category
    return dogObservations.some(obs => 
      category === 'feeding' 
        ? obs.category === 'feeding_observation'
        : obs.category === 'observation'
    );
  }, []);
  
  // Get observation details for a dog
  const getObservationDetails = useCallback((
    observations: Record<string, Observation[]>,
    dogId: string,
    category: string = 'pottybreaks'
  ): Observation | null => {
    const dogObservations = observations[dogId] || [];
    
    // Filter by category and sort by creation time (newest first)
    const filteredObservations = dogObservations
      .filter(obs => category === 'feeding' 
        ? obs.category === 'feeding_observation'
        : obs.category === 'observation')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Return the most recent observation or null
    return filteredObservations.length > 0 ? filteredObservations[0] : null;
  }, []);
  
  return {
    handleObservationSubmit,
    hasObservation,
    getObservationDetails,
    isSubmitting
  };
};
