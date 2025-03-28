
import { useCallback, useRef } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import {
  useDialogState,
  useDebugState,
  useCategoryManagement,
  useHandlers,
  useObservationHandling
} from './timeTableHooks';

export const useTimeTableState = (
  dogsStatus: DogCareStatus[], 
  onRefresh: () => void,
  isRefreshing: boolean,
  currentDate: Date,
  initialCategory: string = 'feeding'
) => {
  // Use the debug state hook
  const { clickCountRef, errorCountRef, debugInfo, setDebugInfo } = useDebugState();
  
  // Use the category management hook with initialCategory
  const { activeCategory, handleCategoryChange } = useCategoryManagement(
    setDebugInfo, 
    clickCountRef,
    initialCategory
  );
  
  // Use the dialog state hook
  const { 
    isDialogOpen, 
    setIsDialogOpen,
    observationDialogOpen, 
    setObservationDialogOpen,
    selectedDogId, 
    setSelectedDogId 
  } = useDialogState(activeCategory);

  // Generate default timeSlots
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 6; // Start at 6 AM
    const formattedHour = hour <= 12 ? hour : hour - 12;
    const ampm = hour < 12 || hour === 24 ? 'AM' : 'PM';
    return `${formattedHour}:00 ${ampm}`;
  });
  
  // Simple stub functions for the time being
  const sortedDogs = dogsStatus;
  const isLoading = isRefreshing;
  const showLoading = isRefreshing;
  
  // Stub functions for care tracking
  const hasCareLogged = useCallback((dogId: string, hour: number): boolean => {
    return false;
  }, []);
  
  const hasObservation = useCallback((dogId: string, hour: number): boolean => {
    return false;
  }, []);
  
  const getObservationDetails = useCallback((dogId: string, hour: number) => {
    return null;
  }, []);
  
  const handleCellClick = useCallback((dogId: string, hour: number) => {
    console.log(`Cell clicked: dog ${dogId}, hour ${hour}`);
  }, []);
  
  const handleCellContextMenu = useCallback((e: React.MouseEvent, dogId: string, hour: number) => {
    e.preventDefault();
    console.log(`Cell right-clicked: dog ${dogId}, hour ${hour}`);
  }, []);
  
  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);
  
  // Use the handlers hook for additional handlers
  const {
    handleDogClick,
    handleCareLogClick,
    handleObservationClick,
    memoizedCellClickHandler,
    handleErrorReset
  } = useHandlers(
    activeCategory,
    clickCountRef,
    errorCountRef,
    setDebugInfo,
    setSelectedDogId,
    setObservationDialogOpen,
    handleCellClick,
    onRefresh
  );

  // Use the observation handling hook
  const { observations, handleObservationSubmit } = useObservationHandling(
    dogsStatus, 
    activeCategory, 
    onRefresh
  );

  return {
    isDialogOpen,
    setIsDialogOpen,
    activeCategory,
    debugInfo,
    clickCountRef,
    errorCountRef,
    sortedDogs,
    hasCareLogged,
    hasObservation,
    getObservationDetails,
    handleDogClick,
    handleCategoryChange,
    memoizedCellClickHandler,
    handleCellContextMenu,
    handleCareLogClick,
    handleErrorReset,
    handleRefresh,
    showLoading,
    selectedDogId,
    setSelectedDogId,
    observationDialogOpen,
    setObservationDialogOpen,
    observations,
    handleObservationClick,
    handleObservationSubmit,
    timeSlots
  };
};
