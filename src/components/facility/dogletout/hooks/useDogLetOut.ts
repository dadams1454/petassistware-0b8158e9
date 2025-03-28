
import { useState, useCallback, useEffect, useRef } from 'react';
import { getDogLetOutsByDogAndTimeSlot2 } from '@/services/dailyCare/dogLetOut/queries/timeSlotQueries';
import { toast } from '@/components/ui/use-toast';

export const useDogLetOut = (currentDate: Date) => {
  const [dogLetOuts, setDogLetOuts] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  
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
  }, [currentDate]);
  
  // Initial fetch
  useEffect(() => {
    fetchDogLetOuts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  // Check if a dog has been let out at a specific time slot
  const hasDogLetOut = useCallback((dogId: string, timeSlot: string) => {
    return dogLetOuts[dogId]?.includes(timeSlot) || false;
  }, [dogLetOuts]);
  
  return {
    dogLetOuts,
    setDogLetOuts,
    isLoading,
    fetchDogLetOuts,
    hasDogLetOut
  };
};
