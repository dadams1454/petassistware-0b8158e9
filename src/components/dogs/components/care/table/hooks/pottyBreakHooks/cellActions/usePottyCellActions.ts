
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';

interface UsePottyCellActionsProps {
  pottyBreaks: Record<string, string[]>;
  setPottyBreaks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  onRefresh?: () => void;
}

export const usePottyCellActions = ({ 
  pottyBreaks, 
  setPottyBreaks, 
  onRefresh 
}: UsePottyCellActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Handle potty break cell clicks
  const handlePottyCellClick = useCallback(async (
    dogId: string, 
    dogName: string, 
    timeSlot: string
  ) => {
    if (isLoading) {
      console.log('🔄 Cell click ignored - loading in progress');
      return;
    }
    
    console.log(`🖱️ Potty cell clicked: ${dogName} (${dogId}) - ${timeSlot}`);
    
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
        // Add a new potty break and update UI state - always using current time for the timestamp
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
      
      // Trigger refresh callback if provided
      if (onRefresh) {
        onRefresh();
      }
      
    } catch (error) {
      console.error(`Error handling potty break cell click:`, error);
      toast({
        title: `Error logging potty break`,
        description: `Could not log potty break for ${dogName}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, pottyBreaks, setPottyBreaks, toast, onRefresh]);
  
  return {
    isLoading,
    handlePottyCellClick
  };
};
