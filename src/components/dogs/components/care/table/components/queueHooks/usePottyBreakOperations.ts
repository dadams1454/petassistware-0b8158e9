
import { useCallback } from 'react';
import { addPottyBreakByDogAndTime, removePottyBreakByDogAndTime } from '@/services/dailyCare/pottyBreak/mutations';

export const usePottyBreakOperations = (
  pottyBreaks: Record<string, string[]>,
  setPottyBreaks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
) => {
  // Add potty break operation
  const addPottyBreak = useCallback((
    dogId: string,
    dogName: string,
    timeSlot: string,
    queueOperation: (op: () => Promise<void>) => void
  ) => {
    queueOperation(async () => {
      console.log(`⏳ Adding potty break for ${dogName} at ${timeSlot}...`);
      
      try {
        // Make the API call
        await addPottyBreakByDogAndTime(dogId, timeSlot);
        console.log(`✅ Successfully added potty break for ${dogName} at ${timeSlot}`);
      } catch (error) {
        console.error(`❌ Error adding potty break for ${dogName}:`, error);
        
        // Revert the optimistic update on error
        setPottyBreaks(prev => {
          const updatedBreaks = { ...prev };
          if (updatedBreaks[dogId]) {
            updatedBreaks[dogId] = updatedBreaks[dogId].filter(t => t !== timeSlot);
          }
          return updatedBreaks;
        });
        
        throw error;
      }
    });
  }, [setPottyBreaks]);
  
  // Remove potty break operation
  const removePottyBreak = useCallback((
    dogId: string,
    dogName: string,
    timeSlot: string,
    queueOperation: (op: () => Promise<void>) => void
  ) => {
    queueOperation(async () => {
      console.log(`⏳ Removing potty break for ${dogName} at ${timeSlot}...`);
      
      try {
        // Make the API call
        await removePottyBreakByDogAndTime(dogId, timeSlot);
        console.log(`✅ Successfully removed potty break for ${dogName} at ${timeSlot}`);
      } catch (error) {
        console.error(`❌ Error removing potty break for ${dogName}:`, error);
        
        // Revert the optimistic update on error
        setPottyBreaks(prev => {
          const updatedBreaks = { ...prev };
          if (!updatedBreaks[dogId]) {
            updatedBreaks[dogId] = [];
          }
          if (!updatedBreaks[dogId].includes(timeSlot)) {
            updatedBreaks[dogId] = [...updatedBreaks[dogId], timeSlot];
          }
          return updatedBreaks;
        });
        
        throw error;
      }
    });
  }, [setPottyBreaks]);

  return {
    addPottyBreak,
    removePottyBreak
  };
};
