
import React, { useEffect } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
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
  useEffect(() => {
    console.log(`DogTimeRow rendered for ${dog.dog_name} with category: ${activeCategory}`);
  }, [dog.dog_name, activeCategory]);

  return (
    <TableRow key={`${dog.dog_id}-row-${activeCategory}`} className={rowColor}>
      {/* Dog name cell with photo and flags */}
      <DogNameCell dog={dog} />
      
      {/* Time slot cells */}
      {timeSlots.map((timeSlot) => {
        const hasPottyBreakForSlot = hasPottyBreak(dog.dog_id, timeSlot);
        const hasCareLoggedForSlot = hasCareLogged(dog.dog_id, timeSlot, activeCategory);
        
        return (
          <TimeSlotCell 
            key={`${dog.dog_id}-${timeSlot}-${activeCategory}`}
            dogId={dog.dog_id}
            dogName={dog.dog_name}
            timeSlot={timeSlot}
            category={activeCategory}
            hasPottyBreak={hasPottyBreakForSlot}
            hasCareLogged={hasCareLoggedForSlot}
            onClick={() => {
              console.log(`Cell clicked for ${dog.dog_name} at ${timeSlot} for ${activeCategory}`);
              onCellClick(dog.dog_id, dog.dog_name, timeSlot, activeCategory);
            }}
            flags={dog.flags}
          />
        );
      })}
    </TableRow>
  );
};

export default DogTimeRow;
