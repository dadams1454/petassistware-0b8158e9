
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import TableContainer from './TableContainer';
import TimeTableContent from './TimeTableContent';

interface TimeTableTabContentProps {
  activeCategory: string;
  tabValue: string;
  sortedDogs: any[];
  timeSlots: string[];
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onRefresh: () => void;
  currentHour: number;
  hasObservation: (dogId: string) => boolean;
  onAddObservation: (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'other') => Promise<void>;
  observations: Record<string, Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
  }>>;
  isMobile: boolean;
}

const TimeTableTabContent: React.FC<TimeTableTabContentProps> = ({
  activeCategory,
  tabValue,
  sortedDogs,
  timeSlots,
  hasPottyBreak,
  hasCareLogged,
  onCellClick,
  onRefresh,
  currentHour,
  hasObservation,
  onAddObservation,
  observations,
  isMobile
}) => {
  return (
    <TabsContent value={tabValue} className="mt-0">
      <TableContainer 
        dogs={sortedDogs}
        activeCategory={tabValue}
        timeSlots={timeSlots}
        hasPottyBreak={hasPottyBreak}
        hasCareLogged={hasCareLogged}
        onCellClick={onCellClick}
        onRefresh={onRefresh}
        hasObservation={hasObservation}
        onAddObservation={onAddObservation}
        observations={observations}
      >
        <TimeTableContent 
          sortedDogs={sortedDogs}
          timeSlots={timeSlots}
          activeCategory={tabValue}
          hasPottyBreak={hasPottyBreak}
          hasCareLogged={hasCareLogged}
          onCellClick={onCellClick}
          currentHour={currentHour}
          hasObservation={hasObservation}
          onAddObservation={onAddObservation}
          observations={observations}
          isMobile={isMobile}
        />
      </TableContainer>
    </TabsContent>
  );
};

export default TimeTableTabContent;
