
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import DogTimeRow from '../DogTimeRow';

interface TimeTableContentProps {
  sortedDogs: DogCareStatus[];
  timeSlots: string[];
  activeCategory: string;
  hasCareLogged: (dogId: string, hour: number) => boolean;
  hasObservation: (dogId: string, hour: number) => boolean;
  getObservationDetails: (dogId: string, hour: number) => any;
  onCellClick: (dogId: string, hour: number) => void;
  onCellContextMenu: (e: React.MouseEvent, dogId: string, hour: number) => void;
  onCareLogClick: (dogId: string) => void;
  onDogClick: (dogId: string) => void;
  onObservationClick: (dogId: string, hour: number) => void;
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
  isMobile
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
            {timeSlots.map((slot, index) => (
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
          {sortedDogs.map((dog) => {
            // Calculate a simple striped row background
            const rowBgClass = parseInt(dog.dog_id) % 2 === 0 
              ? 'bg-white dark:bg-gray-950' 
              : 'bg-gray-50 dark:bg-gray-900/50';
              
            return (
              <DogTimeRow
                key={dog.dog_id}
                dog={dog}
                timeSlots={timeSlots}
                rowColor={rowBgClass}
                activeCategory={activeCategory}
                hasPottyBreak={() => false}
                hasCareLogged={(dogId, hour) => hasCareLogged(dogId, hour)}
                hasObservation={(dogId, hour) => hasObservation(dogId, hour)}
                getObservationDetails={getObservationDetails}
                onCellClick={onCellClick}
                onCellContextMenu={onCellContextMenu}
                onCareLogClick={onCareLogClick}
                onDogClick={onDogClick}
                onObservationClick={onObservationClick}
                currentHour={currentHour}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTableContent;
