
import React, { useState, useCallback, memo } from 'react';
import { TableCell } from '@/components/ui/table';
import CellContent from './CellContent';

interface TimeSlotCellProps {
  dogId: string;
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  flags?: string[];
  isCurrentHour?: boolean;
  isIncident?: boolean;
}

// Use memo to prevent unnecessary re-renders
const TimeSlotCell = memo(({
  dogId,
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  hasCareLogged,
  onClick,
  onContextMenu,
  flags = [],
  isCurrentHour = false,
  isIncident = false
}: TimeSlotCellProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Get the base color for the cell
  const getCellColor = useCallback(() => {
    if (isIncident) return 'bg-amber-100 dark:bg-amber-950/20';
    if (hasPottyBreak || hasCareLogged) return 'bg-green-100 dark:bg-green-900/30';
    if (isCurrentHour) return 'bg-blue-50 dark:bg-blue-900/10';
    return '';
  }, [hasPottyBreak, hasCareLogged, isCurrentHour, isIncident]);

  // Handle cell click with improved event prevention and a visual feedback
  const handleCellClick = useCallback((e: React.MouseEvent) => {
    // Completely stop event propagation and default behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Show immediate visual feedback
    setIsClicked(true);
    
    // Call the click handler
    onClick();
    
    // Reset the clicked state after a delay to show the animation
    setTimeout(() => setIsClicked(false), 1500);
    
    // Return false to also prevent any native handlers
    return false;
  }, [onClick]);

  // Handle context menu with improved event prevention
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Completely stop event propagation and default behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Call the context menu handler
    onContextMenu(e);
    
    // Return false to also prevent any native handlers
    return false;
  }, [onContextMenu]);

  return (
    <TableCell
      key={`${dogId}-${timeSlot}`}
      className={`
        p-0 text-center h-10 transition-all duration-100 border-r border-slate-200 dark:border-slate-700 relative
        cell-status-transition
        ${getCellColor()}
        ${isHovered ? 'bg-opacity-80 dark:bg-opacity-40' : 'bg-opacity-60 dark:bg-opacity-20'}
        ${isCurrentHour ? 'border-l-4 border-l-blue-400 dark:border-l-blue-600' : ''}
        ${isClicked ? 'scale-95' : ''} 
        cursor-pointer select-none
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCellClick}
      onContextMenu={handleContextMenu}
      data-dog-id={dogId}
      data-time-slot={timeSlot}
      data-has-care={hasCareLogged ? 'true' : 'false'}
      data-category={category}
    >
      <CellContent 
        dogName={dogName}
        timeSlot={timeSlot}
        category={category}
        hasPottyBreak={hasPottyBreak}
        hasCareLogged={hasCareLogged}
        isCurrentHour={isCurrentHour}
        isIncident={isIncident}
        isClicked={isClicked && !hasCareLogged && !hasPottyBreak}
      />
    </TableCell>
  );
});

// Add display name for better debugging
TimeSlotCell.displayName = 'TimeSlotCell';

export default TimeSlotCell;
