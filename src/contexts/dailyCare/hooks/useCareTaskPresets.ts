
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as dailyCareService from '@/services/dailyCare';
import { CareTaskPreset } from '@/types/dailyCare';

export const useCareTaskPresets = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCareTaskPresets = useCallback(async (): Promise<CareTaskPreset[]> => {
    setLoading(true);
    try {
      const data = await dailyCareService.fetchCareTaskPresets();
      return data;
    } catch (error) {
      console.error('Error fetching care task presets:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch care task presets',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addCareTaskPreset = useCallback(async (
    category: string, 
    taskName: string, 
    isDefault: boolean = false
  ): Promise<CareTaskPreset | null> => {
    if (!userId) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to add task presets',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const newPreset = await dailyCareService.addCareTaskPreset(category, taskName, userId, isDefault);
      
      if (newPreset) {
        toast({
          title: 'Success',
          description: 'Task preset added successfully',
        });
      }
      
      return newPreset;
    } catch (error) {
      console.error('Error adding task preset:', error);
      toast({
        title: 'Error',
        description: 'Failed to add task preset',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const deleteCareTaskPreset = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await dailyCareService.deleteCareTaskPreset(id);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Task preset deleted successfully',
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting task preset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task preset',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    fetchCareTaskPresets,
    addCareTaskPreset,
    deleteCareTaskPreset
  };
};
