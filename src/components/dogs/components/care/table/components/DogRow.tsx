
import React from 'react';
import { TableRow } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import DogNameCell from './DogNameCell';
import ObservationCell from './ObservationCell';
import TimeSlotCell from '../TimeSlotCell';

interface DogRowProps {
  dog: DogCareStatus;
  timeSlots: string[];
  activeCategory: string;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => { text: string; type: string } | null;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCellContextMenu: (e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onDogClick: (dogId: string) => void;
  onObservationClick: (dogId: string, dogName: string) => void;
  isMobile?: boolean;
}

const DogRow: React.FC<DogRowProps> = ({
  dog,
  timeSlots,
  activeCategory,
  hasCareLogged,
  hasObservation,
  getObservationDetails,
  onCellClick,
  onCellContextMenu,
  onCareLogClick,
  onDogClick,
  onObservationClick,
  isMobile = false
}) => {
  // Get observation details for this dog
  const observationDetails = getObservationDetails(dog.dog_id);
  
  // Determine row background color - alternating for better readability
  const rowBgClass = parseInt(dog.dog_id) % 2 === 0 
    ? 'bg-white dark:bg-gray-950' 
    : 'bg-gray-50 dark:bg-gray-900/50';

  return (
    <TableRow className={`${rowBgClass} hover:bg-blue-50 dark:hover:bg-blue-900/20`}>
      {/* Dog Name Cell */}
      <DogNameCell 
        dog={dog} 
        onCareLogClick={(e) => onCareLogClick(dog.dog_id, dog.dog_name)} 
        onDogClick={(e) => onDogClick(dog.dog_id)}
        activeCategory={activeCategory}
        hasObservation={hasObservation(dog.dog_id, '')}
        observationText={observationDetails?.text}
        observationType={observationDetails?.type}
      />

      {/* Observations Cell */}
      <ObservationCell 
        dogId={dog.dog_id}
        dogName={dog.dog_name}
        dogHasObservation={hasObservation(dog.dog_id, '')}
        observationDetails={observationDetails}
        onClick={() => onObservationClick(dog.dog_id, dog.dog_name)}
        activeCategory={activeCategory}
      />
      
      {/* Create cells for each time slot */}
      {timeSlots.map(timeSlot => (
        <TimeSlotCell
          key={`${dog.dog_id}-${timeSlot}`}
          dogId={dog.dog_id}
          dogName={dog.dog_name}
          timeSlot={timeSlot}
          category={activeCategory}
          hasPottyBreak={false}
          hasCareLogged={hasCareLogged(dog.dog_id, timeSlot, activeCategory)}
          onClick={() => onCellClick(dog.dog_id, dog.dog_name, timeSlot, activeCategory)}
          onContextMenu={(e) => onCellContextMenu(e, dog.dog_id, dog.dog_name, timeSlot, activeCategory)}
        />
      ))}
    </TableRow>
  );
};

export default DogRow;
