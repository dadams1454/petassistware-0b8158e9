
import React, { memo } from 'react';
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
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => { text: string; type: string } | null;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onDogClick: (dogId: string) => void;
  currentHour?: number;
  isMobile?: boolean;
}

// Use memo to prevent unnecessary row re-renders
const DogTimeRow: React.FC<DogTimeRowProps> = memo(({
  dog,
  timeSlots,
  rowColor,
  activeCategory,
  hasPottyBreak,
  hasCareLogged,
  hasObservation,
  getObservationDetails,
  onCellClick,
  onCareLogClick,
  onDogClick,
  currentHour,
  isMobile = false
}) => {
  // Create stable copies of important data to prevent reference issues
  const dogId = dog.dog_id;
  const dogName = dog.dog_name;
  const dogFlags = dog.flags || [];
  
  // Helper function to determine if a time slot is the current hour
  const isCurrentHourSlot = (timeSlot: string) => {
    if (currentHour === undefined) return false;
    
    const hour = parseInt(timeSlot.split(':')[0]);
    const isPM = timeSlot.includes('PM');
    const is12Hour = hour === 12;
    
    // Convert slot to 24-hour format
    let slot24Hour = hour;
    if (isPM && !is12Hour) slot24Hour += 12;
    if (!isPM && is12Hour) slot24Hour = 0;
    
    return slot24Hour === currentHour;
  };

  // Check if the dog has any observations and get details if available
  const dogHasObservation = hasObservation(dogId, '');
  const observationDetails = dogHasObservation ? getObservationDetails(dogId) : null;
  
  return (
    <TableRow key={`${dogId}-row`} className={rowColor} data-dog-id={dogId}>
      {/* Dog name cell with photo, gender color, and observation text */}
      <DogNameCell 
        dog={dog} 
        onCareLogClick={() => onCareLogClick(dogId, dogName)}
        onDogClick={() => onDogClick(dogId)}
        activeCategory={activeCategory}
        hasObservation={dogHasObservation}
        observationText={observationDetails?.text || ''}
        observationType={observationDetails?.type || ''}
      />
      
      {/* Time slot cells - now without observation indicators */}
      {timeSlots.map((timeSlot) => {
        const cellKey = `${dogId}-${timeSlot}`;
        const hasPottyBreakForSlot = hasPottyBreak(dogId, timeSlot);
        const hasCareLoggedForSlot = hasCareLogged(dogId, timeSlot, activeCategory);
        const isCurrentTimeSlot = isCurrentHourSlot(timeSlot);
        
        return (
          <TimeSlotCell 
            key={cellKey}
            dogId={dogId}
            dogName={dogName}
            timeSlot={timeSlot}
            category={activeCategory}
            hasPottyBreak={hasPottyBreakForSlot}
            hasCareLogged={hasCareLoggedForSlot}
            onClick={() => onCellClick(dogId, dogName, timeSlot, activeCategory)}
            flags={dogFlags}
            isCurrentHour={isCurrentTimeSlot}
          />
        );
      })}
    </TableRow>
  );
});

// Add display name for better debugging
DogTimeRow.displayName = 'DogTimeRow';

export default DogTimeRow;
