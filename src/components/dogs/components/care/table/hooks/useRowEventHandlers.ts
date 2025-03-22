
import { useCallback, useRef } from 'react';

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

  // Safe click handlers with improved event propagation protection
  const handleCellClickSafe = useCallback((id: string, name: string, timeSlot: string, category: string) => {
    // Increment the click counter for debugging
    clickCounter.current += 1;
    console.log(`Row cell click #${clickCounter.current} for ${name} at ${timeSlot} (${category})`);
    
    // Call the parent click handler but catch any errors
    try {
      onCellClick(id, name, timeSlot, category);
    } catch (error) {
      console.error('Error in cell click handler:', error);
      // Don't rethrow to prevent refresh
    }
  }, [onCellClick]);

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
  
  // Handle dog name click with improved event handling
  const handleDogCellClick = useCallback(() => {
    console.log(`Dog name cell clicked for ${dogName} (${dogId})`);
    
    try {
      onDogClick(dogId);
    } catch (error) {
      console.error('Error in dog click handler:', error);
    }
  }, [dogId, dogName, onDogClick]);
  
  // Handle care log click with improved event handling
  const handleCareLogCellClick = useCallback(() => {
    console.log(`Care log cell clicked for ${dogName} (${dogId})`);
    
    try {
      onCareLogClick(dogId, dogName);
    } catch (error) {
      console.error('Error in care log click handler:', error);
    }
  }, [dogId, dogName, onCareLogClick]);
  
  return {
    handleCellClickSafe,
    handleCellContextMenuSafe,
    handleDogCellClick,
    handleCareLogCellClick,
    clickCounter
  };
};
