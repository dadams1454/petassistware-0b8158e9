
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
import { generateTimeSlots } from './dogGroupColors';
import ObservationDialog from './components/ObservationDialog';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
}

const DogTimeTable: React.FC<DogTimeTableProps> = ({ dogsStatus, onRefresh }) => {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState('pottybreaks');
  
  // State for observation dialog
  const [observationDialogOpen, setObservationDialogOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState<DogCareStatus | null>(null);
  
  // Get current time and hour
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [currentHour, setCurrentHour] = useState<number>(currentTime.getHours());
  
  // Generate timeSlots based on current time
  const timeSlots = useMemo(() => {
    return generateTimeSlots(currentTime);
  }, [currentTime]);
  
  // Update current time and hour every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setCurrentHour(now.getHours());
    }, 60000); // 60000ms = 1 minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Use the potty break table hook for data management
  const { 
    isLoading, 
    sortedDogs, 
    hasPottyBreak, 
    hasCareLogged, 
    hasObservation,
    addObservation,
    observations,
    handleCellClick, 
    handleRefresh
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
  
  // Handle care log button click - open observation dialog for dog
  const handleCareLogClick = (dogId: string, dogName: string) => {
    console.log(`Opening observation dialog for ${dogName} (ID: ${dogId})`);
    const dog = sortedDogs.find(d => d.dog_id === dogId);
    if (dog) {
      setSelectedDog(dog);
      setObservationDialogOpen(true);
    }
  };
  
  // Handle observation submission
  const handleObservationSubmit = async (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'other') => {
    await addObservation(dogId, observation, observationType);
    handleRefresh();
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
      
      {/* Observation Dialog */}
      {selectedDog && (
        <ObservationDialog
          open={observationDialogOpen}
          onOpenChange={setObservationDialogOpen}
          dogId={selectedDog.dog_id}
          dogName={selectedDog.dog_name}
          onSubmit={handleObservationSubmit}
          existingObservations={observations[selectedDog.dog_id]?.map(obs => ({
            observation: obs.observation,
            observation_type: obs.observation_type,
            created_at: obs.created_at
          })) || []}
          isMobile={isMobile}
        />
      )}
    </Card>
  );
};

export default DogTimeTable;
