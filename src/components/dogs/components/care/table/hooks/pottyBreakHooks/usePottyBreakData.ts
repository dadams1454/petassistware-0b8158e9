
import { useState, useEffect, useRef } from 'react';
import { getPottyBreaksByDogAndTimeSlot2 } from '@/services/dailyCare/pottyBreak/queries/timeSlotQueries';
import { toast } from '@/components/ui/use-toast';
import { useCallback } from 'react';

export const usePottyBreakData = (currentDate: Date) => {
  const [pottyBreaks, setPottyBreaks] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Add caching mechanism
  const cacheExpiryRef = useRef<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  const isFetchingRef = useRef(false);
  
  // Fetch potty breaks data with caching
  const fetchPottyBreaks = useCallback(async (forceRefresh = false) => {
    // Skip if already fetching
    if (isFetchingRef.current) {
      console.log('🔍 Already fetching potty breaks, skipping');
      return;
    }
    
    // Check cache unless force refresh is requested
    const now = Date.now();
    if (!forceRefresh && now < cacheExpiryRef.current) {
      console.log('📋 Using cached potty breaks, next refresh in', 
        Math.ceil((cacheExpiryRef.current - now) / 1000), 'seconds');
      return;
    }
    
    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      console.log('🔍 Fetching potty breaks for date:', currentDate.toISOString().slice(0, 10));
      
      const breaks = await getPottyBreaksByDogAndTimeSlot2(currentDate);
      console.log('✅ Retrieved potty breaks for', Object.keys(breaks).length, 'dogs');
      
      setPottyBreaks(breaks);
      
      // Update cache expiry
      cacheExpiryRef.current = Date.now() + CACHE_DURATION;
    } catch (error) {
      console.error('❌ Error fetching potty breaks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load potty break data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentDate]);
  
  // Initial fetch
  useEffect(() => {
    fetchPottyBreaks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  // Check if a dog has a potty break at a specific time slot
  const hasPottyBreak = useCallback((dogId: string, timeSlot: string) => {
    return pottyBreaks[dogId]?.includes(timeSlot) || false;
  }, [pottyBreaks]);
  
  return {
    pottyBreaks,
    setPottyBreaks,
    isLoading,
    fetchPottyBreaks,
    hasPottyBreak
  };
};
