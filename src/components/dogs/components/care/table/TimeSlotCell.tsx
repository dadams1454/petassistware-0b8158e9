
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
      className={`${cellClassNames} cursor-pointer`}
      onClick={onClick}
      title={`${dogName} - ${timeSlot}`}
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
