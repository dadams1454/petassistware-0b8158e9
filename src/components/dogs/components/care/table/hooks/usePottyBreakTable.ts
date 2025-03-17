
import { useState, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { getPottyBreaksByDogAndTimeSlot } from '@/services/dailyCare/pottyBreak/pottyBreakQueryService';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';
import { toast } from '@/components/ui/use-toast';

const usePottyBreakTable = (dogsStatus: DogCareStatus[], onRefresh?: () => void) => {
  const [currentDate] = useState(new Date());
  const [pottyBreaks, setPottyBreaks] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Sort dogs alphabetically by name
  const sortedDogs = [...dogsStatus].sort((a, b) => 
    a.dog_name.toLowerCase().localeCompare(b.dog_name.toLowerCase())
  );
  
  // Fetch potty breaks data
  const fetchPottyBreaks = async () => {
    try {
      setIsLoading(true);
      const breaks = await getPottyBreaksByDogAndTimeSlot(currentDate);
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
  };
  
  // Load potty breaks on initial render
  useEffect(() => {
    fetchPottyBreaks();
  }, [currentDate]);
  
  // Check if a dog has a potty break at a specific time slot
  const hasPottyBreak = (dogId: string, timeSlot: string) => {
    return pottyBreaks[dogId]?.includes(timeSlot) || false;
  };
  
  // Handle cell click to log a potty break
  const handleCellClick = async (dogId: string, dogName: string, timeSlot: string) => {
    try {
      setIsLoading(true);
      await logDogPottyBreak(dogId, timeSlot);
      
      // Update local state for immediate UI feedback
      setPottyBreaks(prev => {
        const updated = { ...prev };
        if (!updated[dogId]) {
          updated[dogId] = [];
        }
        if (!updated[dogId].includes(timeSlot)) {
          updated[dogId].push(timeSlot);
        }
        return updated;
      });
      
      toast({
        title: 'Potty Break Logged',
        description: `${dogName} was taken out at ${timeSlot}`,
      });
    } catch (error) {
      console.error('Error logging potty break:', error);
      toast({
        title: 'Error',
        description: 'Failed to log potty break',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    fetchPottyBreaks();
    if (onRefresh) {
      onRefresh();
    }
  };

  return {
    currentDate,
    isLoading,
    pottyBreaks,
    sortedDogs,
    hasPottyBreak,
    handleCellClick,
    handleRefresh
  };
};

export default usePottyBreakTable;
