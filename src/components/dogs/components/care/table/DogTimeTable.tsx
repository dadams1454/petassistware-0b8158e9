
import React, { useState, useMemo, useEffect } from 'react';
import TimeTableHeader from './components/TimeTableHeader';
import TimeTableContent from './components/TimeTableContent';
import TimeTableFooter from './components/TimeTableFooter';
import { DogCareStatus } from '@/types/dailyCare';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TableContainer from './components/TableContainer';
import usePottyBreakTable from './hooks/usePottyBreakTable';
import { useIsMobile } from '@/hooks/use-mobile';

// Create timeslots array once, not on every render
const createTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour <= 22; hour++) {
    const displayHour = hour > 12 ? hour - 12 : hour;
    const amPm = hour >= 12 ? 'PM' : 'AM';
    slots.push(`${displayHour}:00 ${amPm}`);
  }
  return slots;
};

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
}

const DogTimeTable: React.FC<DogTimeTableProps> = ({ dogsStatus, onRefresh }) => {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState('pottybreaks');
  const timeSlots = useMemo(() => createTimeSlots(), []);
  
  // Get current hour
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());
  
  // Update current hour every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000); // 60000ms = 1 minute
    
    return () => clearInterval(intervalId);
  }, []);
  
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
  
  // Memo-ize the timeslot headers to prevent re-renders
  const timeSlotHeaders = useMemo(() => {
    return timeSlots.map(slot => {
      const [hours, minutesPart] = slot.split(':');
      const [minutes, period] = minutesPart.split(' ');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      return {
        slot,
        isCurrent: hour === currentHour
      };
    });
  }, [timeSlots, currentHour]);
  
  // Handle care log button click - redirect to individual dog care page
  const handleCareLogClick = (dogId: string, dogName: string) => {
    console.log(`Redirecting to care logs for ${dogName} (ID: ${dogId})`);
    // Here you would typically navigate to the dog's care page
    // For now, just log it
  };
  
  return (
    <Card className="p-0 overflow-hidden">
      <Tabs
        defaultValue="pottybreaks"
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="w-full"
      >
        <div className="p-3 bg-white dark:bg-slate-950/60 border-b border-gray-200 dark:border-gray-800">
          <TimeTableHeader 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory}
            isLoading={isLoading}
            onRefresh={handleRefresh} 
            isMobile={isMobile}
          />
        </div>
        
        <TabsContent value="pottybreaks" className="mt-0">
          <TableContainer 
            dogs={sortedDogs}
            activeCategory="pottybreaks"
            timeSlots={timeSlots}
            hasPottyBreak={hasPottyBreak}
            hasCareLogged={hasCareLogged}
            onCellClick={handleCellClick}
            onCareLogClick={handleCareLogClick}
            onRefresh={handleRefresh}
          >
            <TimeTableContent 
              sortedDogs={sortedDogs}
              timeSlots={timeSlots}
              activeCategory="pottybreaks"
              hasPottyBreak={hasPottyBreak}
              hasCareLogged={hasCareLogged}
              onCellClick={handleCellClick}
              onCareLogClick={handleCareLogClick}
              currentHour={currentHour}
              hasObservation={hasObservation}
              onAddObservation={addObservation}
              observations={observations}
              isMobile={isMobile}
            />
          </TableContainer>
        </TabsContent>
        
        <TabsContent value="feeding" className="mt-0">
          <TableContainer 
            dogs={sortedDogs}
            activeCategory="feeding"
            timeSlots={timeSlots}
            hasPottyBreak={hasPottyBreak}
            hasCareLogged={hasCareLogged}
            onCellClick={handleCellClick}
            onCareLogClick={handleCareLogClick}
            onRefresh={handleRefresh}
          >
            <TimeTableContent 
              sortedDogs={sortedDogs}
              timeSlots={timeSlots}
              activeCategory="feeding"
              hasPottyBreak={hasPottyBreak}
              hasCareLogged={hasCareLogged}
              onCellClick={handleCellClick}
              onCareLogClick={handleCareLogClick}
              currentHour={currentHour}
              hasObservation={hasObservation}
              onAddObservation={addObservation}
              observations={observations}
              isMobile={isMobile}
            />
          </TableContainer>
        </TabsContent>
        
        <TabsContent value="medications" className="mt-0">
          <TableContainer 
            dogs={sortedDogs}
            activeCategory="medications"
            timeSlots={timeSlots}
            hasPottyBreak={hasPottyBreak}
            hasCareLogged={hasCareLogged}
            onCellClick={handleCellClick}
            onCareLogClick={handleCareLogClick}
            onRefresh={handleRefresh}
          >
            <TimeTableContent 
              sortedDogs={sortedDogs}
              timeSlots={timeSlots}
              activeCategory="medications"
              hasPottyBreak={hasPottyBreak}
              hasCareLogged={hasCareLogged}
              onCellClick={handleCellClick}
              onCareLogClick={handleCareLogClick}
              currentHour={currentHour}
              hasObservation={hasObservation}
              onAddObservation={addObservation}
              observations={observations}
              isMobile={isMobile}
            />
          </TableContainer>
        </TabsContent>
        
        <TabsContent value="exercise" className="mt-0">
          <TableContainer 
            dogs={sortedDogs}
            activeCategory="exercise"
            timeSlots={timeSlots}
            hasPottyBreak={hasPottyBreak}
            hasCareLogged={hasCareLogged}
            onCellClick={handleCellClick}
            onCareLogClick={handleCareLogClick}
            onRefresh={handleRefresh}
          >
            <TimeTableContent 
              sortedDogs={sortedDogs}
              timeSlots={timeSlots}
              activeCategory="exercise"
              hasPottyBreak={hasPottyBreak}
              hasCareLogged={hasCareLogged}
              onCellClick={handleCellClick}
              onCareLogClick={handleCareLogClick}
              currentHour={currentHour}
              hasObservation={hasObservation}
              onAddObservation={addObservation}
              observations={observations}
              isMobile={isMobile}
            />
          </TableContainer>
        </TabsContent>
        
        <div className="p-2 bg-gray-50 dark:bg-slate-900/60 border-t border-gray-200 dark:border-gray-800">
          <TimeTableFooter
            isLoading={isLoading}
            onRefresh={handleRefresh}
            lastUpdateTime={new Date().toLocaleTimeString()}
          />
        </div>
      </Tabs>
    </Card>
  );
};

export default DogTimeTable;
