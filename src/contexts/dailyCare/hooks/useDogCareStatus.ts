
import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as dailyCareService from '@/services/dailyCare';
import { DogCareStatus } from '@/types/dailyCare';
import { useCacheState } from './useCacheState';

export const useDogCareStatus = () => {
  const [loading, setLoading] = useState(false);
  const [dogStatuses, setDogStatuses] = useState<DogCareStatus[]>([]);
  const { toast } = useToast();
  const { getCachedStatus, setCachedStatus, clearCache } = useCacheState();
  
  // Use a ref to track if an initial fetch has occurred
  const initialFetchDone = useRef(false);

  const fetchAllDogsWithCareStatus = useCallback(async (date = new Date(), forceRefresh = false): Promise<DogCareStatus[]> => {
    // Convert date to string for caching
    const dateString = date.toISOString().split('T')[0];
    
    console.log(`🔍 Hook: fetchAllDogsWithCareStatus called with forceRefresh=${forceRefresh}`);
    
    // Always fetch on force refresh
    if (forceRefresh) {
      console.log('🔄 Force refreshing ALL dog statuses');
      setLoading(true);
      try {
        console.log('📡 Fetching fresh dog data from server');
        const statuses = await dailyCareService.fetchAllDogsWithCareStatus(date);
        console.log(`✅ Fetched ${statuses.length} dogs successfully`);
        
        // Cache and update state
        setCachedStatus(dateString, statuses);
        setDogStatuses(statuses);
        initialFetchDone.current = true;
        return statuses;
      } catch (error) {
        console.error('❌ Error during forced refresh:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dogs. Please try again.',
          variant: 'destructive',
        });
        return [];
      } finally {
        setLoading(false);
      }
    }
    
    // Use existing data if available and not forcing a refresh
    if (initialFetchDone.current && dogStatuses.length > 0) {
      console.log('📋 Using existing dog statuses in memory');
      return dogStatuses;
    }
    
    // Check cache
    const cachedData = getCachedStatus(dateString);
    if (cachedData && cachedData.length > 0) {
      console.log('📋 Using cached dog data', cachedData.length);
      setDogStatuses(cachedData);
      initialFetchDone.current = true;
      return cachedData;
    }
    
    // If we get here, we need to fetch from server
    setLoading(true);
    
    try {
      console.log('📡 No cached data - fetching from server');
      const statuses = await dailyCareService.fetchAllDogsWithCareStatus(date);
      console.log(`✅ Fetched ${statuses.length} dogs`);
      
      // Cache and update state
      setCachedStatus(dateString, statuses);
      setDogStatuses(statuses);
      initialFetchDone.current = true;
      return statuses;
    } catch (error) {
      console.error('❌ Error fetching dogs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dogs. Please try again.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast, getCachedStatus, setCachedStatus, dogStatuses]);

  // Add immediate fetch on initialization
  useEffect(() => {
    if (!initialFetchDone.current) {
      console.log('🚀 Initial fetch on hook mount');
      fetchAllDogsWithCareStatus(new Date(), true)
        .then(dogs => {
          console.log(`✅ Initial fetch complete: ${dogs.length} dogs loaded`);
        })
        .catch(error => {
          console.error('❌ Error during initial fetch:', error);
        });
    }
  }, [fetchAllDogsWithCareStatus]);

  return {
    loading,
    dogStatuses,
    fetchAllDogsWithCareStatus,
    clearCache
  };
};
