
import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DogCareStatus } from '@/types/dailyCare';
import { useDogSorting } from './pottyBreakHooks/useDogSorting';
import { useRefreshHandler } from './pottyBreakHooks/useRefreshHandler';
import { usePottyBreakData } from './pottyBreakHooks/usePottyBreakData';
import { useCareLogsData } from './pottyBreakHooks/useCareLogsData';
import { useCellActions } from './pottyBreakHooks/useCellActions';
import { useObservations } from './pottyBreakHooks/useObservations';

const usePottyBreakTable = (
  dogsStatus: DogCareStatus[], 
  onRefresh?: () => void,
  activeCategory: string = 'pottybreaks'
) => {
  const [currentDate] = useState(new Date());
  const navigate = useNavigate();
  
  // Use the refactored hooks
  const { sortedDogs } = useDogSorting(dogsStatus);
  const { handleRefresh, isRefreshing } = useRefreshHandler(onRefresh);
  const { pottyBreaks, setPottyBreaks, isLoading: pottyBreaksLoading, fetchPottyBreaks, hasPottyBreak } = usePottyBreakData(currentDate);
  const { careLogs, fetchCareLogs, isLoading: careLogsLoading, hasCareLogged } = useCareLogsData(sortedDogs, activeCategory);
  const { observations, addObservation, hasObservation, getObservationDetails, isLoading: observationsLoading } = useObservations(sortedDogs);
  
  // Create optimized cell actions handler with debounced refresh
  const { handleCellClick, isLoading: cellActionsLoading } = useCellActions(
    currentDate, 
    pottyBreaks, 
    setPottyBreaks, 
    handleRefresh,
    activeCategory
  );
  
  // Combined loading state
  const isLoading = pottyBreaksLoading || careLogsLoading || cellActionsLoading || observationsLoading || isRefreshing;
  
  // Wrapper for hasCareLogged to incorporate hasPottyBreak
  const handleHasCareLogged = useCallback((dogId: string, timeSlot: string, category: string) => {
    if (category === 'pottybreaks') {
      return hasPottyBreak(dogId, timeSlot);
    }
    return hasCareLogged(dogId, timeSlot, category);
  }, [hasCareLogged, hasPottyBreak]);

  // Enhanced hasObservation function that handles both dog ID and time slot
  const handleHasObservation = useCallback((dogId: string, timeSlot: string) => {
    // Pass the arguments directly to the underlying hasObservation function
    return hasObservation(dogId, timeSlot);
  }, [hasObservation]);

  // Handle dog click to navigate to dog details page
  const handleDogClick = useCallback((dogId: string) => {
    navigate(`/dogs/${dogId}`);
  }, [navigate]);

  return {
    currentDate,
    isLoading,
    pottyBreaks,
    sortedDogs,
    hasPottyBreak,
    hasCareLogged: handleHasCareLogged,
    hasObservation: handleHasObservation,
    getObservationDetails,
    addObservation,
    observations,
    handleCellClick,
    handleRefresh,
    handleDogClick
  };
};

export default usePottyBreakTable;
