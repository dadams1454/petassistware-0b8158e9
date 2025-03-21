
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { usePottyCellActions, useFeedingCellActions, useDebounce } from './cellActions';

export const useCellActions = (
  currentDate: Date,
  pottyBreaks: Record<string, string[]>,
  setPottyBreaks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  onRefresh?: () => void,
  activeCategory: string = 'pottybreaks'
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { debounce } = useDebounce(1000);
  
  // Import specialized handlers for different categories
  const { 
    handlePottyCellClick,
    isCellActive: isPottyCellActive,
    isLoading: pottyLoading 
  } = usePottyCellActions({ 
    pottyBreaks, 
    setPottyBreaks, 
    onRefresh 
  });
  
  const { 
    handleFeedingCellClick, 
    refreshFeedingLogsCache,
    resetCache,
    isCellActive: isFeedingCellActive,
    isLoading: feedingLoading 
  } = useFeedingCellActions({ 
    currentDate, 
    onRefresh 
  });
  
  // Clear cache when category changes or date changes
  useEffect(() => {
    console.log(`🔄 Category changed to ${activeCategory} or date changed - clearing feeding logs cache`);
    resetCache();
  }, [activeCategory, currentDate, resetCache]);
  
  // Initialize cache when the hook is mounted
  useEffect(() => {
    if (activeCategory === 'feeding') {
      refreshFeedingLogsCache();
    }
  }, [activeCategory, refreshFeedingLogsCache]);
  
  // Combined loading state
  useEffect(() => {
    setIsLoading(pottyLoading || feedingLoading);
  }, [pottyLoading, feedingLoading]);
  
  // Handler for cell clicks - routes to appropriate handler based on category
  const handleCellClick = useCallback(async (
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    category: string
  ) => {
    if (category !== activeCategory) {
      console.log('Cell click ignored - category mismatch:', category, activeCategory);
      return;
    }
    
    console.log(`🖱️ Cell clicked: ${dogName} (${dogId}) - ${timeSlot} - ${category}`);
    
    try {
      if (category === 'pottybreaks') {
        await handlePottyCellClick(dogId, dogName, timeSlot);
      } else if (category === 'feeding') {
        await handleFeedingCellClick(dogId, dogName, timeSlot, user?.id);
      }
    } catch (error) {
      console.error(`Error handling ${category} cell click:`, error);
    }
  }, [
    activeCategory, 
    handlePottyCellClick, 
    handleFeedingCellClick, 
    user
  ]);
  
  // Check if a cell is active for UI purposes
  const isCellActive = useCallback((dogId: string, timeSlot: string, category: string) => {
    if (category === 'pottybreaks') {
      return isPottyCellActive(dogId, timeSlot);
    } else if (category === 'feeding') {
      return isFeedingCellActive(dogId, timeSlot);
    }
    return false;
  }, [isPottyCellActive, isFeedingCellActive]);
  
  return {
    isLoading,
    handleCellClick,
    refreshCache: refreshFeedingLogsCache,
    isCellActive
  };
};
