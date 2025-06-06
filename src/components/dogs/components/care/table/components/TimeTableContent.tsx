
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import DogTimeRow from '../DogTimeRow';
import { getDogRowColor } from '../dogGroupColors';

interface TimeTableContentProps {
  sortedDogs: DogCareStatus[];
  timeSlots: string[];
  activeCategory: string;
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => { text: string; type: string; timeSlot?: string; category?: string; } | null;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCellContextMenu: (e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onDogClick: (dogId: string) => void;
  onObservationClick: (dogId: string, dogName: string) => void;
  currentHour?: number;
  isMobile?: boolean;
  isPendingFeeding?: (dogId: string, timeSlot: string) => boolean;
}

const TimeTableContent: React.FC<TimeTableContentProps> = ({
  sortedDogs,
  timeSlots,
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
  // If timeSlots is empty or not provided, use default empty array
  const effectiveTimeSlots = timeSlots && timeSlots.length > 0 ? timeSlots : [];
  
  return (
    <Table>
      <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
        <TableRow>
          <TableHead className="w-[160px] md:w-[250px]">Dog</TableHead>
          <TableHead className="w-[220px]">Observations</TableHead>
          {effectiveTimeSlots.map((slot) => (
            <TableHead 
              key={slot} 
              className={`text-center w-[80px] ${
                currentHour !== undefined && 
                slot.includes(`${currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour}:00 ${currentHour >= 12 ? 'PM' : 'AM'}`)
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
        {sortedDogs.map((dog, index) => (
          <DogTimeRow
            key={dog.dog_id}
            dog={dog}
            timeSlots={effectiveTimeSlots}
            rowColor={getDogRowColor(index)}
            activeCategory={activeCategory}
            hasPottyBreak={hasPottyBreak}
            hasCareLogged={hasCareLogged}
            hasObservation={hasObservation}
            getObservationDetails={getObservationDetails}
            onCellClick={onCellClick}
            onCellContextMenu={onCellContextMenu}
            onCareLogClick={onCareLogClick}
            onDogClick={onDogClick}
            onObservationClick={onObservationClick}
            currentHour={currentHour}
            isMobile={isMobile}
            isPendingFeeding={isPendingFeeding}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default TimeTableContent;
