import React, { useState, useEffect } from 'react';
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
  
  // Auto-refresh the data every 5 minutes to keep it fresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (handleRefresh) {
        console.log('Auto-refreshing potty break data...');
        handleRefresh();
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(intervalId);
  }, [handleRefresh]);
  
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
