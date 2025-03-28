
import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { logDogLetOut } from '@/services/dailyCare/dogLetOut/dogLetOutService';
import { useAuth } from '@/contexts/AuthProvider';

/**
 * Hook for handling dog let out specific operations
 */
export const useDogLetOutOperations = (
  dogLetOuts: Record<string, string[]>,
  setDogLetOuts: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Handle adding a dog let out with optimistic UI updates
  const addDogLetOut = useCallback((
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    queueOperation: (operation: () => Promise<void>) => void
  ) => {
    // Optimistically update UI first
    const updatedDogLetOuts = { ...dogLetOuts };
    if (!updatedDogLetOuts[dogId]) {
      updatedDogLetOuts[dogId] = [];
    }
    
    if (!updatedDogLetOuts[dogId].includes(timeSlot)) {
      updatedDogLetOuts[dogId] = [...updatedDogLetOuts[dogId], timeSlot];
    }
    
    setDogLetOuts(updatedDogLetOuts);
    
    // Queue the actual API operation
    queueOperation(async () => {
      try {
        // Pass the user ID when logging dog let outs
        await logDogLetOut(dogId, timeSlot, user?.id);
        console.log('Dog let out logged successfully:', { dogId, timeSlot });
      } catch (error) {
        console.error('Error in queued dog let out operation:', error);
        // If the API call fails, revert the optimistic update
        const revertedLetOuts = { ...updatedDogLetOuts };
        if (revertedLetOuts[dogId]) {
          revertedLetOuts[dogId] = revertedLetOuts[dogId].filter(slot => slot !== timeSlot);
          if (revertedLetOuts[dogId].length === 0) {
            delete revertedLetOuts[dogId];
          }
          setDogLetOuts(revertedLetOuts);
        }
        
        // Show error toast
        toast({
          title: 'Error logging dog let out',
          description: `Failed to log dog let out for ${dogName}`,
          variant: 'destructive',
        });
      }
    });
    
    toast({
      title: 'Dog let out logged',
      description: `${dogName} was let out at ${timeSlot}`,
    });
  }, [dogLetOuts, setDogLetOuts, toast, user]);

  // Handle removing a dog let out with optimistic UI updates
  const removeDogLetOut = useCallback((
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    queueOperation: (operation: () => Promise<void>) => void
  ) => {
    // Remove the dog let out from UI state
    const updatedDogLetOuts = { ...dogLetOuts };
    if (updatedDogLetOuts[dogId]) {
      updatedDogLetOuts[dogId] = updatedDogLetOuts[dogId].filter(slot => slot !== timeSlot);
      if (updatedDogLetOuts[dogId].length === 0) {
        delete updatedDogLetOuts[dogId];
      }
    }
    
    setDogLetOuts(updatedDogLetOuts);
    
    // Queue the actual operation
    queueOperation(async () => {
      // Here you would add code to remove the dog let out from the database
      // For now, we're just simulating a successful operation
      console.log('Remove dog let out operation queued:', { dogId, timeSlot });
    });
    
    toast({
      title: 'Dog let out removed',
      description: `Removed dog let out for ${dogName} at ${timeSlot}`,
    });
  }, [dogLetOuts, setDogLetOuts, toast]);

  return {
    addDogLetOut,
    removeDogLetOut
  };
};
