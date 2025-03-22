
import { useState, useCallback, useRef } from 'react';
import { usePottyActions } from './usePottyActions';
import { useFeedingActions } from './useFeedingActions';

export const useCellActions = (
  currentDate: Date,
  pottyBreaks: Record<string, string[]>,
  setPottyBreaks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  onRefresh?: () => void,
  activeCategory: string = 'pottybreaks'
) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Debounce timer reference
  const debounceTimerRef = useRef<number | null>(null);
  
  // Initialize specialized hooks
  const { 
    isLoading: isPottyLoading, 
    handlePottyAction 
  } = usePottyActions(pottyBreaks, setPottyBreaks, activeCategory, onRefresh);
  
  const { 
    feedingLogs, 
    handleFeedingAction, 
    resetFeedingLogs 
  } = useFeedingActions(activeCategory, onRefresh);
  
  // Handler for cell clicks
  const handleCellClick = useCallback(async (
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    category: string
  ) => {
    if (isLoading || isPottyLoading) return;
    setIsLoading(true);
    
    try {
      if (category !== activeCategory) {
        console.log('Cell click ignored - category mismatch:', category, activeCategory);
        return;
      }
      
      if (category === 'pottybreaks') {
        await handlePottyAction(dogId, dogName, timeSlot);
      } else if (category === 'feeding') {
        await handleFeedingAction(dogId, dogName, timeSlot);
      }
      
      // Schedule a refresh after a brief delay to limit API calls
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = window.setTimeout(() => {
        if (onRefresh) {
          onRefresh();
        }
        debounceTimerRef.current = null;
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  }, [
    isLoading, 
    isPottyLoading, 
    activeCategory, 
    handlePottyAction, 
    handleFeedingAction, 
    onRefresh
  ]);
  
  return {
    isLoading: isLoading || isPottyLoading,
    handleCellClick,
    feedingLogs,
    resetFeedingLogs
  };
};
