
import { useCallback } from 'react';
import { MutableRefObject } from 'react';

// Define the hook interface
export const useHandlers = (
  activeCategory: string,
  clickCountRef: MutableRefObject<number>,
  errorCountRef: MutableRefObject<number>,
  setDebugInfo: (info: any) => void,
  setSelectedDogId: (id: string | null) => void,
  setObservationDialogOpen: (open: boolean) => void,
  handleCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void,
  onRefresh: () => void
) => {
  // Handle dog name click
  const handleDogClick = useCallback((dogId: string) => {
    setDebugInfo(prev => ({
      ...prev,
      lastAction: `Dog clicked: ${dogId}`
    }));
    
    // For now, we'll do nothing when dog name is clicked
    console.log(`Dog clicked: ${dogId}`);
  }, [setDebugInfo]);

  // Handle care log click 
  const handleCareLogClick = useCallback((dogId: string, dogName: string) => {
    setDebugInfo(prev => ({
      ...prev,
      lastAction: `Care log clicked: ${dogId}, ${dogName}`
    }));
    
    console.log(`Care log clicked: ${dogId}, ${dogName}`);
    // No implementation needed after potty breaks removal
  }, [setDebugInfo]);
  
  // Handle observation click
  const handleObservationClick = useCallback((dogId: string, dogName: string) => {
    setDebugInfo(prev => ({
      ...prev,
      lastAction: `Observation clicked: ${dogId}, ${dogName}`
    }));
    
    setSelectedDogId(dogId);
    setObservationDialogOpen(true);
  }, [setDebugInfo, setSelectedDogId, setObservationDialogOpen]);
  
  // Memoized cell click handler (avoids recreating function for each cell)
  const memoizedCellClickHandler = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    handleCellClick(dogId, dogName, timeSlot, category);
  }, [handleCellClick]);
  
  // Handle cell context menu (right click)
  const handleCellContextMenu = useCallback((e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string) => {
    e.preventDefault();
    
    setDebugInfo(prev => ({
      ...prev,
      lastAction: `Cell right-clicked: ${dogId}, ${timeSlot}, ${category}`
    }));
    
    // For now, we'll just log the action
    console.log(`Cell right-clicked: ${dogId}, ${dogName}, ${timeSlot}, ${category}`);
  }, [setDebugInfo]);
  
  // Handle error reset for ErrorBoundary
  const handleErrorReset = useCallback(() => {
    console.log('Error boundary reset');
    errorCountRef.current += 1;
    // Reset any error state and try to refresh
    onRefresh();
  }, [errorCountRef, onRefresh]);

  return {
    handleDogClick,
    handleCareLogClick,
    handleObservationClick,
    memoizedCellClickHandler,
    handleCellContextMenu,
    handleErrorReset
  };
};
