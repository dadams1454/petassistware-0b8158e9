
import { useState, useCallback, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

type ObservationType = {
  id: string;
  dog_id: string;
  created_at: string;
  observation: string;
  observation_type: 'accident' | 'heat' | 'behavior' | 'other';
  created_by: string;
  expires_at: string;
  timeSlot?: string; // Add time slot to track when the observation occurred
}

type ObservationsMap = Record<string, ObservationType[]>;

export const useObservations = (dogs: DogCareStatus[]) => {
  const [observations, setObservations] = useState<ObservationsMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const { addCareLog, fetchDogCareLogs } = useDailyCare();
  const { toast } = useToast();

  // Function to convert a timestamp to the nearest time slot format
  const getTimeSlotFromTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12 in 12-hour format
    
    // Round to nearest hour for now (we could add logic for half-hours if needed)
    const formattedHour = `${hours}:00 ${ampm}`;
    
    return formattedHour;
  };

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
            expires_at: new Date(new Date(log.timestamp).getTime() + 24 * 60 * 60 * 1000).toISOString(),
            timeSlot: getTimeSlotFromTimestamp(log.timestamp)
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
    observationType: 'accident' | 'heat' | 'behavior' | 'other',
    timestamp = new Date()
  ) => {
    setIsLoading(true);
    try {
      const result = await addCareLog({
        dog_id: dogId,
        category: 'observation',
        task_name: observationType,
        timestamp,
        notes: observationText
      });
      
      if (result) {
        // Get the time slot from the timestamp
        const timeSlot = getTimeSlotFromTimestamp(timestamp.toString());
        
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
            expires_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
            timeSlot
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
    
    // If time slot is provided, check if there's an observation matching this time slot
    return !!observations[dogId]?.some(obs => obs.timeSlot === timeSlot);
  }, [observations]);
  
  // Get observation details including the time slot
  const getObservationDetails = useCallback((dogId: string) => {
    if (!observations[dogId] || observations[dogId].length === 0) {
      return null;
    }
    
    // Get the most recent observation for this dog
    const latestObservation = observations[dogId][0];
    
    return {
      text: latestObservation.observation,
      type: latestObservation.observation_type,
      timeSlot: latestObservation.timeSlot
    };
  }, [observations]);
  
  // Load observations on component mount
  useEffect(() => {
    fetchObservations();
  }, [fetchObservations]);
  
  return {
    observations,
    addObservation,
    hasObservation,
    getObservationDetails,
    fetchObservations,
    isLoading
  };
};
