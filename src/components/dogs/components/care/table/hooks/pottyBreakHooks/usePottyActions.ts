
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';

export const usePottyActions = (
  pottyBreaks: Record<string, string[]>,
  setPottyBreaks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  activeCategory: string = 'pottybreaks',
  onRefresh?: () => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Handle potty break action
  const handlePottyAction = useCallback(async (
    dogId: string, 
    dogName: string, 
    timeSlot: string
  ) => {
    if (activeCategory !== 'pottybreaks') {
      console.log('Potty action ignored - not in potty breaks category');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Check if this dog already has a potty break at this time
      const hasPottyBreak = pottyBreaks[dogId]?.includes(timeSlot);
      
      if (hasPottyBreak) {
        // Remove the potty break from UI state
        const updatedDogBreaks = pottyBreaks[dogId].filter(slot => slot !== timeSlot);
        const updatedPottyBreaks = { ...pottyBreaks };
        
        if (updatedDogBreaks.length === 0) {
          delete updatedPottyBreaks[dogId];
        } else {
          updatedPottyBreaks[dogId] = updatedDogBreaks;
        }
        
        setPottyBreaks(updatedPottyBreaks);
        
        toast({
          title: 'Potty break removed',
          description: `Removed potty break for ${dogName} at ${timeSlot}`,
        });
      } else {
        // Add a new potty break and update UI state
        await logDogPottyBreak(dogId, timeSlot);
        
        // Update local state for immediate UI update
        const updatedPottyBreaks = { ...pottyBreaks };
        if (!updatedPottyBreaks[dogId]) {
          updatedPottyBreaks[dogId] = [];
        }
        
        if (!updatedPottyBreaks[dogId].includes(timeSlot)) {
          updatedPottyBreaks[dogId] = [...updatedPottyBreaks[dogId], timeSlot];
        }
        
        setPottyBreaks(updatedPottyBreaks);
        
        toast({
          title: 'Potty break logged',
          description: `${dogName} was taken out at ${timeSlot}`,
        });
      }
      
      // Trigger refresh if provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error handling potty action:', error);
      toast({
        title: 'Error logging potty break',
        description: `Could not log potty break for ${dogName}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, pottyBreaks, setPottyBreaks, toast, onRefresh]);
  
  return {
    isLoading,
    handlePottyAction
  };
};
