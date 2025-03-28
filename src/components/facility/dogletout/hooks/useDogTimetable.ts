
import { useState, useCallback, useEffect, useMemo } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useDogLetOut } from './useDogLetOut';
import { useCareLogsData } from './useCareLogsData';
import { useCellActions } from './useCellActions';
import { useRefreshHandler } from './useRefreshHandler';
import { useObservations } from './useObservations';
import { useDogSorting } from './useDogSorting';

const useDogTimetable = (
  dogsStatus: DogCareStatus[], 
  onRefresh?: () => void,
  activeCategory: string = 'dogletout',
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
  
  // Use the dog let out data hook - pass the currentDate parameter
  const { 
    dogLetOuts, 
    setDogLetOuts, 
    hasDogLetOut, 
    isLoading: dogLetOutLoading 
  } = useDogLetOut(currentDate);
  
  // Use the care logs data hook for other care types - pass an empty array as fallback
  const { hasCareLogged, isLoading: careLoading } = useCareLogsData(dogsStatus || []);
  
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
    dogLetOuts, 
    setDogLetOuts, 
    onRefresh,
    activeCategory
  );
  
  // Use the refresh handler hook
  const { handleRefresh, isRefreshing } = useRefreshHandler(onRefresh || (() => {}));
  
  // Use the dog sorting hook
  const { sortedDogs } = useDogSorting(dogsStatus);
  
  // Overall loading state
  const isLoading = useMemo(() => {
    return dogLetOutLoading || careLoading || obsLoading || actionLoading || isRefreshing;
  }, [dogLetOutLoading, careLoading, obsLoading, actionLoading, isRefreshing]);
  
  return {
    timeSlots,
    currentHour,
    dogLetOuts,
    sortedDogs,
    hasDogLetOut,
    hasCareLogged,
    hasObservation,
    getObservationDetails,
    handleCellClick,
    handleRefresh,
    isLoading,
    isPendingFeeding: () => false // Always return false since we removed feeding
  };
};

export default useDogTimetable;
