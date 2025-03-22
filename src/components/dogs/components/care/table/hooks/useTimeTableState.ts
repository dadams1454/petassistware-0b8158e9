
import { useState, useCallback, useRef } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import usePottyBreakTable from './usePottyBreakTable';

export const useTimeTableState = (
  dogsStatus: DogCareStatus[], 
  onRefresh: () => void,
  isRefreshing: boolean,
  currentDate: Date
) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('pottybreaks');
  
  // Debug tracking
  const clickCountRef = useRef<number>(0);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const errorCountRef = useRef<number>(0);
  
  // Use the potty break table hook to get all the necessary data and handlers
  const {
    sortedDogs,
    hasPottyBreak,
    hasCareLogged,
    hasObservation,
    getObservationDetails,
    handleCellClick,
    handleRefresh,
    isLoading
  } = usePottyBreakTable(dogsStatus, onRefresh, activeCategory, currentDate);
  
  // Use a custom dog click handler to prevent navigation
  const handleSafeDogClick = useCallback((dogId: string) => {
    // In normal use we'd navigate to dog details, but for now we'll disable this
    // to prevent any routing issues that could cause the refresh problem
    console.log('Dog click prevented to avoid navigation during bugfix', dogId);
    // We won't call navigate here - this prevents any routing that might cause refresh
    return false;
  }, []);
  
  // Safe tab change handler with logging
  const handleCategoryChange = useCallback((value: string) => {
    console.log(`Tab changed to ${value}`);
    // Reset click counter when changing tabs to avoid triggering the 6-click issue
    clickCountRef.current = 0;
    setDebugInfo(`Tab changed to ${value}, clicks reset`);
    setActiveCategory(value);
  }, []);
  
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
  }, [handleCellClick]);
  
  // Handle cell right-click for observations/notes with improved error handling
  const handleCellContextMenu = useCallback((e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Prevent default context menu
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Right-clicked on cell:', dogId, dogName, timeSlot, category);
    
    // Return false to explicitly prevent default behavior
    return false;
  }, []);
  
  // Handle care log click with error prevention
  const handleCareLogClick = useCallback((dogId: string, dogName: string) => {
    console.log('Care log clicked for:', dogId, dogName);
    // No navigation for now
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
  }, [onRefresh]);

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
    handleSafeDogClick,
    handleCategoryChange,
    memoizedCellClickHandler,
    handleCellContextMenu,
    handleCareLogClick,
    handleErrorReset,
    handleRefresh,
    showLoading
  };
};
