
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

  // Handle cell click with visual feedback
  const handleCellClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Show click animation
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    
    onClick();
    return false;
  }, [onClick]);

  // Handle context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e);
    return false;
  }, [onContextMenu]);

  return (
    <TableCell
      key={`${dogId}-${timeSlot}`}
      className={`
        p-0 text-center h-10 transition-all duration-100 border-r border-slate-200 dark:border-slate-700 relative
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
      data-has-care={hasCareLogged || hasPottyBreak ? 'true' : 'false'}
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
      />
      
      {/* Show "+" indicator when hovering on empty cell */}
      {isHovered && !hasPottyBreak && !hasCareLogged && !isIncident && (
        <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-opacity-70">
          +
        </span>
      )}
      
      {/* Loading indicator for clicked cells */}
      {isClicked && !hasPottyBreak && !hasCareLogged && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-ping"></span>
        </span>
      )}
    </TableCell>
  );
});

// Add display name for better debugging
TimeSlotCell.displayName = 'TimeSlotCell';

export default TimeSlotCell;
