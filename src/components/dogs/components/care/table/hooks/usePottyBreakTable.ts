
import { useState, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { getPottyBreaksByDogAndTimeSlot, savePottyBreaksByDogAndTimeSlot } from '@/services/dailyCare/pottyBreak/pottyBreakQueryService';
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
      console.log('Fetching potty breaks for date:', currentDate.toISOString().slice(0, 10));
      const breaks = await getPottyBreaksByDogAndTimeSlot(currentDate);
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
      
      // Clone current state
      const updatedBreaks = { ...pottyBreaks };
      
      // If the dog doesn't have an entry yet, create one
      if (!updatedBreaks[dogId]) {
        updatedBreaks[dogId] = [];
      }
      
      // Toggle the state - if already marked, remove it, otherwise add it
      const timeSlotIndex = updatedBreaks[dogId].indexOf(timeSlot);
      if (timeSlotIndex >= 0) {
        // Remove the time slot from the dog's breaks
        updatedBreaks[dogId].splice(timeSlotIndex, 1);
        toast({
          title: 'Potty Break Removed',
          description: `Removed potty break for ${dogName} at ${timeSlot}`,
        });
      } else {
        // Add the time slot to the dog's breaks
        updatedBreaks[dogId].push(timeSlot);
        
        // Also log this in the database as a potty break event
        await logDogPottyBreak(dogId, timeSlot);
        
        toast({
          title: 'Potty Break Logged',
          description: `${dogName} was taken out at ${timeSlot}`,
        });
      }
      
      // Update state with the new breaks
      setPottyBreaks(updatedBreaks);
      
      // Save the updated potty breaks to the database
      await savePottyBreaksByDogAndTimeSlot(currentDate, updatedBreaks);
      
    } catch (error) {
      console.error('Error toggling potty break:', error);
      toast({
        title: 'Error',
        description: 'Failed to update potty break',
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
