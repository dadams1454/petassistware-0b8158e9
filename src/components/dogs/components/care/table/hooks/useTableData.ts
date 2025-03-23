
import { useState, useEffect, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { getPottyBreaksByDogAndTimeSlot2 } from '@/services/dailyCare/pottyBreak/queries/timeSlotQueries';
import { fetchDogCareLogs } from '@/services/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { getTimeSlotFromTimestamp } from '../utils/timeSlotUtils';
import { Observation } from './useObservations';

interface TableData {
  pottyBreaks: Record<string, string[]>;
  careLogs: Record<string, string[]>;
  observations: Record<string, Observation[]>;
  isLoading: boolean;
  fetchData: (forceRefresh?: boolean) => Promise<void>;
}

/**
 * Hook to fetch and manage all table data (potty breaks, care logs, observations)
 */
export const useTableData = (dogs: DogCareStatus[], currentDate: Date): TableData => {
  const [pottyBreaks, setPottyBreaks] = useState<Record<string, string[]>>({});
  const [careLogs, setCareLogs] = useState<Record<string, string[]>>({});
  const [observations, setObservations] = useState<Record<string, Observation[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(0);
  const { toast } = useToast();
  
  // Fetch all data
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!dogs.length) return;
    
    // Skip if we fetched recently (within 1 minute) unless forced
    const now = Date.now();
    if (!forceRefresh && now - lastFetch < 60000) {
      console.log('Using cached data, next refresh in', Math.round((60000 - (now - lastFetch)) / 1000), 'seconds');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 1. Fetch potty breaks
      const breaks = await getPottyBreaksByDogAndTimeSlot2(currentDate);
      setPottyBreaks(breaks);
      
      // 2. Fetch care logs and observations
      const dogObservations: Record<string, Observation[]> = {};
      const dogCareLogs: Record<string, string[]> = {};
      
      // Fetch care logs for each dog
      await Promise.all(dogs.map(async (dog) => {
        try {
          const logs = await fetchDogCareLogs(dog.dog_id);
          
          // Process feeding logs
          const feedingLogs = logs.filter(log => 
            log.category === 'feeding' && 
            new Date(log.timestamp).toDateString() === currentDate.toDateString()
          );
          
          if (feedingLogs.length > 0) {
            dogCareLogs[dog.dog_id] = feedingLogs.map(log => 
              getTimeSlotFromTimestamp(log.timestamp, 'feeding')
            );
          }
          
          // Process observation logs
          const observationLogs = logs.filter(log => 
            (log.category === 'observation' || log.category === 'feeding_observation')
          );
          
          if (observationLogs.length > 0) {
            dogObservations[dog.dog_id] = observationLogs.map(log => ({
              id: log.id,
              dog_id: log.dog_id,
              observation: log.notes || '',
              observation_type: log.task_name as 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
              created_at: log.created_at,
              timeSlot: getTimeSlotFromTimestamp(log.timestamp, log.category),
              category: log.category
            }));
          }
        } catch (error) {
          console.error(`Error fetching data for dog ${dog.dog_id}:`, error);
        }
      }));
      
      setCareLogs(dogCareLogs);
      setObservations(dogObservations);
      setLastFetch(now);
      
      console.log('✅ Table data refreshed successfully');
    } catch (error) {
      console.error('Error fetching table data:', error);
      toast({
        title: 'Error',
        description: 'Could not load all data. Please try refreshing.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [dogs, currentDate, lastFetch, toast]);
  
  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Return all data and utilities
  return {
    pottyBreaks,
    careLogs,
    observations,
    isLoading,
    fetchData
  };
};
