
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useOperationQueue } from './queueHooks/useOperationQueue';
import { useClickProtection } from './queueHooks/useClickProtection';
import { usePottyBreakOperations } from './queueHooks/usePottyBreakOperations';
import { useFeedingOperations } from './queueHooks/useFeedingOperations';

export const useCellActions = (
  currentDate: Date,
  pottyBreaks: Record<string, string[]>,
  setPottyBreaks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  onRefresh?: () => void,
  activeCategory: string = 'pottybreaks'
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Use our refactored hooks
  const { queueOperation, totalOperations } = useOperationQueue(onRefresh);
  const { trackClick, clickCount, resetClicks } = useClickProtection(activeCategory);
  const { addPottyBreak, removePottyBreak } = usePottyBreakOperations(pottyBreaks, setPottyBreaks);
  const { logFeeding } = useFeedingOperations();
  
  // Handler for cell clicks with optimistic updates and enhanced error prevention
  const handleCellClick = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    if (isLoading) {
      console.log("Ignoring click - loading in progress");
      return;
    }
    
    // Use click protection to track and potentially block excessive clicks
    if (!trackClick(dogName, timeSlot)) {
      return; // Block processing if click protection is triggered
    }
    
    if (category !== activeCategory) {
      console.log('Cell click ignored - category mismatch:', category, activeCategory);
      return;
    }
    
    try {
      if (category === 'pottybreaks') {
        // Check if this dog already has a potty break at this time
        const hasPottyBreak = pottyBreaks[dogId]?.includes(timeSlot);
        
        if (hasPottyBreak) {
          removePottyBreak(dogId, dogName, timeSlot, queueOperation);
        } else {
          addPottyBreak(dogId, dogName, timeSlot, queueOperation);
        }
      } else if (category === 'feeding') {
        logFeeding(dogId, dogName, timeSlot, queueOperation);
      }
    } catch (error) {
      console.error(`Error handling ${category} cell click:`, error);
      toast({
        title: `Error logging ${category}`,
        description: `Could not log ${category} for ${dogName}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    isLoading, 
    activeCategory, 
    pottyBreaks, 
    trackClick, 
    queueOperation, 
    addPottyBreak, 
    removePottyBreak, 
    logFeeding, 
    toast
  ]);
  
  // Reset click counter when unmounting
  useEffect(() => {
    return () => {
      console.log(`Cleanup: ${clickCount.current} clicks cleared`);
      resetClicks();
      totalOperations.current = 0;
    };
  }, [resetClicks, clickCount, totalOperations]);
  
  return {
    isLoading,
    handleCellClick
  };
};
