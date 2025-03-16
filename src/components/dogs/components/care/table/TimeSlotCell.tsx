
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
  // Filter out special_attention flags for cell styling
  // This ensures special attention flags only appear in the dog name cell
  const cellFlags = flags.filter(flag => flag.type !== 'special_attention');
  
  const { cellClassNames, isPottyCategory } = useCellStyles({
    category,
    hasPottyBreak,
    flags: cellFlags
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
        flags={cellFlags} // Pass only the filtered flags
      />
    </TableCell>
  );
};

export default TimeSlotCell;
