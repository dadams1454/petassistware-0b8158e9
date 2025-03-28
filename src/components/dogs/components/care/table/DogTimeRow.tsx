
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { TableRow, TableCell } from '@/components/ui/table';

interface DogTimeRowProps {
  dog: DogCareStatus;
  timeSlots: string[];
  rowColor: string;
  activeCategory: string;
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, hour: number) => boolean;
  hasObservation: (dogId: string, hour: number) => boolean;
  getObservationDetails: (dogId: string, hour: number) => any;
  onCellClick: (dogId: string, hour: number) => void;
  onCellContextMenu: (e: React.MouseEvent, dogId: string, hour: number) => void;
  onCareLogClick: (dogId: string) => void;
  onDogClick: (dogId: string) => void;
  onObservationClick: (dogId: string, hour: number) => void;
  currentHour?: number;
}

const DogTimeRow: React.FC<DogTimeRowProps> = ({
  dog,
  timeSlots,
  rowColor,
  activeCategory,
  hasCareLogged,
  hasObservation,
  onCellClick,
  onCellContextMenu,
  onCareLogClick,
  onDogClick,
  onObservationClick,
  currentHour
}) => {
  return (
    <TableRow className={rowColor}>
      {/* Dog name cell */}
      <TableCell 
        className="sticky left-0 bg-inherit font-medium z-10 cursor-pointer hover:bg-accent/50"
        onClick={() => onDogClick(dog.dog_id)}
      >
        <div className="flex items-center space-x-2">
          {dog.dog_photo && (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src={dog.dog_photo} 
                alt={dog.dog_name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span>{dog.dog_name}</span>
        </div>
      </TableCell>

      {/* Observations cell */}
      <TableCell 
        className="cursor-pointer hover:bg-accent/50"
        onClick={() => onObservationClick(dog.dog_id, 0)}
      >
        <div className="flex items-center justify-center">
          {hasObservation(dog.dog_id, 0) ? (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs">
              Has notes
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">No notes</span>
          )}
        </div>
      </TableCell>

      {/* Time slot cells */}
      {timeSlots.map((slot, index) => {
        const isHighlighted = currentHour !== undefined && (
          (slot.includes('AM') && parseInt(slot.split(':')[0]) + (slot.includes('12') ? 0 : 12) === currentHour) || 
          (slot.includes('PM') && parseInt(slot.split(':')[0]) + (slot.includes('12') ? 12 : 0) === currentHour)
        );

        return (
          <TableCell 
            key={`${dog.dog_id}-${slot}`}
            className={`text-center cursor-pointer hover:bg-accent/50 ${isHighlighted ? 'bg-yellow-100/50 dark:bg-yellow-900/20' : ''}`}
            onClick={() => onCellClick(dog.dog_id, index)}
            onContextMenu={(e) => onCellContextMenu(e, dog.dog_id, index)}
          >
            {hasCareLogged(dog.dog_id, index) ? (
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto" />
            ) : (
              <div className="w-4 h-4 border border-gray-300 dark:border-gray-700 rounded-full mx-auto" />
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default DogTimeRow;
