
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MedicationInfo, ProcessedMedicationLogs } from '../types/medicationTypes';
import { DogCareStatus } from '@/types/dailyCare';
import { MedicationFrequency } from '@/utils/medicationUtils';

export const useMedicationLogs = (dogs: DogCareStatus[]) => {
  const [processedMedicationLogs, setProcessedMedicationLogs] = useState<ProcessedMedicationLogs>({});
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
        
        // Fetch medication logs for these dogs from daily_care_logs where category is 'medications'
        const { data, error } = await supabase
          .from('daily_care_logs')
          .select('*')
          .in('dog_id', dogIds)
          .eq('category', 'medications')
          .order('timestamp', { ascending: false });
        
        if (error) throw new Error(error.message);
        
        // Process the medication logs by dog
        const medicationsByDog: ProcessedMedicationLogs = {};
        
        // Initialize each dog's medication record, even if they have no medications
        dogIds.forEach(dogId => {
          medicationsByDog[dogId] = {
            preventative: [],
            other: []
          };
        });
        
        // If we have medication data, process it
        if (data && data.length > 0) {
          // Group medications by dog
          dogIds.forEach(dogId => {
            // Get logs for this specific dog
            const dogLogs = data.filter(log => log.dog_id === dogId) || [];
            
            // Group medications by name (to get the most recent entry for each medication)
            const medicationsByName: Record<string, MedicationInfo> = {};
            
            // Create a map of medications by name
            dogLogs.forEach(log => {
              // Extract medication type (preventative or not) from the task name or notes
              const isPreventative = 
                (log.notes && log.notes.toLowerCase().includes('preventative')) || 
                (log.task_name.toLowerCase().includes('heartworm')) ||
                (log.task_name.toLowerCase().includes('flea')) ||
                (log.task_name.toLowerCase().includes('tick')) ||
                (log.task_name.toLowerCase().includes('prevention'));
              
              // Parse frequency from task_name if available
              let frequency = MedicationFrequency.Monthly; // Default
              if (log.task_name.includes('(Daily)')) frequency = MedicationFrequency.Daily;
              if (log.task_name.includes('(Weekly)')) frequency = MedicationFrequency.Weekly;
              if (log.task_name.includes('(Monthly)')) frequency = MedicationFrequency.Monthly;
              if (log.task_name.includes('(Quarterly)')) frequency = MedicationFrequency.Quarterly;
              if (log.task_name.includes('(Annual)')) frequency = MedicationFrequency.Annual;
              
              // Clean medication name (remove frequency information)
              let cleanName = log.task_name;
              if (cleanName.includes('(')) {
                cleanName = cleanName.substring(0, cleanName.indexOf('(')).trim();
              }
              
              // Extract start_date and end_date from metadata if available
              let startDate = log.timestamp;
              let endDate = null;
              
              if (log.medication_metadata && typeof log.medication_metadata === 'object') {
                if (log.medication_metadata.start_date) {
                  startDate = log.medication_metadata.start_date;
                }
                if (log.medication_metadata.end_date) {
                  endDate = log.medication_metadata.end_date;
                }
              }
              
              if (!medicationsByName[cleanName] || new Date(log.timestamp) > new Date(medicationsByName[cleanName].lastAdministered)) {
                medicationsByName[cleanName] = {
                  id: log.id,
                  name: cleanName,
                  lastAdministered: log.timestamp,
                  frequency: frequency,
                  notes: log.notes,
                  isPreventative: isPreventative,
                  startDate: startDate,
                  endDate: endDate
                };
              }
            });
            
            // Convert to array and sort by medication name
            const allMedications = Object.values(medicationsByName).sort((a: MedicationInfo, b: MedicationInfo) => 
              a.name.localeCompare(b.name)
            );
            
            // Separate into preventative and other medications
            medicationsByDog[dogId] = {
              preventative: allMedications.filter((med: MedicationInfo) => med.isPreventative),
              other: allMedications.filter((med: MedicationInfo) => !med.isPreventative)
            };
          });
        }
        
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
