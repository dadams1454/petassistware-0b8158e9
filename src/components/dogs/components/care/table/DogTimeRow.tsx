
import React, { useCallback } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import TimeSlotCell from './components/TimeSlotCell';
import DogNameCell from './components/DogNameCell';
import ObservationCell from './components/ObservationCell';

interface DogTimeRowProps {
  dog: DogCareStatus;
  timeSlots: string[];
  rowColor: string;
  activeCategory: string;
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => { text: string; type: string; timeSlot?: string; category?: string } | null;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCellContextMenu: (e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onDogClick: (dogId: string) => void;
  onObservationClick: (dogId: string, dogName: string) => void;
  currentHour?: number;
  isMobile?: boolean;
  isPendingFeeding?: (dogId: string, timeSlot: string) => boolean;
}

const DogTimeRow: React.FC<DogTimeRowProps> = ({
  dog,
  timeSlots,
  rowColor,
  activeCategory,
  hasPottyBreak,
  hasCareLogged,
  hasObservation,
  getObservationDetails,
  onCellClick,
  onCellContextMenu,
  onCareLogClick,
  onDogClick,
  onObservationClick,
  currentHour,
  isMobile = false,
  isPendingFeeding = () => false
}) => {
  // Handle cell click for this specific dog
  const handleCellClick = useCallback((timeSlot: string) => {
    onCellClick(dog.dog_id, dog.dog_name, timeSlot, activeCategory);
  }, [dog.dog_id, dog.dog_name, onCellClick, activeCategory]);

  // Handle context menu for this specific dog
  const handleCellContextMenu = useCallback((e: React.MouseEvent, timeSlot: string) => {
    onCellContextMenu(e, dog.dog_id, dog.dog_name, timeSlot, activeCategory);
  }, [dog.dog_id, dog.dog_name, onCellContextMenu, activeCategory]);

  // Get hours from time slot
  const getHourFromTimeSlot = (timeSlot: string): number => {
    if (timeSlot.includes('AM')) {
      const hour = parseInt(timeSlot.split(':')[0]);
      return hour === 12 ? 0 : hour;  // 12 AM is hour 0
    } else {
      const hour = parseInt(timeSlot.split(':')[0]);
      return hour === 12 ? 12 : hour + 12;  // 12 PM is hour 12, 1 PM is hour 13, etc.
    }
  };

  return (
    <TableRow
      className={`${rowColor} hover:bg-opacity-80 dark:hover:bg-opacity-40 transition-colors duration-200`}
      key={dog.dog_id}
    >
      {/* Dog Name Cell */}
      <DogNameCell 
        dog={dog} 
        onCareLogClick={() => onCareLogClick(dog.dog_id, dog.dog_name)} 
        onDogClick={() => onDogClick(dog.dog_id)} 
        activeCategory={activeCategory}
      />
      
      {/* Observations Cell */}
      <ObservationCell 
        dogId={dog.dog_id}
        dogName={dog.dog_name}
        dogHasObservation={hasObservation(dog.dog_id, '')}
        observationDetails={getObservationDetails(dog.dog_id)}
        onClick={() => onObservationClick(dog.dog_id, dog.dog_name)}
        activeCategory={activeCategory}
      />
      
      {/* Time Slots */}
      {timeSlots.map((timeSlot) => {
        // Check if this time slot corresponds to the current hour
        const hour = getHourFromTimeSlot(timeSlot);
        const isTimeSlotCurrentHour = currentHour !== undefined && hour === currentHour;
        
        return (
          <TimeSlotCell
            key={`${dog.dog_id}-${timeSlot}`}
            dogId={dog.dog_id}
            dogName={dog.dog_name}
            timeSlot={timeSlot}
            category={activeCategory}
            hasPottyBreak={hasPottyBreak(dog.dog_id, timeSlot)}
            hasCareLogged={hasCareLogged(dog.dog_id, timeSlot, activeCategory)}
            onClick={() => handleCellClick(timeSlot)}
            onContextMenu={(e) => handleCellContextMenu(e, timeSlot)}
            isCurrentHour={isTimeSlotCurrentHour}
            isIncident={activeCategory === 'feeding' && hasObservation(dog.dog_id, timeSlot)}
            isPendingFeeding={activeCategory === 'feeding' ? isPendingFeeding(dog.dog_id, timeSlot) : false}
          />
        );
      })}
    </TableRow>
  );
};

export default DogTimeRow;
