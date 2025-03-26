
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  fetchCareTaskPresets,
  addCareTaskPreset,
  deleteCareTaskPreset
} from '@/services/dailyCare/careTaskPresetsService';
import { CareTaskPreset } from '@/types/dailyCare';

export const useCareTaskPresets = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPresets = useCallback(async (): Promise<CareTaskPreset[]> => {
    setLoading(true);
    try {
      const data = await fetchCareTaskPresets(userId);
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
  }, [userId, toast]);

  const addPreset = useCallback(async (data: Omit<CareTaskPreset, 'id' | 'created_at'>): Promise<CareTaskPreset | null> => {
    if (!userId) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to add care task presets',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const newPreset = await addCareTaskPreset(data, userId);
      
      if (newPreset) {
        toast({
          title: 'Success',
          description: 'Care task preset added successfully',
        });
      }
      
      return newPreset;
    } catch (error) {
      console.error('Error adding care task preset:', error);
      toast({
        title: 'Error',
        description: 'Failed to add care task preset',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const deletePreset = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await deleteCareTaskPreset(id);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Care task preset deleted successfully',
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting care task preset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete care task preset',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    fetchCareTaskPresets: fetchPresets,
    addCareTaskPreset: addPreset,
    deleteCareTaskPreset: deletePreset
  };
};
