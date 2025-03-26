
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  fetchDogCareLogs, 
  addCareLog, 
  deleteCareLog 
} from '@/services/dailyCare/careLogsService';
import { DailyCarelog, CareLogFormData } from '@/types/dailyCare';

export const useCareLogs = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchDogCareLogs = useCallback(async (dogId: string): Promise<DailyCarelog[]> => {
    setLoading(true);
    try {
      const data = await fetchDogCareLogs(dogId);
      return data;
    } catch (error) {
      console.error('Error fetching care logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch care logs',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addCareLogHandler = useCallback(async (data: CareLogFormData): Promise<DailyCarelog | null> => {
    if (!userId) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to add care logs',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const newLog = await addCareLog(data, userId);
      
      if (newLog) {
        toast({
          title: 'Success',
          description: 'Care log added successfully',
        });
      }
      
      return newLog;
    } catch (error) {
      console.error('Error adding care log:', error);
      toast({
        title: 'Error',
        description: 'Failed to add care log',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const deleteCareLogHandler = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await deleteCareLog(id);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Care log deleted successfully',
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting care log:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete care log',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    fetchDogCareLogs,
    addCareLog: addCareLogHandler,
    deleteCareLog: deleteCareLogHandler
  };
};
