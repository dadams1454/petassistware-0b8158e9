
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as dailyCareService from '@/services/dailyCare';
import { DailyCarelog, CareTaskPreset, CareLogFormData, DogCareStatus } from '@/types/dailyCare';

export const useDailyCareActions = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Add cache to prevent repeated fetches
  const careStatusCache = useRef<{
    [dateString: string]: {
      timestamp: number;
      data: DogCareStatus[];
    }
  }>({});

  // Cache expiration time (5 minutes)
  const CACHE_EXPIRATION = 5 * 60 * 1000;

  const fetchDogCareLogs = useCallback(async (dogId: string): Promise<DailyCarelog[]> => {
    setLoading(true);
    try {
      const data = await dailyCareService.fetchDogCareLogs(dogId);
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

  const fetchAllDogsWithCareStatus = useCallback(async (date = new Date()): Promise<DogCareStatus[]> => {
    setLoading(true);
    try {
      // Convert date to string for caching
      const dateString = date.toISOString().split('T')[0];
      const now = Date.now();
      
      // Check if we have cached data that's not expired
      if (
        careStatusCache.current[dateString] && 
        now - careStatusCache.current[dateString].timestamp < CACHE_EXPIRATION
      ) {
        setLoading(false);
        return careStatusCache.current[dateString].data;
      }
      
      // Fetch new data
      const statuses = await dailyCareService.fetchAllDogsWithCareStatus(date);
      
      // Cache the results
      careStatusCache.current[dateString] = {
        timestamp: now,
        data: statuses
      };
      
      return statuses;
    } catch (error) {
      console.error('Error fetching all dogs care status:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dogs care status',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addCareLog = useCallback(async (data: CareLogFormData): Promise<DailyCarelog | null> => {
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
      const newLog = await dailyCareService.addCareLog(data, userId);
      
      if (newLog) {
        // Clear cache after adding a new log to force refresh
        careStatusCache.current = {};
        
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

  const deleteCareLog = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await dailyCareService.deleteCareLog(id);
      
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

  const addCareTaskPreset = useCallback(async (category: string, taskName: string): Promise<CareTaskPreset | null> => {
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
      const newPreset = await dailyCareService.addCareTaskPreset(category, taskName, userId);
      
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
    fetchDogCareLogs,
    fetchCareTaskPresets,
    fetchAllDogsWithCareStatus,
    addCareLog,
    deleteCareLog,
    addCareTaskPreset,
    deleteCareTaskPreset,
  };
};
