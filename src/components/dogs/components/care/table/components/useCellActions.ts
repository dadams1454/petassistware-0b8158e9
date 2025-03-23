
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useOperationQueue } from './queueHooks/useOperationQueue';
import { useClickProtection } from './queueHooks/useClickProtection';
import { usePottyBreakOperations } from './queueHooks/usePottyBreakOperations';
import { useFeedingOperations } from './queueHooks/useFeedingOperations';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

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
  
  // Create a debounced version of the API operations
  const debouncedAddPottyBreak = useDebouncedCallback((dogId: string, dogName: string, timeSlot: string, queueOp: any) => {
    addPottyBreak(dogId, dogName, timeSlot, queueOp);
  }, 300);
  
  const debouncedRemovePottyBreak = useDebouncedCallback((dogId: string, dogName: string, timeSlot: string, queueOp: any) => {
    removePottyBreak(dogId, dogName, timeSlot, queueOp);
  }, 300);
  
  const debouncedLogFeeding = useDebouncedCallback((dogId: string, dogName: string, timeSlot: string, queueOp: any) => {
    logFeeding(dogId, dogName, timeSlot, queueOp);
  }, 300);
  
  // Handler for cell clicks with optimistic updates and enhanced error prevention
  const handleCellClick = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    if (isLoading) {
      console.log("Ignoring click - loading in progress");
      return;
    }
    
    // Use click protection to track and potentially block excessive clicks, but allow most
    if (!trackClick(dogName, timeSlot)) {
      // Even if we block API operations, still perform optimistic UI updates
      console.log("Click throttled but UI will still update");
    }
    
    if (category !== activeCategory) {
      console.log('Cell click ignored - category mismatch:', category, activeCategory);
      return;
    }
    
    try {
      if (category === 'pottybreaks') {
        // Check if this dog already has a potty break at this time
        const hasPottyBreak = pottyBreaks[dogId]?.includes(timeSlot);
        
        // Perform immediate optimistic UI update, even if we're throttling API calls
        if (hasPottyBreak) {
          // Immediately remove from local state
          const updatedBreaks = { ...pottyBreaks };
          if (updatedBreaks[dogId]) {
            updatedBreaks[dogId] = updatedBreaks[dogId].filter(t => t !== timeSlot);
            setPottyBreaks(updatedBreaks);
          }
          
          // Then queue the actual API operation (debounced)
          debouncedRemovePottyBreak(dogId, dogName, timeSlot, queueOperation);
        } else {
          // Immediately add to local state
          const updatedBreaks = { ...pottyBreaks };
          if (!updatedBreaks[dogId]) {
            updatedBreaks[dogId] = [];
          }
          if (!updatedBreaks[dogId].includes(timeSlot)) {
            updatedBreaks[dogId] = [...updatedBreaks[dogId], timeSlot];
            setPottyBreaks(updatedBreaks);
          }
          
          // Then queue the actual API operation (debounced)
          debouncedAddPottyBreak(dogId, dogName, timeSlot, queueOperation);
        }
      } else if (category === 'feeding') {
        debouncedLogFeeding(dogId, dogName, timeSlot, queueOperation);
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
    setPottyBreaks,
    trackClick, 
    queueOperation, 
    debouncedAddPottyBreak,
    debouncedRemovePottyBreak, 
    debouncedLogFeeding, 
    toast
  ]);
  
  // Reset click counter periodically
  useEffect(() => {
    const resetInterval = setInterval(() => {
      if (clickCount.current > 0) {
        console.log(`Auto-resetting click counter from ${clickCount.current} to 0`);
        resetClicks();
      }
    }, 5000); // Reset the click counter every 5 seconds
    
    return () => {
      clearInterval(resetInterval);
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
