
import React, { useState, useCallback, useMemo } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import usePottyBreakTable from './hooks/usePottyBreakTable';
import { useIsMobile } from '@/hooks/use-mobile';
import ActiveTabContent from './components/ActiveTabContent';
import ObservationDialogManager from './components/ObservationDialogManager';
import { useTimeManager } from './components/TimeManager';
import { useToast } from '@/components/ui/use-toast';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
  currentDate?: Date;
}

const DogTimeTable: React.FC<DogTimeTableProps> = ({ 
  dogsStatus, 
  onRefresh,
  currentDate = new Date() 
}) => {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState('pottybreaks');
  const previousCategoryRef = React.useRef('pottybreaks');
  const { toast } = useToast();
  
  // State for observation dialog
  const [observationDialogOpen, setObservationDialogOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState<DogCareStatus | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  // Use the time manager hook with activeCategory
  const { currentHour, timeSlots } = useTimeManager(activeCategory);
  
  // Use the potty break table hook for data management - with memoized initialization
  const { 
    isLoading, 
    sortedDogs, 
    hasPottyBreak, 
    hasCareLogged,
    hasObservation,
    getObservationDetails,
    addObservation,
    observations,
    handleCellClick, 
    handleRefresh,
    handleDogClick
  } = usePottyBreakTable(dogsStatus, onRefresh, activeCategory, currentDate);

  // Memoized category change handler for performance
  const handleCategoryChange = useCallback((newCategory: string) => {
    console.log(`🔄 Category changing from ${activeCategory} to ${newCategory}`);
    previousCategoryRef.current = activeCategory;
    setActiveCategory(newCategory);
    
    // Minimal refresh when switching tabs
    setTimeout(() => {
      handleRefresh();
      
      // Show toast when switching to feeding tab - only once per session
      if (newCategory === 'feeding' && previousCategoryRef.current !== 'feeding') {
        toast({
          title: "Feeding Management",
          description: "Click a time slot to toggle whether a dog has been fed.",
        });
      }
    }, 50);
  }, [activeCategory, handleRefresh, toast]);
  
  // Memoized cell context menu handler
  const handleCellContextMenu = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    console.log(`Opening observation dialog for ${dogName} (ID: ${dogId}) at ${timeSlot} for ${category}`);
    const dog = sortedDogs.find(d => d.dog_id === dogId);
    if (dog) {
      setSelectedDog(dog);
      setSelectedTimeSlot(timeSlot);
      setObservationDialogOpen(true);
    }
  }, [sortedDogs]);
  
  // Memoized care log click handler
  const handleCareLogClick = useCallback((dogId: string, dogName: string) => {
    console.log(`Opening observation dialog for ${dogName} (ID: ${dogId})`);
    const dog = sortedDogs.find(d => d.dog_id === dogId);
    if (dog) {
      setSelectedDog(dog);
      setSelectedTimeSlot('');
      setObservationDialogOpen(true);
    }
  }, [sortedDogs]);
  
  // Memoized observation submission handler
  const handleObservationSubmit = useCallback(async (
    dogId: string, 
    observation: string, 
    observationType: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
    timestamp?: Date
  ) => {
    // For feeding observations, use the category 'feeding_observation'
    const category = activeCategory === 'feeding' ? 'feeding_observation' : 'observation';
    
    await addObservation(
      dogId, 
      observation, 
      observationType, 
      selectedTimeSlot, 
      category,
      timestamp || new Date()
    );
    handleRefresh();
  }, [activeCategory, addObservation, handleRefresh, selectedTimeSlot]);
  
  // Reduced effect dependency to prevent excessive refreshes
  React.useEffect(() => {
    console.log(`🚀 DogTimeTable mounted or tab changed to ${activeCategory}`);
    handleRefresh();
  }, [activeCategory, handleRefresh]);
  
  // Memoize header and content components
  const timeTableHeader = useMemo(() => (
    <TimeTableHeader 
      activeCategory={activeCategory} 
      onCategoryChange={handleCategoryChange}
      isLoading={isLoading}
      onRefresh={handleRefresh} 
      isMobile={isMobile}
      currentDate={currentDate}
    />
  ), [activeCategory, handleCategoryChange, isLoading, handleRefresh, isMobile, currentDate]);
  
  const timeTableFooter = useMemo(() => (
    <TimeTableFooter
      isLoading={isLoading}
      onRefresh={handleRefresh}
      lastUpdateTime={new Date().toLocaleTimeString()}
      currentDate={currentDate}
    />
  ), [isLoading, handleRefresh, currentDate]);
  
  return (
    <Card className="p-0 overflow-hidden">
      <Tabs
        defaultValue="pottybreaks"
        value={activeCategory}
        onValueChange={handleCategoryChange}
        className="w-full"
      >
        <div className="p-3 bg-white dark:bg-slate-950/60 border-b border-gray-200 dark:border-gray-800">
          {timeTableHeader}
        </div>
        
        <TabsContent value="pottybreaks" className="mt-0">
          <ActiveTabContent
            activeCategory="pottybreaks"
            sortedDogs={sortedDogs}
            timeSlots={timeSlots}
            hasPottyBreak={hasPottyBreak}
            hasCareLogged={hasCareLogged}
            hasObservation={hasObservation}
            getObservationDetails={getObservationDetails}
            onCellClick={handleCellClick}
            onCellContextMenu={handleCellContextMenu}
            onCareLogClick={handleCareLogClick}
            onDogClick={handleDogClick}
            onRefresh={handleRefresh}
            currentHour={currentHour}
            isMobile={isMobile}
          />
        </TabsContent>
        
        <TabsContent value="feeding" className="mt-0">
          <ActiveTabContent
            activeCategory="feeding"
            sortedDogs={sortedDogs}
            timeSlots={timeSlots}
            hasPottyBreak={hasPottyBreak}
            hasCareLogged={hasCareLogged}
            hasObservation={hasObservation}
            getObservationDetails={getObservationDetails}
            onCellClick={handleCellClick}
            onCellContextMenu={handleCellContextMenu}
            onCareLogClick={handleCareLogClick}
            onDogClick={handleDogClick}
            onRefresh={handleRefresh}
            currentHour={currentHour}
            isMobile={isMobile}
          />
        </TabsContent>
        
        <div className="p-2 bg-gray-50 dark:bg-slate-900/60 border-t border-gray-200 dark:border-gray-800">
          {timeTableFooter}
        </div>
      </Tabs>
      
      {/* Observation Dialog */}
      <ObservationDialogManager
        selectedDog={selectedDog}
        observationDialogOpen={observationDialogOpen}
        onOpenChange={setObservationDialogOpen}
        onSubmit={handleObservationSubmit}
        observations={observations}
        timeSlots={timeSlots}
        isMobile={isMobile}
        activeCategory={activeCategory}
        selectedTimeSlot={selectedTimeSlot}
      />
    </Card>
  );
};

// Import TimeTableHeader and TimeTableFooter
import TimeTableHeader from './components/TimeTableHeader';
import TimeTableFooter from './components/TimeTableFooter';

export default React.memo(DogTimeTable);
