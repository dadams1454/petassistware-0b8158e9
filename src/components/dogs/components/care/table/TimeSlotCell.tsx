
import React, { memo, useRef, useEffect } from 'react';
import { TableCell } from '@/components/ui/table';
import { DogFlag } from '@/types/dailyCare';
import CellContent from './components/CellContent';
import { useCellStyles } from './components/useCellStyles';
import { useIsMobile } from '@/hooks/use-mobile';

interface TimeSlotCellProps {
  dogId: string;
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  onClick: () => void;
  flags?: DogFlag[];
  isCurrentHour?: boolean;
  isIncident?: boolean;
}

// Use memo to prevent unnecessary re-renders that could cause flag flickering
const TimeSlotCell: React.FC<TimeSlotCellProps> = memo(({
  dogId,
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  hasCareLogged,
  onClick,
  flags = [],
  isCurrentHour = false,
  isIncident = false
}) => {
  // Create a stable copy of flags to prevent reference issues
  // This helps ensure each dog's flags stay with that dog
  const dogFlags = [...flags];
  
  // Refs for touch handling
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const cellRef = useRef<HTMLTableCellElement>(null);
  const isTouchActiveRef = useRef<boolean>(false);
  
  // Check if we're on a mobile device
  const isMobile = useIsMobile();
  
  const { cellClassNames } = useCellStyles({
    category,
    hasPottyBreak,
    hasCareLogged,
    flags: dogFlags
  });
  
  const cellIdentifier = `${dogId}-${timeSlot}-${category}`;
  
  // Touch event handlers for quick click
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartTimeRef.current = Date.now();
    isTouchActiveRef.current = true;
  };
  
  const handleTouchEnd = () => {
    isTouchActiveRef.current = false;
  };
  
  const handleTouchMove = () => {
    isTouchActiveRef.current = false;
  };
  
  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <TableCell 
      ref={cellRef}
      key={cellIdentifier}
      className={`${cellClassNames} cursor-pointer border border-slate-200 dark:border-slate-700 p-0 overflow-hidden transition-all duration-200 relative ${
        isIncident
          ? 'bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20'
          : hasPottyBreak 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : isCurrentHour
              ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20'
              : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
      } ${
        isCurrentHour ? 'border-l-2 border-r-2 border-blue-400 dark:border-blue-600' : ''
      } ${
        isIncident ? 'border-l-2 border-r-2 border-red-400 dark:border-red-600' : ''
      } touch-manipulation`}
      onClick={onClick}
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
    >
      <div className="w-full h-full p-1 flex items-center justify-center">
        <CellContent 
          dogName={dogName}
          timeSlot={timeSlot}
          category={category}
          hasPottyBreak={hasPottyBreak}
          hasCareLogged={hasCareLogged}
          isCurrentHour={isCurrentHour}
          isIncident={isIncident}
        />
      </div>
    </TableCell>
  );
});

// Add display name for better debugging
TimeSlotCell.displayName = 'TimeSlotCell';

export default TimeSlotCell;
