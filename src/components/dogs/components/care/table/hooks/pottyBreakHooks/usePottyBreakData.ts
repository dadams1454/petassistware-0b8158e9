
import { useCallback, useEffect } from 'react';
import { getPottyBreaksByDogAndTimeSlot2 } from '@/services/dailyCare/pottyBreak/queries/timeSlotQueries';
import { toast } from '@/components/ui/use-toast';
import { useQueryWithRefresh } from '@/hooks/useQueryWithRefresh';
import { useRefreshTimestamp } from '@/contexts/refreshTimestamp';

export const usePottyBreakData = (currentDate: Date) => {
  const { lastRefresh } = useRefreshTimestamp();
  
  // Use React Query for fetching potty breaks
  const { 
    data: pottyBreaks = {}, 
    isLoading,
    refetch: refetchPottyBreaks,
    isRefetching
  } = useQueryWithRefresh({
    queryKey: ['pottyBreaks', currentDate.toISOString().split('T')[0], lastRefresh],
    queryFn: async () => {
      console.log('🔍 Fetching potty breaks for date:', currentDate.toISOString().slice(0, 10));
      const breaks = await getPottyBreaksByDogAndTimeSlot2(currentDate);
      console.log('✅ Retrieved potty breaks for', Object.keys(breaks).length, 'dogs');
      return breaks;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refreshLabel: 'potty break data'
  });
  
  // Log potty breaks data when it changes
  useEffect(() => {
    if (Object.keys(pottyBreaks).length > 0) {
      console.log('Potty breaks data updated:', pottyBreaks);
    }
  }, [pottyBreaks]);
  
  // Fetch potty breaks - now just calls the react-query refetch
  const fetchPottyBreaks = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      console.log('🔄 Force refreshing potty breaks');
      try {
        await refetchPottyBreaks();
      } catch (error) {
        console.error('❌ Error fetching potty breaks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load potty break data',
          variant: 'destructive'
        });
      }
    }
  }, [refetchPottyBreaks]);
  
  // Check if a dog has a potty break at a specific time slot
  const hasPottyBreak = useCallback((dogId: string, timeSlot: string) => {
    return pottyBreaks[dogId]?.includes(timeSlot) || false;
  }, [pottyBreaks]);
  
  return {
    pottyBreaks,
    setPottyBreaks: () => {}, // This is now a no-op since we're using React Query
    isLoading: isLoading || isRefetching,
    fetchPottyBreaks,
    hasPottyBreak
  };
};
