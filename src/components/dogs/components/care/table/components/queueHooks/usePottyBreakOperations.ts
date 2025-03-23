
import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { addDogPottyBreak, removeDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';

/**
 * Hook for handling potty break specific operations
 */
export const usePottyBreakOperations = (
  pottyBreaks: Record<string, string[]>,
  setPottyBreaks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
) => {
  const { toast } = useToast();

  // Handle adding a potty break with optimistic UI updates
  const addPottyBreak = useCallback((
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    queueOperation: (operation: () => Promise<void>) => void
  ) => {
    // Optimistically update UI first
    const updatedPottyBreaks = { ...pottyBreaks };
    if (!updatedPottyBreaks[dogId]) {
      updatedPottyBreaks[dogId] = [];
    }
    
    if (!updatedPottyBreaks[dogId].includes(timeSlot)) {
      updatedPottyBreaks[dogId] = [...updatedPottyBreaks[dogId], timeSlot];
    }
    
    setPottyBreaks(updatedPottyBreaks);
    
    // Queue the actual API operation
    queueOperation(async () => {
      try {
        await addDogPottyBreak(dogId, timeSlot);
        console.log('Potty break logged successfully:', { dogId, timeSlot });
      } catch (error) {
        console.error('Error in queued potty break operation:', error);
        // If the API call fails, revert the optimistic update
        const revertedBreaks = { ...updatedPottyBreaks };
        if (revertedBreaks[dogId]) {
          revertedBreaks[dogId] = revertedBreaks[dogId].filter(slot => slot !== timeSlot);
          if (revertedBreaks[dogId].length === 0) {
            delete revertedBreaks[dogId];
          }
          setPottyBreaks(revertedBreaks);
        }
        
        // Show error toast
        toast({
          title: 'Error logging potty break',
          description: `Failed to log potty break for ${dogName}`,
          variant: 'destructive',
        });
      }
    });
    
    toast({
      title: 'Potty break logged',
      description: `${dogName} was taken out at ${timeSlot}`,
    });
  }, [pottyBreaks, setPottyBreaks, toast]);

  // Handle removing a potty break with optimistic UI updates
  const removePottyBreak = useCallback((
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    queueOperation: (operation: () => Promise<void>) => void
  ) => {
    // Remove the potty break from UI state
    const updatedDogBreaks = pottyBreaks[dogId]?.filter(slot => slot !== timeSlot) || [];
    const updatedPottyBreaks = { ...pottyBreaks };
    
    if (updatedDogBreaks.length === 0) {
      delete updatedPottyBreaks[dogId];
    } else {
      updatedPottyBreaks[dogId] = updatedDogBreaks;
    }
    
    setPottyBreaks(updatedPottyBreaks);
    
    // Queue the actual operation
    queueOperation(async () => {
      try {
        await removeDogPottyBreak(dogId, timeSlot);
        console.log('Potty break removed successfully:', { dogId, timeSlot });
      } catch (error) {
        console.error('Error removing potty break:', error);
        
        // Revert the optimistic update on error
        const revertedBreaks = { ...updatedPottyBreaks };
        if (!revertedBreaks[dogId]) {
          revertedBreaks[dogId] = [];
        }
        if (!revertedBreaks[dogId].includes(timeSlot)) {
          revertedBreaks[dogId] = [...revertedBreaks[dogId], timeSlot];
        }
        setPottyBreaks(revertedBreaks);
        
        // Show error toast
        toast({
          title: 'Error removing potty break',
          description: `Failed to remove potty break for ${dogName}`,
          variant: 'destructive',
        });
      }
    });
    
    toast({
      title: 'Potty break removed',
      description: `Removed potty break for ${dogName} at ${timeSlot}`,
    });
  }, [pottyBreaks, setPottyBreaks, toast]);

  return {
    addPottyBreak,
    removePottyBreak
  };
};
