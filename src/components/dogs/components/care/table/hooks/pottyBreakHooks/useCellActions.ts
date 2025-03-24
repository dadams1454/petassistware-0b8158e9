
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useOperationQueue } from './queueHooks/useOperationQueue';
import { useClickProtection } from './queueHooks/useClickProtection';
import { usePottyBreakOperations } from './queueHooks/usePottyBreakOperations';
import { useFeedingOperations } from './queueHooks/useFeedingOperations';
import { throttle } from 'lodash';

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
  const { logFeeding, isPendingFeeding } = useFeedingOperations();
  
  // Create a throttled error toast to prevent spam
  const throttledErrorToast = useMemo(() => 
    throttle((title: string, description: string) => {
      toast({
        title,
        description,
        variant: 'destructive',
      });
    }, 2000)
  , [toast]);
  
  // Handler for cell clicks with optimistic updates and enhanced error prevention
  const handleCellClick = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    if (isLoading) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Ignoring click - loading in progress");
      }
      return;
    }
    
    // Use click protection to track and potentially block excessive clicks, but allow most
    if (!trackClick(dogName, timeSlot)) {
      // Skip the operation but don't show an error message to prevent UI noise
      if (process.env.NODE_ENV === 'development') {
        console.log("Click throttled due to excessive clicking");
      }
      return;
    }
    
    if (category !== activeCategory) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Cell click ignored - category mismatch:', category, activeCategory);
      }
      return;
    }
    
    try {
      if (category === 'pottybreaks') {
        // Check if this dog already has a potty break at this time
        const hasPottyBreak = pottyBreaks[dogId]?.includes(timeSlot);
        
        // Perform immediate optimistic UI update
        if (hasPottyBreak) {
          // Immediately remove from local state
          removePottyBreak(dogId, dogName, timeSlot, queueOperation);
        } else {
          // Immediately add to local state
          addPottyBreak(dogId, dogName, timeSlot, queueOperation);
        }
      } else if (category === 'feeding') {
        // Skip if already pending
        if (isPendingFeeding(dogId, timeSlot)) {
          return;
        }
        
        // Log the feeding
        logFeeding(dogId, dogName, timeSlot, queueOperation);
      }
    } catch (error) {
      console.error(`Error handling ${category} cell click:`, error);
      
      // Use throttled toast for errors to prevent spam
      throttledErrorToast(
        `Error logging ${category}`,
        `Could not log ${category} for ${dogName}. Please try again.`
      );
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
    isPendingFeeding,
    throttledErrorToast
  ]);
  
  // Reset click counter periodically with improved timing
  useEffect(() => {
    const resetInterval = setInterval(() => {
      if (clickCount.current > 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Auto-resetting click counter from ${clickCount.current} to 0`);
        }
        resetClicks();
      }
    }, 10000); // Increased from 5000ms to 10000ms to reduce unnecessary state updates
    
    return () => {
      clearInterval(resetInterval);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Cleanup: ${clickCount.current} clicks cleared`);
      }
      resetClicks();
      totalOperations.current = 0;
    };
  }, [resetClicks, clickCount, totalOperations]);
  
  return {
    isLoading,
    handleCellClick,
    isPendingFeeding
  };
};
