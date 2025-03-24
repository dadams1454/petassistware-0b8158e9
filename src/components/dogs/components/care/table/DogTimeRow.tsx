
import React, { useCallback, memo, useMemo } from 'react';
import { TableRow } from '@/components/ui/table';
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

// Use memo to prevent unnecessary re-renders of entire rows
const DogTimeRow = memo(({
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
}: DogTimeRowProps) => {
  // Memoize these handler functions to prevent rebuilding on every render
  const handleDogNameClick = useCallback(() => {
    onDogClick(dog.dog_id);
  }, [dog.dog_id, onDogClick]);
  
  const handleCareLogClick = useCallback(() => {
    onCareLogClick(dog.dog_id, dog.dog_name);
  }, [dog.dog_id, dog.dog_name, onCareLogClick]);
  
  const handleObservationClick = useCallback(() => {
    onObservationClick(dog.dog_id, dog.dog_name);
  }, [dog.dog_id, dog.dog_name, onObservationClick]);
  
  // Handle cell click for this specific dog
  const handleCellClick = useCallback((timeSlot: string) => {
    onCellClick(dog.dog_id, dog.dog_name, timeSlot, activeCategory);
  }, [dog.dog_id, dog.dog_name, onCellClick, activeCategory]);

  // Handle context menu for this specific dog
  const handleCellContextMenu = useCallback((e: React.MouseEvent, timeSlot: string) => {
    onCellContextMenu(e, dog.dog_id, dog.dog_name, timeSlot, activeCategory);
  }, [dog.dog_id, dog.dog_name, onCellContextMenu, activeCategory]);

  // Get hours from time slot - memoize this function
  const getHourFromTimeSlot = useCallback((timeSlot: string): number => {
    if (timeSlot.includes('AM')) {
      const hour = parseInt(timeSlot.split(':')[0]);
      return hour === 12 ? 0 : hour;  // 12 AM is hour 0
    } else {
      const hour = parseInt(timeSlot.split(':')[0]);
      return hour === 12 ? 12 : hour + 12;  // 12 PM is hour 12, 1 PM is hour 13, etc.
    }
  }, []);
  
  // Get observation details only once per render
  const observationDetails = useMemo(() => getObservationDetails(dog.dog_id), [dog.dog_id, getObservationDetails]);
  
  // Check observation once per render
  const dogHasObservation = useMemo(() => hasObservation(dog.dog_id, ''), [dog.dog_id, hasObservation]);

  // Memoize the row class to prevent recalculation
  const rowClass = useMemo(() => `${rowColor} hover:bg-opacity-80 dark:hover:bg-opacity-40 transition-colors duration-200`, 
    [rowColor]);

  return (
    <TableRow className={rowClass} key={dog.dog_id}>
      {/* Dog Name Cell */}
      <DogNameCell 
        dog={dog} 
        onCareLogClick={handleCareLogClick} 
        onDogClick={handleDogNameClick} 
        activeCategory={activeCategory}
      />
      
      {/* Observations Cell */}
      <ObservationCell 
        dogId={dog.dog_id}
        dogName={dog.dog_name}
        dogHasObservation={dogHasObservation}
        observationDetails={observationDetails}
        onClick={handleObservationClick}
        activeCategory={activeCategory}
      />
      
      {/* Time Slots - memoize this to prevent recreation of all cells */}
      {timeSlots.map((timeSlot) => {
        // Check if this time slot corresponds to the current hour
        const hour = getHourFromTimeSlot(timeSlot);
        const isTimeSlotCurrentHour = currentHour !== undefined && hour === currentHour;
        
        // Create click handlers for this specific time slot
        const handleTimeSlotClick = () => handleCellClick(timeSlot);
        const handleTimeSlotContextMenu = (e: React.MouseEvent) => handleCellContextMenu(e, timeSlot);
        
        return (
          <TimeSlotCell
            key={`${dog.dog_id}-${timeSlot}`}
            dogId={dog.dog_id}
            dogName={dog.dog_name}
            timeSlot={timeSlot}
            category={activeCategory}
            hasPottyBreak={hasPottyBreak(dog.dog_id, timeSlot)}
            hasCareLogged={hasCareLogged(dog.dog_id, timeSlot, activeCategory)}
            onClick={handleTimeSlotClick}
            onContextMenu={handleTimeSlotContextMenu}
            isCurrentHour={isTimeSlotCurrentHour}
            isIncident={activeCategory === 'feeding' && hasObservation(dog.dog_id, timeSlot)}
            isPendingFeeding={activeCategory === 'feeding' ? isPendingFeeding(dog.dog_id, timeSlot) : false}
          />
        );
      })}
    </TableRow>
  );
});

// Add display name for better debugging
DogTimeRow.displayName = 'DogTimeRow';

export default DogTimeRow;
