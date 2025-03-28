
import { useState, useEffect, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';

export const useCareLogsData = (dogs: DogCareStatus[]) => {
  const [careLogsByDog, setCareLogsByDog] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { fetchDogCareLogs } = useDailyCare();
  const { toast } = useToast();
  
  // Fetch care logs for all dogs
  const fetchAllCareLogs = useCallback(async () => {
    if (dogs.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const logsByDog: Record<string, string[]> = {};
      
      // Fetch logs for each dog
      await Promise.all(dogs.map(async (dog) => {
        try {
          const logs = await fetchDogCareLogs(dog.dog_id);
          
          // Process logs by category and store task names
          logs.forEach(log => {
            if (!logsByDog[dog.dog_id]) {
              logsByDog[dog.dog_id] = [];
            }
            
            const taskIdentifier = `${log.category}:${log.task_name}`;
            if (!logsByDog[dog.dog_id].includes(taskIdentifier)) {
              logsByDog[dog.dog_id].push(taskIdentifier);
            }
          });
        } catch (error) {
          console.error(`Error fetching care logs for dog ${dog.dog_name}:`, error);
        }
      }));
      
      setCareLogsByDog(logsByDog);
    } catch (error) {
      console.error('Error fetching care logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dog care logs',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [dogs, fetchDogCareLogs, toast]);
  
  // Initial fetch
  useEffect(() => {
    fetchAllCareLogs();
  }, [fetchAllCareLogs]);
  
  // Check if a dog has a care log for a specific task
  const hasCareLogged = useCallback((dogId: string, categoryAndTask: string) => {
    return careLogsByDog[dogId]?.includes(categoryAndTask) || false;
  }, [careLogsByDog]);
  
  return {
    careLogsByDog,
    isLoading,
    fetchAllCareLogs,
    hasCareLogged
  };
};
