
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Dog } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import TimeSlotCell from './TimeSlotCell';

interface DogTimeRowProps {
  dog: DogCareStatus;
  timeSlots: string[];
  rowColor: string;
  activeCategory: string;
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
}

const DogTimeRow: React.FC<DogTimeRowProps> = ({
  dog,
  timeSlots,
  rowColor,
  activeCategory,
  hasPottyBreak,
  onCellClick
}) => {
  return (
    <TableRow key={dog.dog_id} className={rowColor}>
      <TableCell className="font-medium sticky left-0 z-10 border-r border-slate-200 bg-white dark:bg-slate-900">
        <div className="flex items-center space-x-2">
          {dog.dog_photo ? (
            <img 
              src={dog.dog_photo} 
              alt={dog.dog_name} 
              className="w-6 h-6 rounded-full object-cover" 
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Dog className="h-3 w-3 text-primary" />
            </div>
          )}
          <span>{dog.dog_name}</span>
        </div>
      </TableCell>
      
      {timeSlots.map((timeSlot) => (
        <TimeSlotCell 
          key={`${dog.dog_id}-${timeSlot}`}
          dogId={dog.dog_id}
          dogName={dog.dog_name}
          timeSlot={timeSlot}
          category={activeCategory}
          hasPottyBreak={hasPottyBreak(dog.dog_id, timeSlot)}
          onClick={() => onCellClick(dog.dog_id, dog.dog_name, timeSlot, activeCategory)}
        />
      ))}
    </TableRow>
  );
};

export default DogTimeRow;
