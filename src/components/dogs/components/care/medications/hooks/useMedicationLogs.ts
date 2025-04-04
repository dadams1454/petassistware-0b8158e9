
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { processMedicationLogs, MedicationFrequencyConstants } from '@/utils/medicationUtils';

export const useMedicationLogs = (dogIdOrDogs: any) => {
  const [medicationLogs, setMedicationLogs] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMedicationLogs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // If dogIdOrDogs is a string (single dogId)
        if (typeof dogIdOrDogs === 'string') {
          const { data, error } = await supabase
            .from('daily_care_logs')
            .select('*')
            .eq('dog_id', dogIdOrDogs)
            .eq('category', 'medications')
            .order('timestamp', { ascending: false });
            
          if (error) throw error;
          
          setMedicationLogs({
            [dogIdOrDogs]: processMedicationLogs(data)
          });
        } 
        // If dogIdOrDogs is an array
        else if (Array.isArray(dogIdOrDogs)) {
          const processedLogs: Record<string, any> = {};
          
          // Process each dog in the array
          for (const dog of dogIdOrDogs) {
            const dogId = dog.dog_id || dog.id;
            if (!dogId) continue;
            
            const { data, error } = await supabase
              .from('daily_care_logs')
              .select('*')
              .eq('dog_id', dogId)
              .eq('category', 'medications')
              .order('timestamp', { ascending: false });
              
            if (error) throw error;
            
            processedLogs[dogId] = processMedicationLogs(data);
          }
          
          setMedicationLogs(processedLogs);
        }
      } catch (err) {
        console.error('Error fetching medication logs:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (dogIdOrDogs) {
      fetchMedicationLogs();
    }
  }, [dogIdOrDogs]);
  
  return { medicationLogs, isLoading, error };
};
