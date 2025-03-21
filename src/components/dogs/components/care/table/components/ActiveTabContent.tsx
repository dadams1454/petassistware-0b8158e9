
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import TimeTableContent from './TimeTableContent';
import TableContainer from './TableContainer';

interface ActiveTabContentProps {
  activeCategory: string;
  sortedDogs: DogCareStatus[];
  timeSlots: string[];
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => { text: string; type: string } | null;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCellContextMenu: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onDogClick: (dogId: string) => void;
  onRefresh: () => void;
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
  onRefresh,
  currentHour,
  isMobile = false
}) => {
  return (
    <TableContainer 
      activeCategory={activeCategory}
      dogsCount={sortedDogs.length}
      isMobile={isMobile}
      onRefresh={onRefresh}
    >
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
      />
    </TableContainer>
  );
};

export default ActiveTabContent;
