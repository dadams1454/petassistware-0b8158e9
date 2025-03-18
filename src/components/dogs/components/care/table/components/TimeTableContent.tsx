
import React from 'react';
import { Table, TableHead, TableHeader, TableRow, TableBody } from '@/components/ui/table';
import TimeSlotHeaders from '../TimeSlotHeaders';
import DogTimeRow from '../DogTimeRow';
import { DogCareStatus } from '@/types/dailyCare';

interface TimeTableContentProps {
  sortedDogs: DogCareStatus[];
  timeSlots: string[];
  activeCategory: string;
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick?: (dogId: string, dogName: string) => void;
  currentHour?: number;
  hasObservation?: (dogId: string) => boolean;
  onAddObservation?: (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'other') => Promise<void>;
  observations?: Record<string, Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
  }>>;
  isMobile?: boolean;
}

const TimeTableContent: React.FC<TimeTableContentProps> = ({
  sortedDogs,
  timeSlots,
  activeCategory,
  hasPottyBreak,
  hasCareLogged,
  onCellClick,
  currentHour,
  hasObservation = () => false,
  onAddObservation,
  observations = {},
  isMobile = false
}) => {
  return (
    <Table>
      <TableHead className="bg-slate-50 dark:bg-slate-800/50">
        <TableRow>
          <TableHeader className="sticky left-0 z-20 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700">
            Dog
          </TableHeader>
          <TimeSlotHeaders timeSlots={timeSlots} currentHour={currentHour} />
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedDogs.map((dog, index) => (
          <DogTimeRow
            key={dog.dog_id}
            dog={dog}
            timeSlots={timeSlots}
            rowColor={index % 2 === 0 ? "" : "bg-gray-50 dark:bg-slate-800/20"}
            activeCategory={activeCategory}
            hasPottyBreak={hasPottyBreak}
            hasCareLogged={hasCareLogged}
            onCellClick={onCellClick}
            currentHour={currentHour}
            hasObservation={hasObservation}
            onAddObservation={onAddObservation}
            observations={observations}
            isMobile={isMobile}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default TimeTableContent;
