
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isAfter, parseISO } from 'date-fns';
import { DogCareStatus } from '@/components/dogs/components/care/medications/types/medicationTypes';
import { MedicationInfo, ProcessedMedicationLogs } from '../types/medicationTypes';
import { MedicationFrequency, processMedicationLogs } from '@/utils/medicationUtils';

export const useMedicationLogs = (dogs: DogCareStatus[] | string) => {
  const [medicationLogs, setMedicationLogs] = useState<ProcessedMedicationLogs>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadedDogs, setLoadedDogs] = useState<DogCareStatus[]>([]);

  useEffect(() => {
    // Skip if no dogs are provided
    if (!dogs || (Array.isArray(dogs) && dogs.length === 0)) {
      setIsLoading(false);
      return;
    }
    
    const fetchMedicationLogs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Handle both single dogId string and array of dog objects
        const dogIds = typeof dogs === 'string' 
          ? [dogs] 
          : dogs.map(dog => dog.dog_id);
        
        // Fetch all medication records for the provided dogs
        const { data, error } = await supabase
          .from('daily_care_logs')
          .select('*')
          .in('dog_id', dogIds)
          .eq('category', 'medications');
        
        if (error) throw error;
        
        // Process the medication logs
        const processedLogs: ProcessedMedicationLogs = {};
        
        dogIds.forEach(dogId => {
          processedLogs[dogId] = {
            preventative: [],
            other: []
          };
        });
        
        // Group logs by dog and medication name
        const dogLogs: Record<string, any[]> = {};
        
        if (data && Array.isArray(data)) {
          // Group by dog ID
          dogIds.forEach(dogId => {
            const logsForDog = data.filter(log => log.dog_id === dogId);
            dogLogs[dogId] = logsForDog;
            
            // Process the logs for this dog
            const { preventative, other } = processMedicationLogs(logsForDog);
            processedLogs[dogId] = { preventative, other };
          });
        }
        
        setMedicationLogs(processedLogs);
      } catch (err) {
        console.error('Error fetching medication logs:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedicationLogs();
  }, [dogs]);

  return {
    medicationLogs,
    isLoading,
    error,
    loadedDogs
  };
};
