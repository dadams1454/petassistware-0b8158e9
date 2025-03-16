
import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as dailyCareService from '@/services/dailyCare';
import { DogCareStatus } from '@/types/dailyCare';
import { useCacheState } from './useCacheState';

export const useDogCareStatus = () => {
  const [loading, setLoading] = useState(false);
  const [dogStatuses, setDogStatuses] = useState<DogCareStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { getCachedStatus, setCachedStatus, clearCache } = useCacheState();
  
  // Use a ref to track if an initial fetch has occurred
  const initialFetchDone = useRef(false);
  const fetchPromiseRef = useRef<Promise<DogCareStatus[]> | null>(null);
  const fetchInProgressRef = useRef(false);

  const fetchAllDogsWithCareStatus = useCallback(async (date = new Date(), forceRefresh = false): Promise<DogCareStatus[]> => {
    // Convert date to string for caching
    const dateString = date.toISOString().split('T')[0];
    
    console.log(`🔍 Hook: fetchAllDogsWithCareStatus called with forceRefresh=${forceRefresh}`);
    
    // Prevent multiple simultaneous fetches unless forceRefresh is true
    if (fetchInProgressRef.current && !forceRefresh) {
      console.log('🔄 Fetch already in progress, skipping duplicate request');
      return fetchPromiseRef.current || Promise.resolve([]);
    }
    
    // If we're already fetching, return the existing promise to prevent duplicate requests
    if (fetchPromiseRef.current && !forceRefresh) {
      console.log('🔄 Already fetching dogs, returning existing promise');
      return fetchPromiseRef.current;
    }
    
    // Always fetch on force refresh
    if (forceRefresh) {
      console.log('🔄 Force refreshing dog statuses');
      setLoading(true);
      setError(null);
      fetchInProgressRef.current = true;
      
      const fetchPromise = dailyCareService.fetchAllDogsWithCareStatus(date)
        .then(statuses => {
          console.log(`✅ Fetched ${statuses.length} dogs successfully`);
          
          // Cache and update state
          setCachedStatus(dateString, statuses);
          setDogStatuses(statuses);
          initialFetchDone.current = true;
          return statuses;
        })
        .catch(error => {
          console.error('❌ Error during forced refresh:', error);
          setError('Failed to load dogs. Please try again.');
          toast({
            title: 'Error',
            description: 'Failed to load dogs. Please try again.',
            variant: 'destructive',
          });
          return [] as DogCareStatus[];
        })
        .finally(() => {
          setLoading(false);
          fetchPromiseRef.current = null;
          fetchInProgressRef.current = false;
        });
      
      fetchPromiseRef.current = fetchPromise;
      return fetchPromise;
    }
    
    // Use existing data if available and not forcing a refresh
    if (initialFetchDone.current && dogStatuses.length > 0) {
      console.log('📋 Using existing dog statuses in memory:', dogStatuses.length);
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
    setError(null);
    fetchInProgressRef.current = true;
    
    const fetchPromise = dailyCareService.fetchAllDogsWithCareStatus(date)
      .then(statuses => {
        console.log(`✅ Fetched ${statuses.length} dogs with names:`, statuses.map(d => d.dog_name).join(', '));
        
        // Cache and update state
        setCachedStatus(dateString, statuses);
        setDogStatuses(statuses);
        initialFetchDone.current = true;
        return statuses;
      })
      .catch(error => {
        console.error('❌ Error fetching dogs:', error);
        setError('Failed to load dogs. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load dogs. Please try again.',
          variant: 'destructive',
        });
        return [] as DogCareStatus[];
      })
      .finally(() => {
        setLoading(false);
        fetchPromiseRef.current = null;
        fetchInProgressRef.current = false;
      });
    
    fetchPromiseRef.current = fetchPromise;
    return fetchPromise;
  }, [toast, getCachedStatus, setCachedStatus, dogStatuses]);

  // Initial fetch only once on mount
  useEffect(() => {
    if (!initialFetchDone.current && !fetchInProgressRef.current) {
      console.log('🚀 Initial fetch on hook mount (once only)');
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
    error,
    fetchAllDogsWithCareStatus,
    clearCache
  };
};
