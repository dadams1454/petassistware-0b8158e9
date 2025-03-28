
import React, { useState, useCallback, memo } from 'react';
import { TableCell } from '@/components/ui/table';

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

  // Get the base color for the cell
  const getCellColor = useCallback(() => {
    if (isIncident) return 'bg-amber-100 dark:bg-amber-950/20';
    if (hasPottyBreak || hasCareLogged) return 'bg-green-100 dark:bg-green-900/30';
    if (isCurrentHour) return 'bg-blue-50 dark:bg-blue-900/10';
    return '';
  }, [hasPottyBreak, hasCareLogged, isCurrentHour, isIncident]);

  // Handle cell click with improved event prevention
  const handleCellClick = useCallback((e: React.MouseEvent) => {
    // Completely stop event propagation and default behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Track click for debugging
    console.log(`Cell click handled for ${dogName} at ${timeSlot}`);
    
    // Call the click handler
    onClick();
    
    // Return false to also prevent any native handlers
    return false;
  }, [onClick, dogName, timeSlot]);

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

  // Render the content of the cell
  const cellContent = hasPottyBreak || hasCareLogged 
    ? '✓' 
    : isHovered 
      ? '+'
      : '';

  return (
    <TableCell
      key={`${dogId}-${timeSlot}`}
      className={`
        p-0 text-center h-10 transition-all duration-200 border-r border-slate-200 dark:border-slate-700 relative
        cell-status-transition
        ${getCellColor()}
        ${isHovered ? 'bg-opacity-80 dark:bg-opacity-40' : 'bg-opacity-60 dark:bg-opacity-20'}
        ${isCurrentHour ? 'border-l-4 border-l-blue-400 dark:border-l-blue-600' : ''}
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
      {isIncident ? (
        <span className="text-amber-600 dark:text-amber-400 font-bold">!</span>
      ) : (
        <span className={`
          transition-opacity duration-200
          ${hasPottyBreak || hasCareLogged ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-400 opacity-40'}
          ${isHovered ? 'opacity-100' : ''}
        `}>
          {cellContent}
        </span>
      )}
    </TableCell>
  );
});

// Add display name for better debugging
TimeSlotCell.displayName = 'TimeSlotCell';

export default TimeSlotCell;
