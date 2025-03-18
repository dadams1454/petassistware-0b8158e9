
import { useState, useRef, useEffect } from 'react';

export const useCellInteractions = () => {
  // State for UI interactions
  const [observationDialogOpen, setObservationDialogOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  // Refs for touch handling
  const cellRef = useRef<HTMLTableCellElement>(null);
  
  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      // Any cleanup needed
    };
  }, []);
  
  // Handle right-click to open observation dialog
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setObservationDialogOpen(true);
  };
  
  // Handle the observation icon click
  const handleObservationIconClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the cell click handler
    setObservationDialogOpen(true);
    
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };
  
  return {
    observationDialogOpen,
    setObservationDialogOpen,
    contextMenuOpen,
    setContextMenuOpen,
    popoverOpen,
    setPopoverOpen,
    cellRef,
    handleContextMenu,
    handleObservationIconClick
  };
};
