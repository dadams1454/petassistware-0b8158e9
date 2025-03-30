import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';
import { useAuth } from '@/contexts/AuthProvider';

/**
 * Hook for handling potty break specific operations
 */
export const usePottyBreakOperations = (
  pottyBreaks: Record<string, string[]>,
  setPottyBreaks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();

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
        // Pass the user ID when logging potty breaks
        await logDogPottyBreak(dogId, timeSlot, user?.id);
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
  }, [pottyBreaks, setPottyBreaks, toast, user]);

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
      // Here you would add code to remove the potty break from the database
      // For now, we're just simulating a successful operation
      console.log('Remove potty break operation queued:', { dogId, timeSlot });
    });
    
    toast({
      title: 'Potty break removed',
      description: `Removed potty break for ${dogName} at ${timeSlot}`,
    });
    
    console.log('🚫 Potty break removed for', dogName, 'at', timeSlot);
  }, [pottyBreaks, setPottyBreaks, toast]);

  return {
    addPottyBreak,
    removePottyBreak
  };
};
