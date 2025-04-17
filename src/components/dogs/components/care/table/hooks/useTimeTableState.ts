
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
  const pottyBreakData = usePottyBreakTable(dogsStatus, onRefresh, activeCategory, currentDate);
  
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
    pottyBreakData.handleCellClick,
    onRefresh
  );

  // Combine loading states
  const showLoading = isRefreshing || pottyBreakData.loading;

  // Mocked properties that are missing
  const sortedDogs = dogsStatus;
  const hasPottyBreak = (dogId: string, timeSlot: string) => pottyBreakData.hasCareLogged(dogId, timeSlot, 'pottybreaks');
  const hasCareLogged = pottyBreakData.hasCareLogged;
  const hasObservation = (dogId: string, timeSlot: string) => false; // Mock implementation
  const getObservationDetails = (dogId: string, timeSlot: string) => ({}); // Mock implementation
  const handleRefresh = onRefresh;
  const isLoading = pottyBreakData.loading || false;
  
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
    timeSlots: pottyBreakData.timeSlots,
    isLoading
  };
};
