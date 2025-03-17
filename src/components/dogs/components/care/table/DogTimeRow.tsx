
import React from 'react';
import { TableRow } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import TimeSlotCell from './TimeSlotCell';
import DogNameCell from './components/DogNameCell';

interface DogTimeRowProps {
  dog: DogCareStatus;
  timeSlots: string[];
  rowColor: string;
  activeCategory: string;
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
}

const DogTimeRow: React.FC<DogTimeRowProps> = ({
  dog,
  timeSlots,
  rowColor,
  activeCategory,
  hasPottyBreak,
  hasCareLogged,
  onCellClick
}) => {
  return (
    <TableRow key={`${dog.dog_id}-row`} className={rowColor}>
      {/* Dog name cell with photo, gender color, and condition symbols */}
      <DogNameCell dog={dog} />
      
      {/* Time slot cells with X marks */}
      {timeSlots.map((timeSlot) => {
        const cellKey = `${dog.dog_id}-${timeSlot}`;
        const hasPottyBreakForSlot = hasPottyBreak(dog.dog_id, timeSlot);
        const hasCareLoggedForSlot = hasCareLogged(dog.dog_id, timeSlot, activeCategory);
        
        return (
          <TimeSlotCell 
            key={cellKey}
            dogId={dog.dog_id}
            dogName={dog.dog_name}
            timeSlot={timeSlot}
            category={activeCategory}
            hasPottyBreak={hasPottyBreakForSlot}
            hasCareLogged={hasCareLoggedForSlot}
            onClick={() => onCellClick(dog.dog_id, dog.dog_name, timeSlot, activeCategory)}
            flags={dog.flags}
          />
        );
      })}
    </TableRow>
  );
};

export default DogTimeRow;
