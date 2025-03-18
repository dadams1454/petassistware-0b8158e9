
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { DogCareStatus } from '@/types/dailyCare';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTimeSlots } from './hooks/useTimeSlots';
import usePottyBreakTable from './hooks/usePottyBreakTable';
import DogTimeTabs from './components/DogTimeTabs';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
}

const DogTimeTable: React.FC<DogTimeTableProps> = ({ dogsStatus, onRefresh }) => {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState('pottybreaks');
  const { timeSlots, currentHour } = useTimeSlots();
  
  // Use the potty break table hook for data management
  const { 
    isLoading, 
    sortedDogs, 
    hasPottyBreak, 
    hasCareLogged, 
    handleCellClick, 
    handleRefresh,
    hasObservation,
    addObservation,
    observations
  } = usePottyBreakTable(dogsStatus, onRefresh, activeCategory);
  
  return (
    <Card className="p-0 overflow-hidden">
      <DogTimeTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        isMobile={isMobile}
        sortedDogs={sortedDogs}
        timeSlots={timeSlots}
        hasPottyBreak={hasPottyBreak}
        hasCareLogged={hasCareLogged}
        onCellClick={handleCellClick}
        currentHour={currentHour}
        hasObservation={hasObservation}
        onAddObservation={addObservation}
        observations={observations}
      />
    </Card>
  );
};

export default DogTimeTable;
