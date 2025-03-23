
import { useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useCellActions } from './useCellActions';
import { useObservations } from './useObservations';

/**
 * Hook for all table interactions (cell clicks, observations, etc.)
 */
export const useTableInteractions = (
  onRefresh: () => void,
  activeCategory: string
) => {
  // Use the cell actions hook for handling cell clicks
  const { handleCellClick, isLoading } = useCellActions(onRefresh);
  
  // Use the observations hook for handling observations
  const { 
    handleObservationSubmit, 
    hasObservation, 
    getObservationDetails,
    isSubmitting 
  } = useObservations(onRefresh);
  
  // Handle cell click with the correct category
  const handleCellClickWithCategory = useCallback((
    dogId: string, 
    dogName: string, 
    timeSlot: string,
    hasPottyBreak: boolean,
    hasCareLogged: boolean
  ) => {
    handleCellClick(dogId, dogName, timeSlot, activeCategory, {
      hasPottyBreak,
      hasCareLogged
    });
  }, [handleCellClick, activeCategory]);
  
  // Handle right-click to open observation dialog
  const handleCellContextMenu = useCallback((
    e: React.MouseEvent, 
    dogId: string, 
    dogName: string, 
    timeSlot: string
  ) => {
    // Prevent default context menu
    e.preventDefault();
    
    // Custom implementation for right-click
    console.log('Right-clicked on cell for', dogName, 'at', timeSlot);
    
    // This can be used to show a context menu or open an observation dialog
  }, []);
  
  // Handle dog name click to view dog profile
  const handleDogClick = useCallback((dogId: string) => {
    console.log('Dog clicked:', dogId);
    // You can implement navigation to dog profile here
  }, []);
  
  // Handle observation submission with the correct category
  const submitObservation = useCallback((
    dogId: string,
    dogName: string,
    observation: string,
    observationType: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
    observationDate: Date
  ) => {
    return handleObservationSubmit(
      dogId, 
      dogName, 
      observation, 
      observationType, 
      observationDate, 
      activeCategory
    );
  }, [handleObservationSubmit, activeCategory]);
  
  return {
    // Cell interactions
    handleCellClick: handleCellClickWithCategory,
    handleCellContextMenu,
    handleDogClick,
    
    // Observation handling
    submitObservation,
    hasObservation,
    getObservationDetails,
    
    // Loading states
    isLoading,
    isSubmitting
  };
};
