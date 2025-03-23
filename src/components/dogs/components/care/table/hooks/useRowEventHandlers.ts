
import { useCallback, useRef } from 'react';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

interface RowEventHandlersProps {
  dogId: string;
  dogName: string;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCellContextMenu: (e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onDogClick: (dogId: string) => void;
  activeCategory: string;
}

export const useRowEventHandlers = ({
  dogId,
  dogName,
  onCellClick,
  onCellContextMenu,
  onCareLogClick,
  onDogClick,
  activeCategory
}: RowEventHandlersProps) => {
  // Track click counts for debugging
  const clickCounter = useRef<number>(0);

  // Debounced cell click handler
  const debouncedCellClick = useDebouncedCallback((id: string, name: string, timeSlot: string, category: string) => {
    // Increment the click counter for debugging
    clickCounter.current += 1;
    console.log(`Row cell click #${clickCounter.current} for ${name} at ${timeSlot} (${category}) - debounced`);
    
    // Call the parent click handler but catch any errors
    try {
      onCellClick(id, name, timeSlot, category);
    } catch (error) {
      console.error('Error in cell click handler:', error);
      // Don't rethrow to prevent refresh
    }
  }, 300);

  // Safe click handlers with improved event propagation protection
  const handleCellClickSafe = useCallback((id: string, name: string, timeSlot: string, category: string) => {
    debouncedCellClick(id, name, timeSlot, category);
  }, [debouncedCellClick]);

  // Fix the error by making this accept the event argument
  const handleCellContextMenuSafe = useCallback((e: React.MouseEvent) => {
    // Prevent default context menu and stop propagation
    e.preventDefault(); 
    e.stopPropagation();
    
    try {
      onCellContextMenu(e, dogId, dogName, e.currentTarget.getAttribute('data-time-slot') || '', activeCategory);
    } catch (error) {
      console.error('Error in context menu handler:', error);
    }
    
    return false; // Explicitly return false to prevent bubbling
  }, [onCellContextMenu, dogId, dogName, activeCategory]);
  
  // Debounced dog click handler
  const debouncedDogClick = useDebouncedCallback((id: string) => {
    try {
      onDogClick(id);
    } catch (error) {
      console.error('Error in dog click handler:', error);
    }
  }, 300);
  
  // Handle dog name click with improved event handling
  const handleDogCellClick = useCallback((e: React.MouseEvent) => {
    // Stop propagation but don't prevent default to allow navigation
    e.stopPropagation();
    
    console.log(`Dog name cell clicked for ${dogName} (${dogId})`);
    debouncedDogClick(dogId);
  }, [dogId, dogName, debouncedDogClick]);
  
  // Debounced care log click handler
  const debouncedCareLogClick = useDebouncedCallback((id: string, name: string) => {
    try {
      // Call with both parameters
      onCareLogClick(id, name);
    } catch (error) {
      console.error('Error in care log click handler:', error);
    }
  }, 300);
  
  // Handle care log click with improved event handling
  const handleCareLogCellClick = useCallback((e: React.MouseEvent) => {
    // Stop propagation and prevent default to ensure the button click works correctly
    e.stopPropagation();
    e.preventDefault();
    
    console.log(`🔥 Care log cell clicked for ${dogName} (${dogId})`);
    debouncedCareLogClick(dogId, dogName);
  }, [dogId, dogName, debouncedCareLogClick]);
  
  return {
    handleCellClickSafe,
    handleCellContextMenuSafe,
    handleDogCellClick,
    handleCareLogCellClick,
    clickCounter
  };
};
