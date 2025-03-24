
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
      console.log("⚠️ Ignoring click - loading in progress");
      return;
    }
    
    // Set loading state to prevent rapid clicks
    setIsLoading(true);
    
    // Log the click for debugging
    console.log(`🔍 Cell clicked: ${dogName} at ${timeSlot} in ${category}`);
    
    // Use click protection to track and potentially block excessive clicks, but allow most
    if (!trackClick(dogName, timeSlot)) {
      console.log("⚠️ Click throttled but UI will still update");
      setIsLoading(false);
      return;
    }
    
    if (category !== activeCategory) {
      console.log('❌ Cell click ignored - category mismatch:', category, activeCategory);
      setIsLoading(false);
      return;
    }
    
    try {
      if (category === 'pottybreaks') {
        // Check if this dog already has a potty break at this time
        const hasPottyBreak = pottyBreaks[dogId]?.includes(timeSlot);
        
        console.log(`${dogName} at ${timeSlot}: current potty break status = ${hasPottyBreak ? 'YES' : 'NO'}`);
        
        if (hasPottyBreak) {
          // Queue the removal operation which will handle optimistic UI updates
          removePottyBreak(dogId, dogName, timeSlot, queueOperation);
        } else {
          // Queue the add operation which will handle optimistic UI updates
          addPottyBreak(dogId, dogName, timeSlot, queueOperation);
        }
      } else if (category === 'feeding') {
        logFeeding(dogId, dogName, timeSlot, queueOperation);
      }
    } catch (error) {
      console.error(`❌ Error handling ${category} cell click:`, error);
      toast({
        title: `Error logging ${category}`,
        description: `Could not log ${category} for ${dogName}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      // Clear loading state after a short delay to prevent rapid clicks
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
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
  
  // Reset click counter periodically
  useEffect(() => {
    const resetInterval = setInterval(() => {
      if (clickCount.current > 0) {
        console.log(`🔄 Auto-resetting click counter from ${clickCount.current} to 0`);
        resetClicks();
      }
    }, 5000); // Reset the click counter every 5 seconds
    
    return () => {
      clearInterval(resetInterval);
      console.log(`🧹 Cleanup: ${clickCount.current} clicks cleared`);
      resetClicks();
      totalOperations.current = 0;
    };
  }, [resetClicks, clickCount, totalOperations]);
  
  return {
    isLoading,
    handleCellClick
  };
};
