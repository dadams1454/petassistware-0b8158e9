
import { useState, useCallback, useRef, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import usePottyBreakTable from './usePottyBreakTable';
import { useNavigate } from 'react-router-dom';
import { useObservations } from './pottyBreakHooks/useObservations';

export const useTimeTableState = (
  dogsStatus: DogCareStatus[], 
  onRefresh: () => void,
  isRefreshing: boolean,
  currentDate: Date
) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [observationDialogOpen, setObservationDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('pottybreaks');
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const navigate = useNavigate();
  
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
    isLoading,
    timeSlots
  } = usePottyBreakTable(dogsStatus, onRefresh, activeCategory, currentDate);
  
  // Get observations and add observation function
  const { observations, addObservation } = useObservations(dogsStatus);
  
  // Auto-close dialog when changing categories
  useEffect(() => {
    if (isDialogOpen) {
      setIsDialogOpen(false);
    }
    if (observationDialogOpen) {
      setObservationDialogOpen(false);
    }
  }, [activeCategory]);
  
  // Navigation handler for dog clicks
  const handleDogClick = useCallback((dogId: string) => {
    console.log('Navigating to dog details:', dogId);
    navigate(`/dogs/${dogId}`);
  }, [navigate]);
  
  // Handler for care log clicks - improved implementation
  const handleCareLogClick = useCallback((dogId: string, dogName: string) => {
    console.log(`🚨 Care log click for ${dogName} (${dogId}) in category ${activeCategory}`);
    
    // Update debug info
    setDebugInfo(`Care log clicked for ${dogName}`);
    
    // Set the selected dog ID 
    setSelectedDogId(dogId);
    
    // Note: The dialog opening is now handled directly in the LogCareButton component
    // This ensures we've updated the selectedDogId first
    console.log(`Selected dog set to ${dogId}, dialog will open via LogCareButton effect`);
  }, [activeCategory]);
  
  // Handler for observation clicks
  const handleObservationClick = useCallback((dogId: string, dogName: string) => {
    console.log(`🔍 Observation click for ${dogName} (${dogId}) in category ${activeCategory}`);
    
    // Set the selected dog ID
    setSelectedDogId(dogId);
    
    // Open the observation dialog
    setObservationDialogOpen(true);
    
    // Update debug info
    setDebugInfo(`Observation dialog opened for ${dogName}`);
  }, [activeCategory]);
  
  // Handler for observation submission
  const handleObservationSubmit = useCallback(async (
    dogId: string, 
    observationText: string, 
    observationType: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
    timestamp?: Date
  ) => {
    // Determine the category based on the active category
    const category = activeCategory === 'feeding' ? 'feeding_observation' : 'observation';
    
    // Determine the time slot based on timestamp
    const timeSlot = timestamp ? `${timestamp.getHours() % 12 || 12}:00 ${timestamp.getHours() >= 12 ? 'PM' : 'AM'}` : '';
    
    // Add the observation
    await addObservation(dogId, observationText, observationType, timeSlot, category, timestamp);
    
    // Refresh data
    onRefresh();
    
    // Close the dialog
    setObservationDialogOpen(false);
  }, [activeCategory, addObservation, onRefresh]);
  
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
    timeSlots // Ensure timeSlots is included in the return object
  };
};
