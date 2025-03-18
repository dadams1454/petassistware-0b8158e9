
import { useState, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { usePottyBreakData } from './pottyBreakHooks/usePottyBreakData';
import { useCareLogsData } from './pottyBreakHooks/useCareLogsData';
import { useDogSorting } from './pottyBreakHooks/useDogSorting';
import { useCellActions } from './pottyBreakHooks/useCellActions';

const usePottyBreakTable = (
  dogsStatus: DogCareStatus[], 
  onRefresh?: () => void,
  activeCategory: string = 'pottybreaks'
) => {
  const [currentDate] = useState(new Date());
  
  // Use the refactored hooks
  const { sortedDogs } = useDogSorting(dogsStatus);
  const { pottyBreaks, setPottyBreaks, isLoading: pottyBreaksLoading, fetchPottyBreaks, hasPottyBreak } = usePottyBreakData(currentDate);
  const { careLogs, fetchCareLogs, isLoading: careLogsLoading, hasCareLogged } = useCareLogsData(sortedDogs);
  const { handleCellClick, isLoading: cellActionsLoading } = useCellActions(currentDate, pottyBreaks, setPottyBreaks, onRefresh);
  
  // Combined loading state
  const isLoading = pottyBreaksLoading || careLogsLoading || cellActionsLoading;
  
  // Wrapper for hasCareLogged to incorporate hasPottyBreak
  const handleHasCareLogged = useCallback((dogId: string, timeSlot: string, category: string) => {
    return hasCareLogged(dogId, timeSlot, category, hasPottyBreak);
  }, [hasCareLogged, hasPottyBreak]);
  
  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    fetchPottyBreaks();
    fetchCareLogs();
    if (onRefresh) {
      onRefresh();
    }
  }, [fetchPottyBreaks, fetchCareLogs, onRefresh]);

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
