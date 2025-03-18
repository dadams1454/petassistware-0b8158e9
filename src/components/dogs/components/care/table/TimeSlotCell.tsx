
import React, { memo } from 'react';
import { TableCell } from '@/components/ui/table';
import { DogFlag } from '@/types/dailyCare';
import CellContent from './components/CellContent';
import { useCellStyles } from './components/useCellStyles';

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
  isCurrentHour = false
}) => {
  // Create a stable copy of flags to prevent reference issues
  // This helps ensure each dog's flags stay with that dog
  const dogFlags = [...flags];
  
  const { cellClassNames } = useCellStyles({
    category,
    hasPottyBreak,
    hasCareLogged,
    flags: dogFlags
  });
  
  const cellIdentifier = `${dogId}-${timeSlot}-${category}`;
  
  return (
    <TableCell 
      key={cellIdentifier}
      className={`${cellClassNames} cursor-pointer border border-slate-200 dark:border-slate-700 p-0 overflow-hidden transition-all duration-200 ${
        hasPottyBreak 
          ? 'bg-green-100 dark:bg-green-900/30' 
          : isCurrentHour
            ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20'
            : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
      } ${
        isCurrentHour ? 'border-l-2 border-r-2 border-blue-400 dark:border-blue-600' : ''
      }`}
      onClick={onClick}
      title={`${dogName} - ${timeSlot}${isCurrentHour ? ' (Current hour)' : ''}`}
      data-cell-id={cellIdentifier}
      data-dog-id={dogId}
      data-flags-count={dogFlags.length}
      data-is-current-hour={isCurrentHour ? 'true' : 'false'}
    >
      <div className="w-full h-full p-1">
        <CellContent 
          dogName={dogName}
          timeSlot={timeSlot}
          category={category}
          hasPottyBreak={hasPottyBreak}
          hasCareLogged={hasCareLogged}
          flags={dogFlags}
          isCurrentHour={isCurrentHour}
        />
      </div>
    </TableCell>
  );
});

// Add display name for better debugging
TimeSlotCell.displayName = 'TimeSlotCell';

export default TimeSlotCell;
