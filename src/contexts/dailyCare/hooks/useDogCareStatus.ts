
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DogCareStatus } from '@/types/dailyCare';
import { fetchAllDogsWithCareStatus } from '@/services/dailyCare/dogCareStatusService';

export const useDogCareStatus = () => {
  const [loading, setLoading] = useState(false);
  const [dogStatuses, setDogStatuses] = useState<DogCareStatus[]>([]);
  const { toast } = useToast();
  
  // Use refs to improve caching and prevent duplicate requests
  const cacheRef = useRef<{[key: string]: {data: DogCareStatus[], timestamp: number}}>({});
  const requestInProgressRef = useRef<{[key: string]: boolean}>({});
  
  // Cache expiration time in milliseconds (5 minutes)
  const CACHE_EXPIRATION = 5 * 60 * 1000;
  
  // Function to clear the cache
  const clearCache = useCallback(() => {
    cacheRef.current = {};
    console.log('Cache cleared');
  }, []);

  // Enhanced fetchDogStatuses with caching
  const fetchDogStatuses = useCallback(async (date = new Date(), forceRefresh = false): Promise<DogCareStatus[]> => {
    // Create a cache key based on the date
    const cacheKey = date.toISOString().split('T')[0];
    
    // Check if request is already in progress for this date
    if (requestInProgressRef.current[cacheKey]) {
      console.log('🔄 Fetch already in progress, skipping duplicate request');
      return dogStatuses;
    }
    
    // Check cache if we're not forcing a refresh
    if (!forceRefresh && cacheRef.current[cacheKey]) {
      const cachedData = cacheRef.current[cacheKey];
      const now = Date.now();
      
      // Use cached data if it's not expired
      if (now - cachedData.timestamp < CACHE_EXPIRATION) {
        console.log('🔄 Using cached dog statuses for', cacheKey);
        return cachedData.data;
      }
    }
    
    if (forceRefresh) {
      console.log('🔄 Force refreshing dog statuses');
    }
    
    // Set loading state and mark request as in progress
    setLoading(true);
    requestInProgressRef.current[cacheKey] = true;
    
    try {
      const fetchedDogStatuses = await fetchAllDogsWithCareStatus(date);
      
      // Update the cache
      cacheRef.current[cacheKey] = {
        data: fetchedDogStatuses,
        timestamp: Date.now()
      };
      
      // Update the state
      setDogStatuses(fetchedDogStatuses);
      console.log(`✅ Fetched ${fetchedDogStatuses.length} dogs successfully`);
      
      return fetchedDogStatuses;
    } catch (error) {
      console.error('Error fetching dog statuses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dog care statuses',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
      // Remove the in-progress flag with a small delay to prevent immediate duplicate requests
      setTimeout(() => {
        requestInProgressRef.current[cacheKey] = false;
      }, 300);
    }
  }, [dogStatuses, toast]);

  return {
    loading,
    dogStatuses,
    fetchAllDogsWithCareStatus: fetchDogStatuses,
    clearCache
  };
};
