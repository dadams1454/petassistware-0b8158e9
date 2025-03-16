
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
  // This ensures special attention flags only appear in the dog name cell
  const cellFlags = flags.filter(flag => flag.type !== 'special_attention');

  // Get cell styles for this particular cell
  const { cellClassNames, isPottyCategory } = useCellStyles({
    category,
    hasPottyBreak,
    hasCareLogged,
    flags: cellFlags
  });
  
  // Debug info for identifying missed renders
  const cellIdentifier = `${dogId}-${timeSlot}-${category}`;
  
  return (
    <TableCell 
      key={cellIdentifier}
      className={`${cellClassNames} cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700`}
      onClick={() => {
        console.log(`Clicked cell: ${cellIdentifier}`);
        onClick();
      }}
      title={`${dogName} - ${timeSlot} - ${category}`}
      data-cell-id={cellIdentifier}
    >
      <CellContent 
        dogName={dogName}
        timeSlot={timeSlot}
        category={category}
        hasPottyBreak={hasPottyBreak}
        hasCareLogged={hasCareLogged}
        flags={cellFlags}
      />
    </TableCell>
  );
};

export default TimeSlotCell;
