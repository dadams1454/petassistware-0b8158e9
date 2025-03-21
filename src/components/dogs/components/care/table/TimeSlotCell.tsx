
import React, { memo, useRef } from 'react';
import { TableCell } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { TimeSlotCellProps } from './components/cell/types';
import { useCellStyles } from './components/useCellStyles';
import { CellBackground } from './components/cell/CellBackground';
import { useTouchHandler } from './components/cell/TouchHandler';
import AnimatedCellContent from './components/cell/AnimatedCellContent';

// Use memo to prevent unnecessary re-renders that could cause flag flickering
const TimeSlotCell: React.FC<TimeSlotCellProps> = memo(({
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
  isIncident = false,
  isActive = false
}) => {
  // Create a stable copy of flags to prevent reference issues
  const dogFlags = [...flags];
  
  // Cell reference for DOM operations
  const cellRef = useRef<HTMLTableCellElement>(null);
  
  // Check if we're on a mobile device
  const isMobile = useIsMobile();
  
  // Get cell styling based on state
  const { cellClassNames } = useCellStyles({
    category,
    hasPottyBreak,
    hasCareLogged,
    flags: dogFlags
  });
  
  // Get touch event handlers
  const { 
    handleTouchStart, 
    handleTouchEnd, 
    handleTouchMove 
  } = useTouchHandler(onContextMenu);
  
  // Get background styling
  const { bgColorClass, borderColorClass } = CellBackground({
    dogId,
    category,
    isActive,
    isIncident,
    isCurrentHour,
    hasCareLogged
  });
  
  // Create a unique cell identifier for debugging and data attributes
  const cellIdentifier = `${dogId}-${timeSlot}-${category}`;
  
  // Determine if cell should be considered active for animation
  const isAnimatedActive = hasPottyBreak || hasCareLogged || isActive;
  
  return (
    <TableCell 
      ref={cellRef}
      key={cellIdentifier}
      className={`${cellClassNames} cursor-pointer border border-slate-200 dark:border-slate-700 p-0 overflow-hidden transition-all duration-200 relative ${
        bgColorClass
      } ${
        borderColorClass
      } touch-manipulation`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      title={`${dogName} - ${timeSlot}${isIncident ? ' (Incident reported)' : ''}${isCurrentHour ? ' (Current hour)' : ''}`}
      data-cell-id={cellIdentifier}
      data-dog-id={dogId}
      data-flags-count={dogFlags.length}
      data-is-current-hour={isCurrentHour ? 'true' : 'false'}
      data-is-incident={isIncident ? 'true' : 'false'}
      data-mobile-cell={isMobile ? "true" : "false"}
      data-category={category}
      data-active={isAnimatedActive ? "true" : "false"}
    >
      <AnimatedCellContent 
        dogName={dogName}
        timeSlot={timeSlot}
        category={category}
        hasPottyBreak={hasPottyBreak}
        hasCareLogged={hasCareLogged}
        isActive={isAnimatedActive}
        isCurrentHour={isCurrentHour}
        isIncident={isIncident}
      />
    </TableCell>
  );
});

// Add display name for better debugging
TimeSlotCell.displayName = 'TimeSlotCell';

export default TimeSlotCell;
