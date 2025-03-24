
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import TimeTableContent from './TimeTableContent';
import TimeTableHeader from './TimeTableHeader';
import TimeTableFooter from './TimeTableFooter';
import TableContainer from './TableContainer';
import { Card } from '@/components/ui/card';

interface ActiveTabContentProps {
  activeCategory: string;
  sortedDogs: DogCareStatus[];
  timeSlots: string[];
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => { text: string; type: string } | null;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCellContextMenu: (e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onDogClick: (dogId: string) => void;
  onObservationClick: (dogId: string, dogName: string) => void;
  onRefresh: () => void;
  onCategoryChange?: (category: string) => void;
  currentHour?: number;
  isMobile?: boolean;
  isPendingFeeding?: (dogId: string, timeSlot: string) => boolean;
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
  onCategoryChange,
  currentHour,
  isMobile = false,
  isPendingFeeding = () => false
}) => {
  return (
    <Card className="border p-0 overflow-hidden">
      <TimeTableHeader 
        activeCategory={activeCategory} 
        onCategoryChange={onCategoryChange}
      />
      
      <TableContainer>
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
          onObservationClick={onObservationClick}
          currentHour={currentHour}
          isMobile={isMobile}
          isPendingFeeding={isPendingFeeding}
        />
      </TableContainer>
      
      <TimeTableFooter 
        onRefresh={onRefresh} 
        activeCategory={activeCategory} 
      />
    </Card>
  );
};

export default ActiveTabContent;
