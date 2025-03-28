
import { useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import usePottyBreakTable from './usePottyBreakTable';
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
  initialCategory: string = 'feeding'  // Default is now feeding
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
  
  // Use the potty break table hook to get all the necessary data and handlers
  const {
    sortedDogs,
    hasPottyBreak,
    hasCareLogged,
    hasObservation,
    getObservationDetails,
    handleCellClick,
    handleRefresh,
    isLoading,
    timeSlots
  } = usePottyBreakTable(dogsStatus, onRefresh, activeCategory, currentDate);
  
  // Use the observation handling hook
  const { observations, handleObservationSubmit } = useObservationHandling(
    dogsStatus, 
    activeCategory, 
    onRefresh
  );
  
  // Use the handlers hook
  const {
    handleDogClick,
    handleCareLogClick,
    handleObservationClick,
    memoizedCellClickHandler,
    handleCellContextMenu,
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

  // Combine loading states
  const showLoading = isRefreshing || isLoading;

  return {
    isDialogOpen,
    setIsDialogOpen,
    activeCategory,
    debugInfo,
    clickCountRef,
    errorCountRef,
    sortedDogs,
    hasPottyBreak,
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
