
import { useState, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useObservations = (dogs: DogCareStatus[]) => {
  const [observations, setObservations] = useState<Record<string, Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
  }>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Function to add a new observation for a dog
  const addObservation = useCallback(async (
    dogId: string, 
    observation: string, 
    observationType: 'accident' | 'heat' | 'behavior' | 'other'
  ): Promise<void> => {
    if (!dogId || !observation) {
      toast({
        title: 'Error',
        description: 'Missing required information for observation',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Insert the observation into the database
      // Using explicit typing to ensure compatibility with Supabase schema
      const { error } = await supabase
        .from('daily_care_logs') // Use the existing table for care logs
        .insert({
          dog_id: dogId,
          category: 'observation',
          task_name: observationType,
          notes: observation,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      // Update local state
      const newObservation = {
        observation,
        observation_type: observationType,
        created_at: new Date().toISOString()
      };

      setObservations(prev => {
        const dogObservations = prev[dogId] || [];
        return {
          ...prev,
          [dogId]: [newObservation, ...dogObservations]
        };
      });

      toast({
        title: 'Observation Added',
        description: `Successfully added ${observationType} observation`,
      });
    } catch (error) {
      console.error('Error adding observation:', error);
      toast({
        title: 'Error',
        description: 'Failed to add observation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Function to check if a dog has observations
  const hasObservation = useCallback((dogId: string): boolean => {
    return Boolean(observations[dogId]?.length);
  }, [observations]);

  return {
    observations,
    addObservation,
    hasObservation,
    isLoading
  };
};
