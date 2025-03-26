
import { useState, useEffect, useCallback } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { DogCareStatus, DailyCarelog } from '@/types/dailyCare';
import { MedicationInfo, ProcessedMedicationLogs } from '../types/medicationTypes';
import { MedicationFrequency } from '@/utils/medicationUtils';
import { useToast } from '@/components/ui/use-toast';

export const useMedicationLogs = (dogs: DogCareStatus[]) => {
  const [recentLogs, setRecentLogs] = useState<{[dogId: string]: DailyCarelog[]}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { fetchRecentCareLogsByCategory } = useDailyCare();
  const { toast } = useToast();
  
  // Function to fetch medication logs for all dogs
  const fetchMedicationLogs = useCallback(async () => {
    if (dogs.length === 0) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    const medicationsByDog: {[dogId: string]: DailyCarelog[]} = {};
    
    try {
      const fetchPromises = dogs.map(async (dog) => {
        try {
          const medications = await fetchRecentCareLogsByCategory(dog.dog_id, 'medications', 10);
          return { dogId: dog.dog_id, medications };
        } catch (error) {
          console.error(`Error fetching medications for dog ${dog.dog_id}:`, error);
          return { dogId: dog.dog_id, medications: [] };
        }
      });
      
      const results = await Promise.all(fetchPromises);
      
      results.forEach(result => {
        medicationsByDog[result.dogId] = result.medications;
      });
      
      setRecentLogs(medicationsByDog);
      
      // Reset retry counter on success
      if (retryCount > 0) {
        setRetryCount(0);
      }
    } catch (error) {
      console.error('Error fetching medication logs:', error);
      
      // Increment retry counter on error
      setRetryCount(prev => prev + 1);
      
      setError('Failed to fetch medication data. Please try again later.');
      toast({
        title: "Error loading medications",
        description: "There was a problem loading the medication data. Some information may be unavailable.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [dogs, fetchRecentCareLogsByCategory, toast, retryCount]);
  
  // Get medication logs for each dog
  useEffect(() => {
    fetchMedicationLogs();
  }, [fetchMedicationLogs]);

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
    error,
    processedMedicationLogs,
    retryCount,
    retry: fetchMedicationLogs
  };
};
