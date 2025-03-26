
import { useState, useEffect } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { DogCareStatus, DailyCarelog } from '@/types/dailyCare';
import { MedicationInfo, ProcessedMedicationLogs } from '../types/medicationTypes';
import { MedicationFrequency } from '@/utils/medicationUtils';

export const useMedicationLogs = (dogs: DogCareStatus[]) => {
  const [recentLogs, setRecentLogs] = useState<{[dogId: string]: DailyCarelog[]}>({});
  const [isLoading, setIsLoading] = useState(false);
  const { fetchRecentCareLogsByCategory } = useDailyCare();
  
  // Get medication logs for each dog
  useEffect(() => {
    const fetchDogMedications = async () => {
      if (dogs.length === 0) return;
      
      setIsLoading(true);
      const medicationsByDog: {[dogId: string]: DailyCarelog[]} = {};
      
      for (const dog of dogs) {
        try {
          const medications = await fetchRecentCareLogsByCategory(dog.dog_id, 'medications', 10);
          medicationsByDog[dog.dog_id] = medications;
        } catch (error) {
          console.error(`Error fetching medications for dog ${dog.dog_id}:`, error);
        }
      }
      
      setRecentLogs(medicationsByDog);
      setIsLoading(false);
    };
    
    fetchDogMedications();
  }, [dogs, fetchRecentCareLogsByCategory]);

  // Process medication logs into structured data
  const processedMedicationLogs: ProcessedMedicationLogs = {};
  
  for (const dog of dogs) {
    const logs = recentLogs[dog.dog_id] || [];
    const preventativeMeds: MedicationInfo[] = [];
    const otherMeds: MedicationInfo[] = [];
    const medications: {[name: string]: MedicationInfo} = {};
    
    logs.forEach(log => {
      // Parse medication name and frequency from task_name
      // Format is expected to be: "Medication Name (Frequency)"
      const matchResult = log.task_name.match(/(.+) \(([A-Za-z]+)\)$/);
      
      if (matchResult && matchResult.length === 3) {
        const [_, name, frequencyLabel] = matchResult;
        const frequency = frequencyLabel.toLowerCase() as MedicationFrequency;
        
        // Only update if this is a newer record than what we already have
        if (!medications[name] || 
            (medications[name] && medications[name].lastAdministered && 
             log.timestamp > medications[name].lastAdministered!)) {
          medications[name] = {
            name,
            lastAdministered: log.timestamp,
            frequency: frequency as MedicationFrequency
          };
        }
      } else {
        // Handle legacy format (no frequency in name)
        const name = log.task_name;
        if (!medications[name] || 
            (medications[name] && medications[name].lastAdministered && 
             log.timestamp > medications[name].lastAdministered!)) {
          medications[name] = {
            name,
            lastAdministered: log.timestamp,
            frequency: MedicationFrequency.MONTHLY // Default to monthly for legacy records
          };
        }
      }
    });
    
    // Sort medications into preventative and other categories
    Object.values(medications).forEach(med => {
      const isPreventative = 
        med.name.toLowerCase().includes('heartworm') || 
        med.name.toLowerCase().includes('flea') || 
        med.name.toLowerCase().includes('tick');
        
      if (isPreventative) {
        preventativeMeds.push(med);
      } else {
        otherMeds.push(med);
      }
    });
    
    processedMedicationLogs[dog.dog_id] = {
      preventative: preventativeMeds,
      other: otherMeds
    };
  }
  
  return {
    recentLogs,
    isLoading,
    processedMedicationLogs
  };
};
