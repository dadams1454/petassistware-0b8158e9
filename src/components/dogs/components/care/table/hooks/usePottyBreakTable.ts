
import { useState, useCallback, useRef } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { usePottyBreakData } from './pottyBreakHooks/usePottyBreakData';
import { useCareLogsData } from './pottyBreakHooks/useCareLogsData';
import { useDogSorting } from './pottyBreakHooks/useDogSorting';
import { useCellActions } from './pottyBreakHooks/useCellActions';
import { debounce } from 'lodash';

const usePottyBreakTable = (
  dogsStatus: DogCareStatus[], 
  onRefresh?: () => void,
  activeCategory: string = 'pottybreaks'
) => {
  const [currentDate] = useState(new Date());
  const isRefreshingRef = useRef(false);
  const lastRefreshRef = useRef<number>(Date.now());
  const MIN_REFRESH_INTERVAL = 3000; // 3 seconds between refreshes
  
  // Use the refactored hooks
  const { sortedDogs } = useDogSorting(dogsStatus);
  const { pottyBreaks, setPottyBreaks, isLoading: pottyBreaksLoading, fetchPottyBreaks, hasPottyBreak } = usePottyBreakData(currentDate);
  const { careLogs, fetchCareLogs, isLoading: careLogsLoading, hasCareLogged } = useCareLogsData(sortedDogs);
  
  // Create debounced refresh function
  const debouncedRefresh = useRef(
    debounce(async () => {
      // Skip if refresh already in progress
      if (isRefreshingRef.current) {
        console.log('🔄 Refresh already in progress, skipping');
        return;
      }
      
      // Check refresh interval
      const now = Date.now();
      if (now - lastRefreshRef.current < MIN_REFRESH_INTERVAL) {
        console.log('🔄 Skipping refresh - too soon after last refresh');
        return;
      }
      
      console.log('🔄 Performing refresh of potty break data');
      isRefreshingRef.current = true;
      lastRefreshRef.current = now;
      
      // Stagger the refreshes to prevent simultaneous API calls
      await fetchPottyBreaks(true);
      await fetchCareLogs(true);
      
      isRefreshingRef.current = false;
    }, 300)
  ).current;
  
  // Create optimized cell actions handler with debounced refresh
  const { handleCellClick, isLoading: cellActionsLoading } = useCellActions(
    currentDate, 
    pottyBreaks, 
    setPottyBreaks, 
    () => {
      // This ensures we debounce refreshes from cell clicks
      debouncedRefresh();
    }
  );
  
  // Combined loading state
  const isLoading = pottyBreaksLoading || careLogsLoading || cellActionsLoading || isRefreshingRef.current;
  
  // Wrapper for hasCareLogged to incorporate hasPottyBreak
  const handleHasCareLogged = useCallback((dogId: string, timeSlot: string, category: string) => {
    return hasCareLogged(dogId, timeSlot, category, hasPottyBreak);
  }, [hasCareLogged, hasPottyBreak]);
  
  // Handle manual refresh with debouncing
  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh requested in usePottyBreakTable');
    debouncedRefresh();
  }, [debouncedRefresh]);

  return {
    currentDate,
    isLoading,
    pottyBreaks,
    sortedDogs,
    hasPottyBreak,
    hasCareLogged: handleHasCareLogged,
    handleCellClick,
    handleRefresh
  };
};

export default usePottyBreakTable;
