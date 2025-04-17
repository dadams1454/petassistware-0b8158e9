
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CareLog } from '@/types/dailyCare';

export const useCareLogs = (dogId: string, category?: string) => {
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchCareLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In the mock-first development approach, return mock data
      const mockLogs: CareLog[] = [
        // Add some mock care logs for testing
        {
          id: '1',
          dog_id: dogId,
          category: 'feeding',
          task_name: 'Morning feed',
          timestamp: new Date().toISOString(),
          notes: 'Regular morning feeding'
        },
        {
          id: '2',
          dog_id: dogId,
          category: 'potty',
          task_name: 'Morning break',
          timestamp: new Date().toISOString(),
          notes: 'Normal potty break'
        }
      ];
      
      setCareLogs(mockLogs);
    } catch (e) {
      const err = e as Error;
      setError(err);
      toast({
        title: 'Error fetching care logs',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [dogId, category, toast]);

  const refresh = useCallback(() => {
    fetchCareLogs();
  }, [fetchCareLogs]);

  // Determine if a care has been logged for a specific time and category
  const hasCareLogged = useCallback((dogId: string, timeSlot: string, category: string) => {
    return careLogs.some(log => 
      log.dog_id === dogId && 
      log.category === category && 
      new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) === timeSlot
    );
  }, [careLogs]);

  // Initial fetch
  useState(() => {
    fetchCareLogs();
  }, [fetchCareLogs]);

  return {
    careLogs,
    loading,
    error,
    refresh,
    hasCareLogged
  };
};
