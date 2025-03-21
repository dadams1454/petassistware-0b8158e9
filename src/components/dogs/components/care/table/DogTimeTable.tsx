
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import usePottyBreakTable from './hooks/usePottyBreakTable';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/components/ui/use-toast';

// Import our refactored components
import ActiveTabContent from './components/ActiveTabContent';
import ObservationDialogManager from './components/ObservationDialogManager';
import TimeTableHeader from './components/TimeTableHeader';
import TimeTableFooter from './components/TimeTableFooter';
import { TimeManagerProvider, useTimeManager } from './components/TimeManager';

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

  // Memoize the sorted dogs to prevent unnecessary re-renders
  const memoizedSortedDogs = useMemo(() => {
    // Ensure care_logs is defined for each dog, defaulting to empty array if missing
    return sortedDogs.map(dog => ({
      ...dog,
      care_logs: dog.care_logs || []
    }));
  }, [sortedDogs]);
  
  const observationsArray = useMemo(() => Array.isArray(observations) ? observations : [], [observations]);

  // Handle category change with optimized state updates
  const handleCategoryChange = useCallback((newCategory: string) => {
    if (newCategory === activeCategory) return;
    
    console.log(`🔄 Category changing from ${activeCategory} to ${newCategory}`);
    previousCategoryRef.current = activeCategory;
    setActiveCategory(newCategory);
    
    // Only show toast when switching to feeding tab
    if (newCategory === 'feeding' && previousCategoryRef.current !== 'feeding') {
      toast({
        title: "Feeding Management",
        description: "Click a time slot to toggle whether a dog has been fed.",
      });
    }
  }, [activeCategory, toast]);
  
  // Handle cell right-click (context menu) for observations
  const handleCellContextMenu = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    console.log(`Opening observation dialog for ${dogName} (ID: ${dogId}) at ${timeSlot} for ${category}`);
    const dog = sortedDogs.find(d => d.dog_id === dogId);
    if (dog) {
      setSelectedDog({
        ...dog,
        care_logs: dog.care_logs || [] // Ensure care_logs exists
      });
      setSelectedTimeSlot(timeSlot);
      setObservationDialogOpen(true);
    }
  }, [sortedDogs]);
  
  // Handle care log button click - open observation dialog for dog
  const handleCareLogClick = useCallback((dogId: string, dogName: string) => {
    console.log(`Opening observation dialog for ${dogName} (ID: ${dogId})`);
    const dog = sortedDogs.find(d => d.dog_id === dogId);
    if (dog) {
      setSelectedDog({
        ...dog,
        care_logs: dog.care_logs || [] // Ensure care_logs exists
      });
      setSelectedTimeSlot('');
      setObservationDialogOpen(true);
    }
  }, [sortedDogs]);
  
  // Handle observation submission with optional timestamp
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
  
  return (
    <TimeManagerProvider activeCategory={activeCategory}>
      <DogTimeTableContent 
        activeCategory={activeCategory}
        sortedDogs={memoizedSortedDogs}
        observations={observationsArray}
        isLoading={isLoading}
        handleCategoryChange={handleCategoryChange}
        handleRefresh={handleRefresh}
        handleCellClick={handleCellClick}
        handleCellContextMenu={handleCellContextMenu}
        handleCareLogClick={handleCareLogClick}
        handleObservationSubmit={handleObservationSubmit}
        hasPottyBreak={hasPottyBreak}
        hasCareLogged={hasCareLogged}
        hasObservation={hasObservation}
        getObservationDetails={getObservationDetails}
        handleDogClick={handleDogClick}
        isCellActive={isCellActive}
        isMobile={isMobile}
        observationDialogOpen={observationDialogOpen}
        setObservationDialogOpen={setObservationDialogOpen}
        selectedDog={selectedDog}
        selectedTimeSlot={selectedTimeSlot}
        currentDate={currentDate}
      />
    </TimeManagerProvider>
  );
};

// Separate the content component with React.memo to prevent unnecessary re-renders
const DogTimeTableContent = React.memo<{
  activeCategory: string;
  sortedDogs: DogCareStatus[];
  observations: any[];
  isLoading: boolean;
  handleCategoryChange: (category: string) => void;
  handleRefresh: () => void;
  handleCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  handleCellContextMenu: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  handleCareLogClick: (dogId: string, dogName: string) => void;
  handleObservationSubmit: (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other', timestamp?: Date) => Promise<void>;
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => { text: string; type: string; timeSlot?: string; category?: string } | null;
  handleDogClick: (dogId: string) => void;
  isCellActive: (dogId: string, timeSlot: string, category: string) => boolean;
  isMobile: boolean;
  observationDialogOpen: boolean;
  setObservationDialogOpen: (open: boolean) => void;
  selectedDog: DogCareStatus | null;
  selectedTimeSlot: string;
  currentDate: Date;
}>(({
  activeCategory,
  sortedDogs,
  observations,
  isLoading,
  handleCategoryChange,
  handleRefresh,
  handleCellClick,
  handleCellContextMenu,
  handleCareLogClick,
  handleObservationSubmit,
  hasPottyBreak,
  hasCareLogged,
  hasObservation,
  getObservationDetails,
  handleDogClick,
  isCellActive,
  isMobile,
  observationDialogOpen,
  setObservationDialogOpen,
  selectedDog,
  selectedTimeSlot,
  currentDate
}) => {
  const { currentHour, timeSlots } = useTimeManager();
  
  return (
    <Card className="p-0 overflow-hidden transition-all duration-200">
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
        
        <TabsContent value="pottybreaks" className="mt-0 transition-opacity duration-200">
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
        
        <TabsContent value="feeding" className="mt-0 transition-opacity duration-200">
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
});

DogTimeTableContent.displayName = 'DogTimeTableContent';

export default DogTimeTable;
