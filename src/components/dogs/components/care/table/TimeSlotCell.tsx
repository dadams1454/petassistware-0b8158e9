
import React, { useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { useCellStyles } from './components/useCellStyles';
import CellBackground from './components/cell/CellBackground';
import AnimatedCellContent from './components/cell/AnimatedCellContent';
import { useTouchHandler } from './components/cell/TouchHandler';
import { TimeSlotCellProps } from './components/cell/types';

/**
 * Represents a single cell in the dog care time table
 */
const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
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
  const [isHovered, setIsHovered] = useState(false);

  // Get touch handler for mobile interactions
  const { 
    handleTouchStart, 
    handleTouchEnd, 
    handleTouchMove 
  } = useTouchHandler(onContextMenu);

  // Combined active state (from props or hover)
  const isCellActive = isActive || isHovered;

  return (
    <TableCell 
      className="relative p-0 h-14 border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      data-dogid={dogId}
      data-timeslot={timeSlot}
    >
      {/* Cell Background */}
      <CellBackground 
        dogId={dogId}
        category={category}
        isActive={isCellActive}
        isIncident={isIncident}
        isCurrentHour={isCurrentHour}
        hasCareLogged={hasCareLogged}
      />

      {/* Cell Content with Animation */}
      <AnimatedCellContent
        dogName={dogName}
        timeSlot={timeSlot}
        category={category}
        hasPottyBreak={hasPottyBreak}
        hasCareLogged={hasCareLogged}
        isActive={isCellActive}
        isCurrentHour={isCurrentHour}
        isIncident={isIncident}
      />
    </TableCell>
  );
};

export default TimeSlotCell;
