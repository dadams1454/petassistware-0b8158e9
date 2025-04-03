
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isAfter, parseISO } from 'date-fns';
import { DogCareStatus } from '@/types/dailyCare';
import { MedicationInfo, ProcessedMedicationLogs } from '../types/medicationTypes';
import { MedicationFrequency } from '@/utils/medicationUtils';

export const useMedicationLogs = (dogs: DogCareStatus[]) => {
  const [medicationLogs, setMedicationLogs] = useState<ProcessedMedicationLogs>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadedDogs, setLoadedDogs] = useState<DogCareStatus[]>([]);

  useEffect(() => {
    if (!dogs.length) return;
    
    const fetchMedicationLogs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const dogIds = dogs.map(dog => dog.dog_id);
        
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
        const groupedLogs: Record<string, any[]> = {};
        
        if (data && Array.isArray(data)) {
          data.forEach(log => {
            const dogId = log.dog_id;
            const medicationName = log.task_name;
            const key = `${dogId}-${medicationName}`;
            
            if (!groupedLogs[key]) {
              groupedLogs[key] = [];
            }
            
            groupedLogs[key].push(log);
          });
          
          // Process grouped logs into medication info
          Object.entries(groupedLogs).forEach(([key, logs]) => {
            if (!Array.isArray(logs) || logs.length === 0) return;
            
            const [dogId, medicationName] = key.split('-');
            
            // Sort logs by timestamp to get the most recent one
            logs.sort((a, b) => isAfter(parseISO(a.timestamp), parseISO(b.timestamp)) ? -1 : 1);
            
            // Latest log
            const latestLog = logs[0];
            
            // Extract medication metadata
            const metadata = latestLog.medication_metadata || {};
            
            // Determine if preventative
            const isPreventative = metadata.preventative === true;
            
            // Extract frequency information
            const frequency = metadata.frequency || 'daily';
            
            // Extract start_date and end_date if available
            const startDate = metadata.start_date || latestLog.timestamp;
            const endDate = metadata.end_date || null;
            
            // Create medication info object
            const medicationInfo: MedicationInfo = {
              id: medicationName,
              name: medicationName,
              lastAdministered: latestLog.timestamp,
              frequency: frequency as MedicationFrequency,
              notes: latestLog.notes,
              isPreventative,
              startDate,
              endDate
            };
            
            // Add to appropriate category
            if (isPreventative) {
              processedLogs[dogId].preventative.push(medicationInfo);
            } else {
              processedLogs[dogId].other.push(medicationInfo);
            }
          });
        }
        
        setMedicationLogs(processedLogs);
        setLoadedDogs(dogs);
      } catch (err) {
        console.error('Error fetching medication logs:', err);
        setError(err as Error);
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
    dogs: loadedDogs
  };
};
