
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
  hasCareLogged: (dogId: string, hour: number) => boolean;
  hasObservation: (dogId: string, hour: number) => boolean;
  getObservationDetails: (dogId: string, hour: number) => { text: string; type: string } | null;
  onCellClick: (dogId: string, hour: number) => void;
  onCellContextMenu: (e: React.MouseEvent, dogId: string, hour: number) => void;
  onCareLogClick: (dogId: string) => void;
  onDogClick: (dogId: string) => void;
  onObservationClick: (dogId: string, hour: number) => void;
  onRefresh: () => void;
  onCategoryChange?: (category: string) => void;
  currentHour?: number;
  isMobile?: boolean;
}

const ActiveTabContent: React.FC<ActiveTabContentProps> = ({
  activeCategory,
  sortedDogs,
  timeSlots,
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
}) => {
  return (
    <Card className="border p-0 overflow-hidden">
      <TimeTableHeader 
        activeCategory={activeCategory} 
        onCategoryChange={onCategoryChange || (() => {})}
      />
      
      <TableContainer 
        activeCategory={activeCategory}
        dogsCount={sortedDogs.length}
        onRefresh={onRefresh}
        isMobile={isMobile}
      >
        <TimeTableContent 
          sortedDogs={sortedDogs}
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
          currentHour={currentHour}
          isMobile={isMobile}
        />
      </TableContainer>
      
      <TimeTableFooter 
        onRefresh={onRefresh} 
        isLoading={false}
        currentDate={new Date()}
      />
    </Card>
  );
};

export default ActiveTabContent;
