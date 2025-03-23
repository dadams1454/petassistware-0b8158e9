
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import TimeTableContent from './TimeTableContent';
import { ScrollArea } from '@/components/ui/scroll-area';
import TimeTableHeader from './TimeTableHeader';
import TimeTableFooter from './TimeTableFooter';
import { Observation } from '../hooks/useObservations';

interface ActiveTabContentProps {
  activeCategory: string;
  sortedDogs: DogCareStatus[];
  timeSlots: string[];
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string) => boolean;
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => Observation | null;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, hasPottyBreak: boolean, hasCareLogged: boolean) => void;
  onCellContextMenu: (e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string) => void;
  onCareLogClick: (dogId: string) => void;
  onDogClick: (dogId: string) => void;
  onObservationClick: (dogId: string) => void;
  onRefresh: () => void;
  onCategoryChange?: (category: string) => void;
  currentHour?: number;
  isMobile?: boolean;
}

const ActiveTabContent: React.FC<ActiveTabContentProps> = ({
  activeCategory,
  sortedDogs,
  timeSlots,
  hasPottyBreak,
  hasCareLogged,
  hasObservation,
  getObservationDetails,
  onCellClick,
  onCellContextMenu,
  onCareLogClick,
  onDogClick,
  onObservationClick,
  onRefresh,
  onCategoryChange = () => {}, // Provide a default no-op function
  currentHour,
  isMobile = false
}) => {
  return (
    <div className="rounded-md border">
      <TimeTableHeader 
        activeCategory={activeCategory} 
        onCategoryChange={onCategoryChange}
      />
      
      <ScrollArea className="h-[60vh]">
        <TimeTableContent
          activeCategory={activeCategory}
          sortedDogs={sortedDogs}
          timeSlots={timeSlots}
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
        />
      </ScrollArea>
      
      <TimeTableFooter onRefresh={onRefresh} />
    </div>
  );
};

export default ActiveTabContent;
