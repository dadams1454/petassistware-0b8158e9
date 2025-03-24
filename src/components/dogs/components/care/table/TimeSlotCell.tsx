import React, { useState, useCallback, memo, useEffect } from 'react';
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
  const [isClicked, setIsClicked] = useState(false);

  // Reset clicked state when hasPottyBreak or hasCareLogged changes
  useEffect(() => {
    if (hasPottyBreak || hasCareLogged) {
      setIsClicked(false);
    }
  }, [hasPottyBreak, hasCareLogged]);

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
    
    // Keep visual feedback for a moment even if state doesn't change immediately
    setTimeout(() => {
      // Only reset if no success feedback has been received
      if (!hasPottyBreak && !hasCareLogged) {
        setIsClicked(false);
      }
    }, 1000);
    
    // Log the click for debugging
    console.log(`Cell clicked: ${dogName} at ${timeSlot} in ${category}`);
    
    // Call the click handler
    onClick();
    
    // Return false to also prevent any native handlers
    return false;
  }, [onClick, dogName, timeSlot, category, hasPottyBreak, hasCareLogged]);

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
        p-0 text-center h-10 transition-colors duration-300 border-r border-slate-200 dark:border-slate-700 relative
        cell-status-transition
        ${getCellColor()}
        ${isHovered ? 'bg-opacity-80 dark:bg-opacity-40' : 'bg-opacity-60 dark:bg-opacity-20'}
        ${isCurrentHour ? 'border-l-4 border-l-blue-400 dark:border-l-blue-600' : ''}
        ${isClicked ? 'scale-95 bg-blue-100 dark:bg-blue-900/20' : ''} 
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
      
      {/* Enhanced loading indicator */}
      {isClicked && !hasPottyBreak && !hasCareLogged && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-2 h-2 bg-primary/70 rounded-full animate-ping"></span>
        </span>
      )}
    </TableCell>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo - allow more re-renders for visual feedback
  return (
    prevProps.dogId === nextProps.dogId &&
    prevProps.timeSlot === nextProps.timeSlot &&
    prevProps.hasPottyBreak === nextProps.hasPottyBreak &&
    prevProps.hasCareLogged === nextProps.hasCareLogged &&
    prevProps.isCurrentHour === nextProps.isCurrentHour &&
    prevProps.isIncident === nextProps.isIncident
    // We removed the onClick and onContextMenu comparison to ensure the component rerenders
    // when these handlers change
  );
});

// Add display name for better debugging
TimeSlotCell.displayName = 'TimeSlotCell';

export default TimeSlotCell;
