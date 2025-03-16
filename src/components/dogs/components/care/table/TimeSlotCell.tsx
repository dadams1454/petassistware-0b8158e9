
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
  onClick: () => void;
  flags?: DogFlag[];
}

const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
  dogId,
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  onClick,
  flags = []
}) => {
  const { cellClassNames, isPottyCategory } = useCellStyles({
    category,
    hasPottyBreak,
    flags
  });
  
  return (
    <TableCell 
      className={cellClassNames}
      onClick={isPottyCategory ? onClick : undefined}
    >
      <CellContent 
        dogName={dogName}
        timeSlot={timeSlot}
        category={category}
        hasPottyBreak={hasPottyBreak}
        flags={flags}
      />
    </TableCell>
  );
};

export default TimeSlotCell;
