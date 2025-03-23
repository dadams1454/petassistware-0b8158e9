
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import { getDogRowColor } from '../dogGroupColors';
import TimeSlotCell from './TimeSlotCell';
import DogNameCell from './DogNameCell';
import ObservationCell from './ObservationCell';
import { Skeleton } from '@/components/ui/skeleton';
import { Observation } from '../hooks/useObservations';

interface TimeTableContentProps {
  activeCategory: string;
  sortedDogs: DogCareStatus[];
  timeSlots: string[];
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string) => boolean;
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => Observation | null;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, hasPottyBreak: boolean, hasCareLogged: boolean) => void;
  onCellContextMenu: (e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string) => void;
  onDogClick: (dogId: string) => void;
  onObservationClick: (dogId: string) => void;
  isCurrentHourSlot: (timeSlot: string) => boolean;
  isLoading: boolean;
}

const TimeTableContent: React.FC<TimeTableContentProps> = ({
  activeCategory,
  sortedDogs,
  timeSlots,
  hasPottyBreak,
  hasCareLogged,
  hasObservation,
  getObservationDetails,
  onCellClick,
  onCellContextMenu,
  onDogClick,
  onObservationClick,
  isCurrentHourSlot,
  isLoading
}) => {
  // Show loading skeleton
  if (isLoading && sortedDogs.length === 0) {
    return (
      <div className="p-8">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }
  
  // Show empty state
  if (sortedDogs.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No dogs found. Please refresh or add dogs to the system.
      </div>
    );
  }
  
  return (
    <div className="relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 z-10 flex items-center justify-center">
          <div className="loading-spinner h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow>
            <TableHead className="w-[160px] md:w-[220px]">Dog</TableHead>
            <TableHead className="w-[220px]">
              {activeCategory === 'feeding' ? 'Feeding Notes' : 'Observations'}
            </TableHead>
            {timeSlots.map((slot) => (
              <TableHead 
                key={slot} 
                className={`text-center w-[80px] ${
                  isCurrentHourSlot(slot) 
                    ? 'bg-blue-50 dark:bg-blue-900/10 font-medium' 
                    : ''
                }`}
              >
                {slot}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDogs.map((dog, index) => {
            // Get observation details if any
            const dogHasObservation = hasObservation(dog.dog_id, '');
            const observationDetails = dogHasObservation ? getObservationDetails(dog.dog_id) : null;
            
            return (
              <TableRow
                key={dog.dog_id}
                className={getDogRowColor(index)}
              >
                {/* Dog name cell */}
                <DogNameCell 
                  dog={dog} 
                  onClick={() => onDogClick(dog.dog_id)}
                />
                
                {/* Observation cell */}
                <ObservationCell 
                  dogHasObservation={dogHasObservation}
                  observationDetails={observationDetails}
                  activeCategory={activeCategory}
                  dogId={dog.dog_id}
                  dogName={dog.dog_name}
                  onObservationClick={() => onObservationClick(dog.dog_id)}
                />
                
                {/* Time slot cells */}
                {timeSlots.map((timeSlot) => {
                  const hasPottyBreakHere = hasPottyBreak(dog.dog_id, timeSlot);
                  const hasCareLoggedHere = hasCareLogged(dog.dog_id, timeSlot);
                  const hasObservationHere = hasObservation(dog.dog_id, timeSlot);
                  
                  return (
                    <TimeSlotCell
                      key={`${dog.dog_id}-${timeSlot}`}
                      dogId={dog.dog_id}
                      dogName={dog.dog_name}
                      timeSlot={timeSlot}
                      category={activeCategory}
                      hasPottyBreak={hasPottyBreakHere}
                      hasCareLogged={hasCareLoggedHere}
                      onClick={() => onCellClick(
                        dog.dog_id,
                        dog.dog_name,
                        timeSlot,
                        hasPottyBreakHere,
                        hasCareLoggedHere
                      )}
                      onContextMenu={(e) => onCellContextMenu(e, dog.dog_id, dog.dog_name, timeSlot)}
                      isCurrentHour={isCurrentHourSlot(timeSlot)}
                      isIncident={hasObservationHere}
                    />
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TimeTableContent;
