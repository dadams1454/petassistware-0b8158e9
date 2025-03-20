
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
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onRefresh: () => void;
  currentHour: number;
  isMobile: boolean;
}

const ActiveTabContent: React.FC<ActiveTabContentProps> = ({
  activeCategory,
  sortedDogs,
  timeSlots,
  hasPottyBreak,
  hasCareLogged,
  onCellClick,
  onCareLogClick,
  onRefresh,
  currentHour,
  isMobile
}) => {
  return (
    <TableContainer 
      dogs={sortedDogs}
      activeCategory={activeCategory}
      timeSlots={timeSlots}
      hasPottyBreak={hasPottyBreak}
      hasCareLogged={hasCareLogged}
      onCellClick={onCellClick}
      onCareLogClick={onCareLogClick}
      onRefresh={onRefresh}
    >
      <TimeTableContent 
        sortedDogs={sortedDogs}
        timeSlots={timeSlots}
        activeCategory={activeCategory}
        hasPottyBreak={hasPottyBreak}
        hasCareLogged={hasCareLogged}
        onCellClick={onCellClick}
        onCareLogClick={onCareLogClick}
        currentHour={currentHour}
        isMobile={isMobile}
      />
    </TableContainer>
  );
};

export default ActiveTabContent;
