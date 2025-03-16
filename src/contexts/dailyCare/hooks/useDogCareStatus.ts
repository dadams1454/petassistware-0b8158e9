
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as dailyCareService from '@/services/dailyCare';
import { DogCareStatus } from '@/types/dailyCare';
import { useCacheState } from './useCacheState';

export const useDogCareStatus = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { getCachedStatus, setCachedStatus, clearCache } = useCacheState();

  const fetchAllDogsWithCareStatus = useCallback(async (date = new Date()): Promise<DogCareStatus[]> => {
    setLoading(true);
    try {
      // Convert date to string for caching
      const dateString = date.toISOString().split('T')[0];
      
      // Check cache first
      const cachedData = getCachedStatus(dateString);
      if (cachedData) {
        setLoading(false);
        return cachedData;
      }
      
      // Fetch new data
      const statuses = await dailyCareService.fetchAllDogsWithCareStatus(date);
      
      // Cache the results
      setCachedStatus(dateString, statuses);
      
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
  }, [toast, getCachedStatus, setCachedStatus]);

  return {
    loading,
    fetchAllDogsWithCareStatus,
    clearCache
  };
};
