
import { useState, useEffect, useCallback, useMemo } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useObservations } from './pottyBreakHooks/useObservations';
import { usePottyBreakData } from './pottyBreakHooks/usePottyBreakData';
import { useDogSorting } from './pottyBreakHooks/useDogSorting';
import { useCellActions } from './pottyBreakHooks/useCellActions';
import { useRefreshHandler } from './pottyBreakHooks/useRefreshHandler';
import { useCareLogsData } from './pottyBreakHooks/useCareLogsData';

const usePottyBreakTable = (
  dogs: DogCareStatus[],
  onRefresh?: () => void,
  activeCategory: string = 'pottybreaks'
) => {
  const [loading, setLoading] = useState(false);
  const { pottyBreaks, setPottyBreaks } = usePottyBreakData(dogs);
  const { sortedDogs } = useDogSorting(dogs);
  
  const today = useMemo(() => new Date(), []);

  // Set up cell actions
  const { 
    isLoading: isCellActionsLoading, 
    handleCellClick, 
    feedingLogs,
    resetFeedingLogs 
  } = useCellActions(today, pottyBreaks, setPottyBreaks, onRefresh, activeCategory);

  // Set up refresh handler
  const { isRefreshing, handleRefresh } = useRefreshHandler(onRefresh, setLoading);

  // Set up care logs data for feeding
  const { careLogs, hasCareLogged } = useCareLogsData(dogs, activeCategory);

  // Set up observations
  const { 
    observations, 
    hasObservation, 
    getObservationDetails,
    addObservation 
  } = useObservations(dogs);

  // Function to check if a dog has a potty break at a specific time
  const hasPottyBreak = useCallback((dogId: string, timeSlot: string) => {
    return pottyBreaks[dogId]?.includes(timeSlot) || false;
  }, [pottyBreaks]);

  // Function to handle dog name click
  const handleDogClick = useCallback((dogId: string) => {
    // Navigate to dog detail page or open dog info dialog
    console.log('Dog clicked:', dogId);
  }, []);

  // Derive isLoading state
  const isLoading = loading || isRefreshing || isCellActionsLoading;

  return {
    isLoading,
    sortedDogs,
    pottyBreaks,
    hasPottyBreak,
    hasCareLogged,
    hasObservation,
    getObservationDetails,
    addObservation,
    observations,
    careLogs,
    handleCellClick,
    handleRefresh,
    handleDogClick,
    feedingLogs,
    resetFeedingLogs
  };
};

export default usePottyBreakTable;
