
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
  observation_type: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other';
  created_by: string;
  expires_at: string;
  timeSlot?: string; // Add time slot to track when the observation occurred
  category?: string;  // Add category to differentiate feeding observations
}

type ObservationsMap = Record<string, ObservationType[]>;

export const useObservations = (dogs: DogCareStatus[]) => {
  const [observations, setObservations] = useState<ObservationsMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const { addCareLog, fetchDogCareLogs } = useDailyCare();
  const { toast } = useToast();

  // Function to convert a timestamp to the nearest time slot format
  const getTimeSlotFromTimestamp = (timestamp: string, category: string = 'observation'): string => {
    if (category === 'feeding_observation') {
      // For feeding, extract hour to determine meal time
      const date = new Date(timestamp);
      const hour = date.getHours();
      
      // Morning: 5-10, Noon: 10-3, Evening: 3-8
      if (hour >= 5 && hour < 10) return 'Morning';
      if (hour >= 10 && hour < 15) return 'Noon';
      return 'Evening';
    } else {
      // For potty breaks, use the original logic
      const date = new Date(timestamp);
      let hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12 in 12-hour format
      
      // Round to nearest hour for now
      const formattedHour = `${hours}:00 ${ampm}`;
      
      return formattedHour;
    }
  };

  // Load observations for all dogs
  const fetchObservations = useCallback(async () => {
    if (!dogs.length) return;
    
    setIsLoading(true);
    try {
      // Create a map to store observations for each dog
      const observationsMap: ObservationsMap = {};
      
      // For each dog, fetch care logs with "observation" or "feeding_observation" category
      for (const dog of dogs) {
        const logs = await fetchDogCareLogs(dog.dog_id);
        const dogObservations = logs
          .filter(log => (log.category === 'observation' || log.category === 'feeding_observation'))
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
            observation_type: log.task_name as 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
            created_by: log.created_by,
            expires_at: new Date(new Date(log.timestamp).getTime() + 24 * 60 * 60 * 1000).toISOString(),
            timeSlot: getTimeSlotFromTimestamp(log.timestamp, log.category),
            category: log.category
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
    observationType: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
    timeSlot: string = '',
    category: string = 'observation',
    timestamp = new Date()
  ) => {
    setIsLoading(true);
    try {
      // If observation text is empty, use the observation type as the text
      const defaultText = observationText.trim() || 
        observationType === 'feeding' 
          ? `Didn't eat ${timeSlot} meal`
          : `${observationType.charAt(0).toUpperCase() + observationType.slice(1)} observed`;
      
      const result = await addCareLog({
        dog_id: dogId,
        category: category,
        task_name: observationType,
        timestamp,
        notes: defaultText
      });
      
      if (result) {
        // Calculate the time slot based on category
        const calculatedTimeSlot = category === 'feeding_observation'
          ? timeSlot // Use the provided time slot for feeding
          : getTimeSlotFromTimestamp(timestamp.toString());
        
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
      setIsLoading(false);
    }
  }, [addCareLog, toast]);
  
  // Check if a dog has an observation based on category and time slot
  const hasObservation = useCallback((dogId: string, timeSlot: string = '', activeCategory: string = 'pottybreaks') => {
    // Determine which category to filter by
    const targetCategory = activeCategory === 'feeding' ? 'feeding_observation' : 'observation';
    
    // If dog doesn't have any observations, return false
    if (!observations[dogId]?.length) {
      return false;
    }
    
    // If no timeSlot is provided, check if the dog has any observations in the current category
    if (!timeSlot) {
      return observations[dogId].some(obs => obs.category === targetCategory);
    }
    
    // If time slot is provided, check if there's an observation matching this time slot and category
    return observations[dogId].some(obs => 
      obs.timeSlot === timeSlot && obs.category === targetCategory
    );
  }, [observations]);
  
  // Get observation details filtered by category
  const getObservationDetails = useCallback((dogId: string, activeCategory: string = 'pottybreaks') => {
    // Determine which category to filter by
    const targetCategory = activeCategory === 'feeding' ? 'feeding_observation' : 'observation';
    
    if (!observations[dogId] || observations[dogId].length === 0) {
      return null;
    }
    
    // Filter observations based on category
    const categoryObservations = observations[dogId].filter(obs => obs.category === targetCategory);
    
    if (categoryObservations.length === 0) {
      return null;
    }
    
    // Get the most recent observation for this dog in this category
    const latestObservation = categoryObservations[0];
    
    return {
      text: latestObservation.observation,
      type: latestObservation.observation_type,
      timeSlot: latestObservation.timeSlot,
      category: latestObservation.category
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
