
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to manage click handlers for the time table
 */
export const useHandlers = (
  activeCategory: string,
  clickCountRef: React.MutableRefObject<number>,
  errorCountRef: React.MutableRefObject<number>,
  setDebugInfo: (info: string) => void,
  setSelectedDogId: (id: string | null) => void,
  setObservationDialogOpen: (open: boolean) => void,
  handleCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void,
  onRefresh: () => void
) => {
  const navigate = useNavigate();

  // Navigation handler for dog clicks
  const handleDogClick = useCallback((dogId: string) => {
    console.log('Navigating to dog details:', dogId);
    navigate(`/dogs/${dogId}`);
  }, [navigate]);

  // Handler for care log clicks
  const handleCareLogClick = useCallback((dogId: string, dogName: string) => {
    console.log(`🚨 Care log click for ${dogName} (${dogId}) in category ${activeCategory}`);
    
    // Update debug info
    setDebugInfo(`Care log clicked for ${dogName}`);
    
    // Set the selected dog ID 
    setSelectedDogId(dogId);
    
    console.log(`Selected dog set to ${dogId}, dialog will open via LogCareButton effect`);
  }, [activeCategory, setDebugInfo, setSelectedDogId]);

  // Handler for observation clicks
  const handleObservationClick = useCallback((dogId: string, dogName: string) => {
    console.log(`🔍 Observation click for ${dogName} (${dogId}) in category ${activeCategory}`);
    
    // Set the selected dog ID
    setSelectedDogId(dogId);
    
    // Open the observation dialog
    setObservationDialogOpen(true);
    
    // Update debug info
    setDebugInfo(`Observation dialog opened for ${dogName}`);
  }, [activeCategory, setSelectedDogId, setObservationDialogOpen, setDebugInfo]);

  // Create a stable cell click handler with enhanced error prevention
  const memoizedCellClickHandler = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Increment click count
    clickCountRef.current += 1;
    const clickNumber = clickCountRef.current;
    
    // Log debug info
    console.log(`Cell clicked: ${clickNumber} times (${dogName}, ${timeSlot}, ${category})`);
    setDebugInfo(`Last click: ${dogName} at ${timeSlot} (Click #${clickNumber})`);
    
    // Extra protection for the 6th click
    if (clickNumber >= 5) {
      console.log(`⚠️ CRITICAL: Click #${clickNumber} - applying extra protections`);
    }
    
    // Wrap in try-catch to prevent errors from bubbling up
    try {
      handleCellClick(dogId, dogName, timeSlot, category);
    } catch (error) {
      // Increment error count
      errorCountRef.current += 1;
      console.error(`Error #${errorCountRef.current} in cell click handler:`, error);
      
      // Still update the debug info to show error occurred
      setDebugInfo(`Error on click #${clickNumber} for ${dogName} (${errorCountRef.current} errors total)`);
    }
    
    // Return false to prevent default behavior
    return false;
  }, [handleCellClick, clickCountRef, errorCountRef, setDebugInfo]);

  // Handle cell right-click for observations/notes with improved error handling
  const handleCellContextMenu = useCallback((e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Prevent default context menu
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Right-clicked on cell:', dogId, dogName, timeSlot, category);
    
    // Return false to explicitly prevent default behavior
    return false;
  }, []);
  
  // Error reset handler with improved debugging
  const handleErrorReset = useCallback(() => {
    console.log("Resetting after error");
    // Reset click counter
    clickCountRef.current = 0;
    setDebugInfo('Clicks reset after error');
    
    // Log error count
    console.log(`Total errors before reset: ${errorCountRef.current}`);
    errorCountRef.current = 0;
    
    // Call refresh with a small delay to prevent immediate errors
    setTimeout(() => {
      onRefresh();
    }, 100);
  }, [onRefresh, clickCountRef, errorCountRef, setDebugInfo]);

  return {
    handleDogClick,
    handleCareLogClick,
    handleObservationClick,
    memoizedCellClickHandler,
    handleCellContextMenu,
    handleErrorReset
  };
};
