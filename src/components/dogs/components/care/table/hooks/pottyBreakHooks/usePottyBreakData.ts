
import { useState, useEffect, useRef, useCallback } from 'react';
import { getPottyBreaksByDogAndTimeSlot2 } from '@/services/dailyCare/pottyBreak/queries/timeSlotQueries';
import { toast } from '@/components/ui/use-toast';

export const usePottyBreakData = (currentDate: Date) => {
  const [pottyBreaks, setPottyBreaks] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Enhanced caching mechanism with more robust state tracking
  const cacheExpiryRef = useRef<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Fetch potty breaks data with improved caching
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
    
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller
    abortControllerRef.current = new AbortController();
    
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
      // Ignore aborted requests
      if ((error as Error).name === 'AbortError') {
        console.log('🛑 Potty breaks fetch aborted');
        return;
      }
      
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
  
  // Cleanup function for abort controller
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  // Initial fetch - only when date changes
  useEffect(() => {
    fetchPottyBreaks();
    
    // Reset cache on date change
    return () => {
      cacheExpiryRef.current = 0;
    };
  }, [currentDate, fetchPottyBreaks]);

  // Optimized hasPottyBreak function with memoization potential
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
