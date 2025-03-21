
import React, { memo, useMemo } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import TimeSlotCell from './TimeSlotCell';
import DogNameCell from './components/DogNameCell';
import { AlertTriangle, Heart, Activity, MessageCircle } from 'lucide-react';

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
  onCellContextMenu: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onDogClick: (dogId: string) => void;
  currentHour?: number;
  isMobile?: boolean;
  isCellActive?: (dogId: string, timeSlot: string, category: string) => boolean;
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
  currentHour,
  isMobile = false,
  isCellActive = () => false
}) => {
  // Create stable copies of important data to prevent reference issues
  const dogId = dog.dog_id;
  const dogName = dog.dog_name;
  const dogFlags = useMemo(() => dog.flags || [], [dog.flags]);
  
  // Memoize the observation details calculation to avoid recalculating on every render
  const { dogHasObservation, observationDetails, observationTimeSlot } = useMemo(() => {
    const hasObs = hasObservation(dogId, '');
    const details = hasObs ? getObservationDetails(dogId) : null;
    const timeSlot = details?.timeSlot || null;
    return { dogHasObservation: hasObs, observationDetails: details, observationTimeSlot: timeSlot };
  }, [dogId, hasObservation, getObservationDetails]);
  
  // Helper function to determine if a time slot is the current hour - memoized
  const isCurrentHourSlot = useCallback((timeSlot: string) => {
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
  }, [currentHour, activeCategory]);

  // Function to get observation icon based on type - memoized
  const getObservationIcon = useMemo(() => {
    if (!observationDetails) return null;
    
    switch (observationDetails.type) {
      case 'accident':
        return <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />;
      case 'heat':
        return <Heart className="h-4 w-4 text-red-500 flex-shrink-0" />;
      case 'behavior':
        return <Activity className="h-4 w-4 text-blue-500 flex-shrink-0" />;
      case 'feeding':
        return <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />;
    }
  }, [observationDetails]);
  
  // Memoize the cell handlers to prevent recreation on every render
  const handleCellClick = useCallback((timeSlot: string) => {
    onCellClick(dogId, dogName, timeSlot, activeCategory);
  }, [dogId, dogName, activeCategory, onCellClick]);
  
  const handleCellContextMenu = useCallback((timeSlot: string, e: React.MouseEvent) => {
    e.preventDefault();
    onCellContextMenu(dogId, dogName, timeSlot, activeCategory);
  }, [dogId, dogName, activeCategory, onCellContextMenu]);
  
  const handleCareLogClick = useCallback(() => {
    onCareLogClick(dogId, dogName);
  }, [dogId, dogName, onCareLogClick]);
  
  const handleDogClick = useCallback(() => {
    onDogClick(dogId);
  }, [dogId, onDogClick]);
  
  return (
    <TableRow key={`${dogId}-row`} className={rowColor} data-dog-id={dogId}>
      {/* Dog name cell with photo, gender color */}
      <DogNameCell 
        dog={dog} 
        onCareLogClick={handleCareLogClick}
        onDogClick={handleDogClick}
        activeCategory={activeCategory}
        hasObservation={false}
        observationText=""
        observationType=""
      />
      
      {/* Observation column - shows only observations for the current category */}
      <TableCell className="p-2 border-r border-slate-200 dark:border-slate-700 max-w-[220px]">
        {dogHasObservation && observationDetails ? (
          <div className="flex items-start gap-2">
            {getObservationIcon}
            <div className="overflow-hidden">
              <div className="text-xs font-medium capitalize text-gray-700 dark:text-gray-300">
                {observationDetails.type}
              </div>
              <div className="text-xs line-clamp-3 text-gray-600 dark:text-gray-400">
                {observationDetails.text}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-600">
            {activeCategory === 'feeding' ? 'No feeding issues' : 'No observations'}
          </span>
        )}
      </TableCell>
      
      {/* Time slot cells */}
      {timeSlots.map((timeSlot) => {
        const hasPottyBreakForSlot = hasPottyBreak(dogId, timeSlot);
        const hasCareLoggedForSlot = hasCareLogged(dogId, timeSlot, activeCategory);
        const isCurrentTimeSlot = isCurrentHourSlot(timeSlot);
        const isActive = isCellActive(dogId, timeSlot, activeCategory);
        
        // Check if this time slot matches the observation time for the current category
        const isIncidentTimeSlot = dogHasObservation && 
                                  observationDetails && 
                                  observationDetails.timeSlot === timeSlot;
        
        return (
          <TimeSlotCell 
            key={`${dogId}-${timeSlot}`}
            dogId={dogId}
            dogName={dogName}
            timeSlot={timeSlot}
            category={activeCategory}
            hasPottyBreak={hasPottyBreakForSlot}
            hasCareLogged={hasCareLoggedForSlot}
            onClick={() => handleCellClick(timeSlot)}
            onContextMenu={(e) => handleCellContextMenu(timeSlot, e)}
            flags={dogFlags}
            isCurrentHour={isCurrentTimeSlot}
            isIncident={isIncidentTimeSlot}
            isActive={isActive}
          />
        );
      })}
    </TableRow>
  );
});

// Add display name for better debugging
DogTimeRow.displayName = 'DogTimeRow';

export default DogTimeRow;
