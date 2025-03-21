
import { useState, useCallback, useEffect } from 'react';
import { useFeedingCache } from './useFeedingCache';
import { useFeedingRefresh } from './useFeedingRefresh';
import { useFeedingOperations } from './useFeedingOperations';

interface UseFeedingCellActionsProps {
  currentDate: Date;
  onRefresh?: () => void;
}

export const useFeedingCellActions = ({ currentDate, onRefresh }: UseFeedingCellActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Local state for optimistic UI updates
  const [activeFeedings, setActiveFeedings] = useState<Record<string, boolean>>({});
  
  // Use our extracted hooks
  const { feedingLogsCache, refreshFeedingLogsCache, resetCache } = useFeedingCache({ currentDate });
  const { triggerDebouncedRefresh, cleanupRefresh } = useFeedingRefresh({ onRefresh });
  const { handleFeedingOperation } = useFeedingOperations({ 
    feedingLogsCache: feedingLogsCache, 
    triggerDebouncedRefresh 
  });
  
  // Handle feeding cell clicks
  const handleFeedingCellClick = useCallback(async (
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    userId?: string
  ) => {
    // Create a unique key for this cell
    const cacheKey = `${dogId}-${timeSlot}`;
    
    // Check if cell is currently active in our local state
    const isCurrentlyActive = activeFeedings[cacheKey];
    
    // Optimistically update UI immediately
    setActiveFeedings(prev => ({
      ...prev, 
      [cacheKey]: !isCurrentlyActive
    }));
    
    // Perform the actual operation
    const { success, isActive } = await handleFeedingOperation(
      dogId, 
      dogName, 
      timeSlot, 
      isCurrentlyActive, 
      userId
    );
    
    // If operation failed, revert the optimistic update
    if (!success) {
      setActiveFeedings(prev => ({
        ...prev,
        [cacheKey]: isCurrentlyActive
      }));
    }
  }, [activeFeedings, handleFeedingOperation]);
  
  // Check if a cell is active (for UI purposes)
  const isCellActive = useCallback((dogId: string, timeSlot: string) => {
    const cacheKey = `${dogId}-${timeSlot}`;
    return !!activeFeedings[cacheKey];
  }, [activeFeedings]);
  
  // Initialize active feedings from cache on mount
  useEffect(() => {
    const initializeActiveFeedings = async () => {
      setIsLoading(true);
      try {
        const cache = await refreshFeedingLogsCache(true);
        
        // Convert cache to active feedings state
        const initialActiveFeedings: Record<string, boolean> = {};
        Object.keys(cache).forEach(key => {
          initialActiveFeedings[key] = true;
        });
        
        setActiveFeedings(initialActiveFeedings);
      } catch (error) {
        console.error('Error initializing feeding state:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeActiveFeedings();
    
    // Cleanup on unmount
    return () => {
      cleanupRefresh();
    };
  }, [refreshFeedingLogsCache, cleanupRefresh]);
  
  return {
    isLoading,
    handleFeedingCellClick,
    refreshFeedingLogsCache,
    resetCache,
    isCellActive
  };
};
