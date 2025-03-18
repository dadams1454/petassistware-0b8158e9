
import React from 'react';
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
}

const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
  dogId,
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  hasCareLogged,
  onClick,
  flags = []
}) => {
  // Filter out special_attention flags for cell styling
  const cellFlags = flags.filter(flag => flag.type !== 'special_attention');

  // Get cell styles for this particular cell
  const { cellClassNames } = useCellStyles({
    category,
    hasPottyBreak,
    hasCareLogged,
    flags: cellFlags
  });
  
  const cellIdentifier = `${dogId}-${timeSlot}-${category}`;
  
  return (
    <TableCell 
      key={cellIdentifier}
      className={`${cellClassNames} cursor-pointer border border-slate-200 dark:border-slate-700 p-0 overflow-hidden transition-all duration-200 ${
        hasPottyBreak 
          ? 'bg-green-100 dark:bg-green-900/30' 
          : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
      }`}
      onClick={onClick}
      title={`${dogName} - ${timeSlot}`}
      data-cell-id={cellIdentifier}
    >
      <div className="w-full h-full p-1">
        <CellContent 
          dogName={dogName}
          timeSlot={timeSlot}
          category={category}
          hasPottyBreak={hasPottyBreak}
          hasCareLogged={hasCareLogged}
          flags={cellFlags}
        />
      </div>
    </TableCell>
  );
};

export default TimeSlotCell;
