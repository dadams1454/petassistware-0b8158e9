import { useState, useCallback, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';

type ObservationType = {
  id: string;
  dog_id: string;
  created_at: string;
  observation: string;
  observation_type: 'accident' | 'heat' | 'behavior' | 'other';
  created_by: string;
  expires_at: string;
}

type ObservationsMap = Record<string, ObservationType[]>;

export const useObservations = (dogs: DogCareStatus[]) => {
  const [observations, setObservations] = useState<ObservationsMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const { addCareLog, fetchDogCareLogs } = useDailyCare();
  const { toast } = useToast();

  // Load observations for all dogs
  const fetchObservations = useCallback(async () => {
    if (!dogs.length) return;
    
    setIsLoading(true);
    try {
      // Create a map to store observations for each dog
      const observationsMap: ObservationsMap = {};
      
      // For each dog, fetch care logs with "observation" category
      for (const dog of dogs) {
        const logs = await fetchDogCareLogs(dog.dog_id);
        const dogObservations = logs
          .filter(log => log.category === 'observation')
          .filter(log => {
            // Filter observations that are not expired (less than 24 hours old)
            const timestamp = new Date(log.timestamp);
            const now = new Date();
            // Valid if created within the last 24 hours
            return now.getTime() - timestamp.getTime() < 24 * 60 * 60 * 1000;
          })
          .map(log => ({
            id: log.id,
            dog_id: log.dog_id,
            created_at: log.created_at,
            observation: log.notes || '',
            observation_type: log.task_name as 'accident' | 'heat' | 'behavior' | 'other',
            created_by: log.created_by,
            expires_at: new Date(new Date(log.timestamp).getTime() + 24 * 60 * 60 * 1000).toISOString()
          }));
          
        if (dogObservations.length > 0) {
          observationsMap[dog.dog_id] = dogObservations;
        }
      }
      
      setObservations(observationsMap);
    } catch (error) {
      console.error('Failed to fetch observations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dog observations',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [dogs, fetchDogCareLogs, toast]);
  
  // Add a new observation
  const addObservation = useCallback(async (
    dogId: string, 
    observationText: string, 
    observationType: 'accident' | 'heat' | 'behavior' | 'other'
  ) => {
    setIsLoading(true);
    try {
      const result = await addCareLog({
        dog_id: dogId,
        category: 'observation',
        task_name: observationType,
        timestamp: new Date(),
        notes: observationText
      });
      
      if (result) {
        // Update local state
        setObservations(prev => {
          const newObservations = { ...prev };
          const newObservation = {
            id: result.id,
            dog_id: result.dog_id,
            created_at: result.created_at,
            observation: result.notes || '',
            observation_type: observationType,
            created_by: result.created_by,
            expires_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
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
      setIsLoading(false);
    }
  }, [addCareLog, toast]);
  
  // Check if a dog has an observation
  const hasObservation = useCallback((dogId: string, timeSlot: string = '') => {
    // If no timeSlot is provided, just check if the dog has any observations
    if (!timeSlot) {
      return !!observations[dogId]?.length;
    }
    
    // Otherwise, return the default behavior checking by dog ID
    return !!observations[dogId]?.length;
  }, [observations]);
  
  // Load observations on component mount
  useEffect(() => {
    fetchObservations();
  }, [fetchObservations]);
  
  return {
    observations,
    addObservation,
    hasObservation,
    fetchObservations,
    isLoading
  };
};
