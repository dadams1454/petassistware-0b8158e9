
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import DogRow from './DogRow';

interface TimeTableContentProps {
  sortedDogs: DogCareStatus[];
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
  currentHour?: number;
  isMobile?: boolean;
}

const TimeTableContent: React.FC<TimeTableContentProps> = ({
  sortedDogs,
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
  currentHour,
  isMobile = false
}) => {
  return (
    <div className="relative overflow-x-auto border-t">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground bg-accent/30">
          <tr className="border-b">
            <th className="px-2 py-3 font-medium sticky left-0 bg-accent/30 z-10 min-w-[120px]">
              <span className="pl-1">Dog</span>
            </th>
            <th className="px-2 py-3 font-medium min-w-[150px]">
              Observations
            </th>
            {timeSlots.map(slot => (
              <th
                key={slot}
                className={`px-3 py-3 font-medium text-center ${
                  currentHour && 
                  (
                    (slot.includes('AM') && parseInt(slot.split(':')[0]) + (slot.includes('12') ? 0 : 12) === currentHour) || 
                    (slot.includes('PM') && parseInt(slot.split(':')[0]) + (slot.includes('12') ? 12 : 0) === currentHour)
                  ) 
                    ? 'bg-yellow-100 dark:bg-yellow-950' 
                    : ''
                }`}
              >
                {slot}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedDogs.map((dog) => (
            <DogRow
              key={dog.dog_id}
              dog={dog}
              timeSlots={timeSlots}
              activeCategory={activeCategory}
              hasCareLogged={hasCareLogged}
              hasObservation={hasObservation}
              getObservationDetails={getObservationDetails}
              onCellClick={onCellClick}
              onCellContextMenu={onCellContextMenu}
              onCareLogClick={onCareLogClick}
              onDogClick={onDogClick}
              onObservationClick={onObservationClick}
              isMobile={isMobile}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTableContent;
