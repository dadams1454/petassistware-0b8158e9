
import React, { useState } from 'react';
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
  
  // Use the potty break table hook for data management
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
    handleDogClick,
    isCellActive
  } = usePottyBreakTable(dogsStatus, onRefresh, activeCategory, currentDate);

  // Handle category change with cache cleanup
  const handleCategoryChange = (newCategory: string) => {
    console.log(`🔄 Category changing from ${activeCategory} to ${newCategory}`);
    previousCategoryRef.current = activeCategory;
    setActiveCategory(newCategory);
    
    // Force a refresh when switching tabs to ensure fresh data
    setTimeout(() => {
      console.log(`🔄 Forcing refresh after tab change to ${newCategory}`);
      handleRefresh();
      
      // Show toast when switching to feeding tab
      if (newCategory === 'feeding' && previousCategoryRef.current !== 'feeding') {
        toast({
          title: "Feeding Management",
          description: "Click a time slot to toggle whether a dog has been fed.",
        });
      }
    }, 50);
  };
  
  // Handle cell right-click (context menu) for observations
  const handleCellContextMenu = (dogId: string, dogName: string, timeSlot: string, category: string) => {
    console.log(`Opening observation dialog for ${dogName} (ID: ${dogId}) at ${timeSlot} for ${category}`);
    const dog = sortedDogs.find(d => d.dog_id === dogId);
    if (dog) {
      setSelectedDog(dog);
      setSelectedTimeSlot(timeSlot);
      setObservationDialogOpen(true);
    }
  };
  
  // Handle care log button click - open observation dialog for dog
  const handleCareLogClick = (dogId: string, dogName: string) => {
    console.log(`Opening observation dialog for ${dogName} (ID: ${dogId})`);
    const dog = sortedDogs.find(d => d.dog_id === dogId);
    if (dog) {
      setSelectedDog(dog);
      setSelectedTimeSlot('');
      setObservationDialogOpen(true);
    }
  };
  
  // Handle observation submission with optional timestamp
  const handleObservationSubmit = async (
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
  };
  
  // Force a refresh on initial load and when switching tabs
  React.useEffect(() => {
    console.log(`🚀 DogTimeTable mounted or tab changed to ${activeCategory}`);
    handleRefresh();
  }, [activeCategory, handleRefresh]);
  
  return (
    <Card className="p-0 overflow-hidden">
      <Tabs
        defaultValue="pottybreaks"
        value={activeCategory}
        onValueChange={handleCategoryChange}
        className="w-full"
      >
        <div className="p-3 bg-white dark:bg-slate-950/60 border-b border-gray-200 dark:border-gray-800">
          <TimeTableHeader 
            activeCategory={activeCategory} 
            onCategoryChange={handleCategoryChange}
            isLoading={isLoading}
            onRefresh={handleRefresh} 
            isMobile={isMobile}
            currentDate={currentDate}
          />
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
            isCellActive={isCellActive}
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
            isCellActive={isCellActive}
          />
        </TabsContent>
        
        <div className="p-2 bg-gray-50 dark:bg-slate-900/60 border-t border-gray-200 dark:border-gray-800">
          <TimeTableFooter
            isLoading={isLoading}
            onRefresh={handleRefresh}
            lastUpdateTime={new Date().toLocaleTimeString()}
            currentDate={currentDate}
          />
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

// We need to import TimeTableHeader and TimeTableFooter
import TimeTableHeader from './components/TimeTableHeader';
import TimeTableFooter from './components/TimeTableFooter';

export default DogTimeTable;
