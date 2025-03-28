
import { useState, useCallback, useEffect, useMemo } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useCareLogsData } from './pottyBreakHooks/useCareLogsData';
import { useCellActions } from './pottyBreakHooks/useCellActions';
import { useRefreshHandler } from './pottyBreakHooks/useRefreshHandler';
import { useObservations } from './pottyBreakHooks/useObservations';
import { useDogSorting } from './pottyBreakHooks/useDogSorting';

const usePottyBreakTable = (
  dogsStatus: DogCareStatus[], 
  onRefresh?: () => void,
  activeCategory: string = 'feeding',
  currentDate: Date = new Date()
) => {
  // Set up time slots for the table
  const [timeSlots] = useState(() => {
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
  
  // Use care logs data hook for all care types
  const { hasCareLogged, isLoading: careLoading } = useCareLogsData(dogsStatus || []);
  
  // Use the observations hook
  const { 
    observations,
    hasObservation,
    getObservationDetails,
    isLoading: obsLoading 
  } = useObservations(dogsStatus);
  
  // Use the cell actions hook with empty potty breaks data
  const { isLoading: actionLoading, handleCellClick } = useCellActions(
    currentDate, 
    {}, // Empty potty breaks data
    () => {}, // Empty setter
    onRefresh,
    activeCategory
  );
  
  // Use the refresh handler hook
  const { handleRefresh, isRefreshing } = useRefreshHandler(onRefresh || (() => {}));
  
  // Use the dog sorting hook
  const { sortedDogs } = useDogSorting(dogsStatus);
  
  // Overall loading state
  const isLoading = useMemo(() => {
    return careLoading || obsLoading || actionLoading || isRefreshing;
  }, [careLoading, obsLoading, actionLoading, isRefreshing]);
  
  // Provide an empty hasPottyBreak function as replacement
  const hasPottyBreak = useCallback(() => false, []);
  
  return {
    timeSlots,
    currentHour,
    sortedDogs,
    hasPottyBreak,
    hasCareLogged,
    hasObservation,
    getObservationDetails,
    handleCellClick,
    handleRefresh,
    isLoading,
    isPendingFeeding: () => false
  };
};

export default usePottyBreakTable;
