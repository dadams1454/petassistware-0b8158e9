
import { useState, useCallback, useEffect, useMemo } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { usePottyBreakData } from './pottyBreakHooks/usePottyBreakData';
import { useCareLogsData } from './pottyBreakHooks/useCareLogsData';
import { useCellActions } from './pottyBreakHooks/useCellActions';
import { useRefreshHandler } from './pottyBreakHooks/useRefreshHandler';
import { useObservations } from './pottyBreakHooks/useObservations';
import { useDogSorting } from './pottyBreakHooks/useDogSorting';
import { useFeedingOperations } from './pottyBreakHooks/queueHooks/useFeedingOperations';

const usePottyBreakTable = (
  dogsStatus: DogCareStatus[], 
  onRefresh?: () => void,
  activeCategory: string = 'pottybreaks',
  currentDate: Date = new Date()
) => {
  // Set up time slots for the table
  const [timeSlots] = useState(() => {
    if (activeCategory === 'feeding') {
      return ['Morning', 'Noon', 'Evening'];
    }
    
    const slots: string[] = [];
    for (let hour = 6; hour < 21; hour++) {
      const formattedHour = hour > 12 ? hour - 12 : hour;
      const amPm = hour >= 12 ? 'PM' : 'AM';
      slots.push(`${formattedHour}:00 ${amPm}`);
    }
    return slots;
  });
  
  // Get current hour for highlighting
  const [currentHour, setCurrentHour] = useState<number>(() => {
    const now = new Date();
    return now.getHours();
  });
  
  // Update current hour periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours());
    }, 60000); // check every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Use the potty breaks data hook
  const { 
    pottyBreaks, 
    setPottyBreaks, 
    hasPottyBreak, 
    isLoading: pottyLoading 
  } = usePottyBreakData();
  
  // Use the care logs data hook for other care types
  const { hasCareLogged, isLoading: careLoading } = useCareLogsData();
  
  // Use the observations hook
  const { 
    observations,
    hasObservation,
    getObservationDetails,
    isLoading: obsLoading 
  } = useObservations(dogsStatus);
  
  // Use the cell actions hook
  const { isLoading: actionLoading, handleCellClick } = useCellActions(
    currentDate, 
    pottyBreaks, 
    setPottyBreaks, 
    onRefresh,
    activeCategory
  );
  
  // Use the refresh handler hook
  const { handleRefresh, isRefreshing } = useRefreshHandler(onRefresh);
  
  // Use the dog sorting hook
  const { sortedDogs } = useDogSorting(dogsStatus);

  // Use the feeding operations hook directly for isPendingFeeding
  const { isPendingFeeding } = useFeedingOperations();
  
  // Overall loading state
  const isLoading = useMemo(() => {
    return pottyLoading || careLoading || obsLoading || actionLoading || isRefreshing;
  }, [pottyLoading, careLoading, obsLoading, actionLoading, isRefreshing]);
  
  return {
    timeSlots,
    currentHour,
    pottyBreaks,
    sortedDogs,
    hasPottyBreak,
    hasCareLogged,
    hasObservation,
    getObservationDetails,
    handleCellClick,
    handleRefresh,
    isLoading,
    isPendingFeeding
  };
};

export default usePottyBreakTable;
