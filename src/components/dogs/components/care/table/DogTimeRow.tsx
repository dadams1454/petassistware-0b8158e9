
import React, { memo } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import TimeSlotCell from './TimeSlotCell';
import DogNameCell from './components/DogNameCell';
import ObservationCell from './components/ObservationCell';
import { useRowEventHandlers } from './hooks/useRowEventHandlers';
import { useObservationHelpers } from './hooks/useObservationHelpers';

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
  onCellContextMenu,
  onCareLogClick,
  onDogClick,
  onObservationClick,
  currentHour,
  isMobile = false
}) => {
  // Create stable copies of important data to prevent reference issues
  const dogId = dog.dog_id;
  const dogName = dog.dog_name;
  const dogFlags = dog.flags || [];
  
  // Use custom hooks to separate logic
  const { handleCellClickSafe, handleCellContextMenuSafe, handleDogCellClick, handleCareLogCellClick } = 
    useRowEventHandlers({
      dogId,
      dogName,
      onCellClick,
      onCellContextMenu,
      onCareLogClick,
      onDogClick,
      activeCategory
    });
  
  const { getObservationTimeSlot } = useObservationHelpers();

  // Helper function to determine if a time slot is the current hour
  const isCurrentHourSlot = (timeSlot: string) => {
    if (currentHour === undefined || activeCategory === 'feeding') return false;
    
    // For feeding, we don't need current hour highlighting
    if (activeCategory === 'feeding') return false;
    
    // For potty breaks, check if the time slot matches current hour
    const hour = parseInt(timeSlot.split(':')[0]);
    const isPM = timeSlot.includes('PM');
    const is12Hour = hour === 12;
    
    // Convert slot to 24-hour format
    let slot24Hour = hour;
    if (isPM && !is12Hour) slot24Hour += 12;
    if (!isPM && is12Hour) slot24Hour = 0;
    
    return slot24Hour === currentHour;
  };

  // Check if the dog has any observations in the current category
  const dogHasObservation = hasObservation(dogId, '');
  
  // Get observation details for the current category if available
  const observationDetails = dogHasObservation ? getObservationDetails(dogId) : null;
  
  const observationTimeSlot = getObservationTimeSlot(observationDetails);
  
  return (
    <TableRow 
      key={`${dogId}-row`} 
      className={`${rowColor} dog-table-row`} 
      data-dog-id={dogId}
    >
      {/* Dog name cell with photo, gender color based on dog sex */}
      <DogNameCell 
        dog={dog} 
        onCareLogClick={handleCareLogCellClick}
        onDogClick={handleDogCellClick}
        activeCategory={activeCategory}
        hasObservation={dogHasObservation}
        observationText={observationDetails?.text || ''}
        observationType={observationDetails?.type || ''}
      />
      
      {/* Observation column - shows only observations for the current category */}
      <ObservationCell 
        dogHasObservation={dogHasObservation}
        observationDetails={observationDetails}
        activeCategory={activeCategory}
        dogId={dogId}
        dogName={dogName}
        onObservationClick={onObservationClick}
      />
      
      {/* Time slot cells */}
      {timeSlots.map((timeSlot) => {
        const cellKey = `${dogId}-${timeSlot}`;
        const hasPottyBreakForSlot = hasPottyBreak(dogId, timeSlot);
        const hasCareLoggedForSlot = hasCareLogged(dogId, timeSlot, activeCategory);
        const isCurrentTimeSlot = isCurrentHourSlot(timeSlot);
        
        // Check if this time slot matches the observation time for the current category
        const isIncidentTimeSlot = dogHasObservation && 
                                  observationDetails && 
                                  observationDetails.timeSlot === timeSlot;
        
        return (
          <TimeSlotCell 
            key={cellKey}
            dogId={dogId}
            dogName={dogName}
            timeSlot={timeSlot}
            category={activeCategory}
            hasPottyBreak={hasPottyBreakForSlot}
            hasCareLogged={hasCareLoggedForSlot}
            onClick={() => handleCellClickSafe(dogId, dogName, timeSlot, activeCategory)}
            onContextMenu={handleCellContextMenuSafe}
            flags={dogFlags.map(flag => flag.type)} // Convert DogFlag[] to string[]
            isCurrentHour={isCurrentTimeSlot}
            isIncident={isIncidentTimeSlot}
          />
        );
      })}
    </TableRow>
  );
});

// Add display name for better debugging
DogTimeRow.displayName = 'DogTimeRow';

export default DogTimeRow;
