
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import TimeTableContent from './TimeTableContent';

interface ActiveTabContentProps {
  activeCategory: string;
  sortedDogs: DogCareStatus[];
  timeSlots: string[];
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => { text: string; type: string; timeSlot?: string; category?: string } | null;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCellContextMenu: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onDogClick: (dogId: string) => void;
  onRefresh: () => void;
  currentHour?: number;
  isMobile: boolean;
  isCellActive?: (dogId: string, timeSlot: string, category: string) => boolean;
}

/**
 * Content for the active tab (pottybreaks or feeding)
 */
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
  currentHour,
  isMobile,
  isCellActive = () => false
}) => {
  return (
    <div className="relative overflow-x-auto">
      <TimeTableContent
        sortedDogs={sortedDogs}
        timeSlots={timeSlots}
        activeCategory={activeCategory}
        hasPottyBreak={hasPottyBreak}
        hasCareLogged={hasCareLogged}
        hasObservation={hasObservation}
        getObservationDetails={getObservationDetails}
        onCellClick={onCellClick}
        onCellContextMenu={onCellContextMenu}
        onCareLogClick={onCareLogClick}
        onDogClick={onDogClick}
        currentHour={currentHour}
        isMobile={isMobile}
        isCellActive={isCellActive}
      />
    </div>
  );
};

export default ActiveTabContent;
