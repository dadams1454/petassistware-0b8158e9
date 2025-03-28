
import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthProvider';
import { getDogLetOutsByDogAndTimeSlot2 } from '@/services/dailyCare/dogLetOut/queries/timeSlotQueries';
import { logDogLetOut, removeDogLetOut, logGroupDogLetOut } from '@/services/dailyCare/dogLetOut/operations/dogLetOutOperations';

export const useDogLetOut = (currentDate: Date) => {
  const [dogLetOuts, setDogLetOuts] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Add caching mechanism
  const cacheExpiryRef = useRef<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  const isFetchingRef = useRef(false);
  
  // Fetch dog let out data with caching
  const fetchDogLetOuts = useCallback(async (forceRefresh = false) => {
    // Skip if already fetching
    if (isFetchingRef.current) {
      console.log('🔍 Already fetching dog let outs, skipping');
      return;
    }
    
    // Check cache unless force refresh is requested
    const now = Date.now();
    if (!forceRefresh && now < cacheExpiryRef.current) {
      console.log('📋 Using cached dog let outs, next refresh in', 
        Math.ceil((cacheExpiryRef.current - now) / 1000), 'seconds');
      return;
    }
    
    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      console.log('🔍 Fetching dog let outs for date:', currentDate.toISOString().slice(0, 10));
      
      const letOuts = await getDogLetOutsByDogAndTimeSlot2(currentDate);
      console.log('✅ Retrieved dog let outs for', Object.keys(letOuts).length, 'dogs');
      
      setDogLetOuts(letOuts);
      
      // Update cache expiry
      cacheExpiryRef.current = Date.now() + CACHE_DURATION;
    } catch (error) {
      console.error('❌ Error fetching dog let outs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dog let out data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentDate, toast]);
  
  // Initial fetch
  useEffect(() => {
    fetchDogLetOuts();
  }, [fetchDogLetOuts]);

  // Check if a dog has been let out at a specific time slot
  const hasDogLetOut = useCallback((dogId: string, timeSlot: string) => {
    return dogLetOuts[dogId]?.includes(timeSlot) || false;
  }, [dogLetOuts]);
  
  // Handle a let out action when a cell is clicked
  const handleDogLetOut = useCallback(async (dogId: string, dogName: string, timeSlot: string) => {
    try {
      // Check if dog is already let out at this time
      const isLetOut = hasDogLetOut(dogId, timeSlot);
      
      if (isLetOut) {
        // Need to remove the let out
        // This is a simplified implementation - would need sessionId in real implementation
        // For now, we'll just update the UI optimistically
        setDogLetOuts(prev => {
          const updatedLetOuts = { ...prev };
          if (updatedLetOuts[dogId]) {
            updatedLetOuts[dogId] = updatedLetOuts[dogId].filter(slot => slot !== timeSlot);
            if (updatedLetOuts[dogId].length === 0) {
              delete updatedLetOuts[dogId];
            }
          }
          return updatedLetOuts;
        });
        
        toast({
          title: 'Let Out Removed',
          description: `Removed let out entry for ${dogName} at ${timeSlot}`
        });
      } else {
        // Add a new let out
        // Optimistically update UI
        setDogLetOuts(prev => {
          const updatedLetOuts = { ...prev };
          if (!updatedLetOuts[dogId]) {
            updatedLetOuts[dogId] = [];
          }
          if (!updatedLetOuts[dogId].includes(timeSlot)) {
            updatedLetOuts[dogId] = [...updatedLetOuts[dogId], timeSlot];
          }
          return updatedLetOuts;
        });
        
        // Perform the actual API operation
        await logDogLetOut(dogId, timeSlot, user?.id);
        
        toast({
          title: 'Dog Let Out',
          description: `${dogName} was let out at ${timeSlot}`
        });
      }
    } catch (error) {
      console.error('Error handling dog let out:', error);
      
      // Revert optimistic update on error
      fetchDogLetOuts(true);
      
      toast({
        title: 'Error',
        description: 'Failed to update dog let out',
        variant: 'destructive'
      });
    }
  }, [hasDogLetOut, toast, user?.id, fetchDogLetOuts]);
  
  // Handle a group let out action
  const handleGroupLetOut = useCallback(async (dogIds: string[], timeSlot: string, groupName?: string) => {
    if (dogIds.length === 0) return;
    
    try {
      // Optimistically update UI
      setDogLetOuts(prev => {
        const updatedLetOuts = { ...prev };
        
        dogIds.forEach(dogId => {
          if (!updatedLetOuts[dogId]) {
            updatedLetOuts[dogId] = [];
          }
          if (!updatedLetOuts[dogId].includes(timeSlot)) {
            updatedLetOuts[dogId] = [...updatedLetOuts[dogId], timeSlot];
          }
        });
        
        return updatedLetOuts;
      });
      
      // Perform the actual API operation
      await logGroupDogLetOut(dogIds, timeSlot, user?.id, groupName);
      
      toast({
        title: 'Group Let Out',
        description: `${dogIds.length} dogs were let out at ${timeSlot}`
      });
    } catch (error) {
      console.error('Error handling group dog let out:', error);
      
      // Revert optimistic update on error
      fetchDogLetOuts(true);
      
      toast({
        title: 'Error',
        description: 'Failed to update group dog let out',
        variant: 'destructive'
      });
    }
  }, [toast, user?.id, fetchDogLetOuts]);
  
  return {
    dogLetOuts,
    isLoading,
    fetchDogLetOuts,
    hasDogLetOut,
    handleDogLetOut,
    handleGroupLetOut
  };
};
