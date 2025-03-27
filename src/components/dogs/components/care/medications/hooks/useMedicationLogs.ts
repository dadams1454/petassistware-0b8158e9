
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MedicationInfo } from '../types/medicationTypes';
import { DogCareStatus } from '@/types/dailyCare';

export const useMedicationLogs = (dogs: DogCareStatus[]) => {
  const [processedMedicationLogs, setProcessedMedicationLogs] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dogs || dogs.length === 0) {
      setProcessedMedicationLogs({});
      setIsLoading(false);
      return;
    }

    const fetchMedicationLogs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get dog IDs for query
        const dogIds = dogs.map(dog => dog.dog_id);
        
        // Fetch medication logs for these dogs
        const { data, error } = await supabase
          .from('medication_logs')
          .select('*')
          .in('dog_id', dogIds)
          .order('administered_at', { ascending: false });
        
        if (error) throw new Error(error.message);
        
        // Process the medication logs by dog
        const medicationsByDog: Record<string, any> = {};
        
        dogIds.forEach(dogId => {
          // Initialize each dog's medication record
          medicationsByDog[dogId] = {
            preventative: [],
            other: []
          };
          
          // Get logs for this specific dog
          const dogLogs = data.filter(log => log.dog_id === dogId);
          
          // Group medications by name (to get the most recent entry for each medication)
          const medicationsByName: Record<string, any> = {};
          
          // Create a map of medications by name
          dogLogs.forEach(log => {
            if (!medicationsByName[log.medication_name]) {
              medicationsByName[log.medication_name] = {
                id: log.id,
                name: log.medication_name,
                lastAdministered: log.administered_at,
                frequency: log.frequency,
                notes: log.notes,
                isPreventative: log.is_preventative || false
              };
            }
          });
          
          // Convert to array and sort by medication name
          const allMedications = Object.values(medicationsByName).sort((a: any, b: any) => 
            a.name.localeCompare(b.name)
          );
          
          // Separate into preventative and other medications
          medicationsByDog[dogId] = {
            preventative: allMedications.filter((med: MedicationInfo) => med.isPreventative),
            other: allMedications.filter((med: MedicationInfo) => !med.isPreventative)
          };
        });
        
        setProcessedMedicationLogs(medicationsByDog);
      } catch (err: any) {
        console.error('Error fetching medication logs:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicationLogs();
  }, [dogs]);

  return { processedMedicationLogs, isLoading, error };
};
