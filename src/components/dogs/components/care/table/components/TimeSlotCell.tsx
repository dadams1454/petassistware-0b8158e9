
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TimeSlotCellProps {
  timeSlot: string;
  dogId: string;
  dogName: string;
  activeCategory: string;
  onClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onContextMenu?: (e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string) => void;
  hasCareLogged: boolean;
  hasPottyBreak: boolean;
  hasObservation: boolean;
  isCurrentHour?: boolean;
  children?: React.ReactNode;
}

const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
  timeSlot,
  dogId,
  dogName,
  activeCategory,
  onClick,
  onContextMenu,
  hasCareLogged,
  hasPottyBreak,
  hasObservation,
  isCurrentHour = false,
  children
}) => {
  // Add local click state for immediate visual feedback
  const [isClicked, setIsClicked] = useState(false);
  
  // Reset click state when props change
  useEffect(() => {
    setIsClicked(hasCareLogged);
  }, [hasCareLogged, dogId, timeSlot, activeCategory]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Set local clicked state for immediate feedback
    setIsClicked(true);
    // Call the actual click handler
    onClick(dogId, dogName, timeSlot, activeCategory);
    
    // For debugging
    console.log(`Cell clicked: ${dogName} at ${timeSlot} for ${activeCategory} - Setting visual state to clicked`);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContextMenu) {
      onContextMenu(e, dogId, dogName, timeSlot, activeCategory);
    }
  };

  const baseClasses = "relative h-10 border-r border-b p-0 text-center transition-colors";
  
  // Enhanced visual feedback including local click state
  const cellClasses = cn(
    baseClasses,
    {
      "bg-green-100 dark:bg-green-900/20": hasPottyBreak,
      "bg-blue-50 dark:bg-blue-900/20": hasCareLogged && !hasPottyBreak,
      "bg-yellow-50 dark:bg-yellow-900/20": hasObservation && !hasCareLogged && !hasPottyBreak,
      "border-l-4 border-l-primary": isCurrentHour,
      // Add visual feedback for clicked state
      "ring-2 ring-inset ring-primary": isClicked && !hasCareLogged,
      "animate-pulse bg-primary/10": isClicked && !hasCareLogged
    }
  );

  return (
    <td 
      className={cellClasses}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      data-dog-id={dogId}
      data-time-slot={timeSlot}
      data-category={activeCategory}
      aria-label={`${dogName} ${timeSlot} ${activeCategory}`}
      role="gridcell"
    >
      {children}
    </td>
  );
};

export default TimeSlotCell;
