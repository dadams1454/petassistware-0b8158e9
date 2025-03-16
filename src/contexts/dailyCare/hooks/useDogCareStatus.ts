
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
    
    console.log(`🔍 fetchAllDogsWithCareStatus called with date=${dateString}, forceRefresh=${forceRefresh}`);
    console.log(`🔍 Current state: ${dogStatuses.length} dogs, initialFetchDone=${initialFetchDone.current}`);
    
    // Always fetch on force refresh
    if (forceRefresh) {
      console.log('🔄 Force refreshing ALL dog statuses');
      setLoading(true);
      try {
        // Fetch new data
        console.log('📡 Fetching ALL dog statuses from server for', dateString);
        const statuses = await dailyCareService.fetchAllDogsWithCareStatus(date);
        console.log(`✅ Fetched ${statuses.length} dogs from server`);
        
        if (statuses.length > 0) {
          console.log('🐕 First few dogs:', statuses.slice(0, 5).map(d => d.dog_name).join(', '));
          // Cache the results
          setCachedStatus(dateString, statuses);
        } else {
          console.warn('⚠️ No dogs returned from API');
        }
        
        // Update state with new data
        setDogStatuses(statuses);
        initialFetchDone.current = true;
        
        return statuses;
      } catch (error) {
        console.error('❌ Error fetching all dogs care status:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dogs care status. Please try again.',
          variant: 'destructive',
        });
        return [];
      } finally {
        setLoading(false);
      }
    }
    
    // If we have already fetched and are not forcing a refresh, avoid another fetch
    if (initialFetchDone.current && dogStatuses.length > 0) {
      console.log('📋 Using existing dog statuses, no fetch needed');
      return dogStatuses;
    }
    
    // Check cache first if not forcing a refresh
    const cachedData = getCachedStatus(dateString);
    if (cachedData && cachedData.length > 0) {
      console.log('📋 Using cached dog statuses from', dateString, `(${cachedData.length} dogs)`);
      // If we have cached data, update the state without showing loading state
      setDogStatuses(cachedData);
      initialFetchDone.current = true;
      return cachedData;
    }
    
    // Only show loading state when we need to fetch from server
    setLoading(true);
    
    try {
      // Fetch new data
      console.log('📡 Fetching ALL dog statuses from server for', dateString);
      const statuses = await dailyCareService.fetchAllDogsWithCareStatus(date);
      console.log(`✅ Fetched ${statuses.length} dogs from server`);
      
      if (statuses.length > 0) {
        console.log('🐕 First few dogs:', statuses.slice(0, 5).map(d => d.dog_name).join(', '));
        // Cache the results
        setCachedStatus(dateString, statuses);
      } else {
        console.warn('⚠️ No dogs returned from API');
      }
      
      // Update state with new data
      setDogStatuses(statuses);
      initialFetchDone.current = true;
      
      return statuses;
    } catch (error) {
      console.error('❌ Error fetching all dogs care status:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dogs care status. Please try again.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast, getCachedStatus, setCachedStatus, dogStatuses]);

  // Add effect to log when the hook is initialized
  useEffect(() => {
    console.log('🚀 useDogCareStatus hook initialized');
    return () => {
      console.log('🚫 useDogCareStatus hook cleanup');
    };
  }, []);

  return {
    loading,
    dogStatuses,
    fetchAllDogsWithCareStatus,
    clearCache
  };
};
