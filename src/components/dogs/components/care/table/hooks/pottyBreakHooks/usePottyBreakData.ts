
import { useState, useEffect } from 'react';
import { getPottyBreaksByDogAndTimeSlot2 } from '@/services/dailyCare/pottyBreak/pottyBreakQueryService';
import { toast } from '@/components/ui/use-toast';
import { useCallback } from 'react';

export const usePottyBreakData = (currentDate: Date) => {
  const [pottyBreaks, setPottyBreaks] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch potty breaks data
  const fetchPottyBreaks = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching potty breaks for date:', currentDate.toISOString().slice(0, 10));
      const breaks = await getPottyBreaksByDogAndTimeSlot2(currentDate);
      console.log('Retrieved potty breaks:', breaks);
      setPottyBreaks(breaks);
    } catch (error) {
      console.error('Error fetching potty breaks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load potty break data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentDate]);
  
  useEffect(() => {
    fetchPottyBreaks();
  }, [fetchPottyBreaks]);

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
