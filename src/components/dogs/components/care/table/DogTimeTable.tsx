
import React, { useState, useCallback, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Card } from '@/components/ui/card';
import { TableActions } from './components/TableActions';
import CategoryTabs from './components/CategoryTabs';
import TimeTableContent from './components/TimeTableContent';
import ObservationDialogManager from './components/ObservationDialogManager';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTimeSlots } from './hooks/useTimeSlots';
import { useTableData } from './hooks/useTableData';
import { useTableInteractions } from './hooks/useTableInteractions';
import { useSortedDogs } from './hooks/useSortedDogs';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh: () => void;
  isRefreshing: boolean;
  currentDate: Date;
}

const DogTimeTable: React.FC<DogTimeTableProps> = ({ 
  dogsStatus, 
  onRefresh,
  isRefreshing,
  currentDate 
}) => {
  const isMobile = useIsMobile();
  
  // State for category and dialogs
  const [activeCategory, setActiveCategory] = useState('pottybreaks');
  const [observationDialogOpen, setObservationDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  
  // Get time slots for the current category
  const { timeSlots, isCurrentHourSlot } = useTimeSlots(activeCategory);
  
  // Get sorted dogs
  const { sortedDogs } = useSortedDogs(dogsStatus);
  
  // Fetch table data (potty breaks, care logs, observations)
  const { 
    pottyBreaks, 
    careLogs, 
    observations,
    isLoading,
    fetchData
  } = useTableData(dogsStatus, currentDate);
  
  // Set up table interactions
  const {
    handleCellClick,
    handleCellContextMenu,
    handleDogClick,
    submitObservation,
    hasObservation,
    getObservationDetails,
    isSubmitting
  } = useTableInteractions(
    () => fetchData(true),
    activeCategory
  );
  
  // Handle category change
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);
  
  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchData(true);
    onRefresh();
  }, [fetchData, onRefresh]);
  
  // Handle cell right-click to open observation dialog
  const handleObservationClick = useCallback((dogId: string) => {
    setSelectedDogId(dogId);
    setObservationDialogOpen(true);
  }, []);
  
  // Check if a dog has a potty break or care logged for a time slot
  const hasPottyBreak = useCallback((dogId: string, timeSlot: string): boolean => {
    return pottyBreaks[dogId]?.includes(timeSlot) || false;
  }, [pottyBreaks]);
  
  const hasCareLogged = useCallback((dogId: string, timeSlot: string): boolean => {
    return careLogs[dogId]?.includes(timeSlot) || false;
  }, [careLogs]);
  
  // Check if a dog has an observation for a time slot
  const hasObservationForTimeSlot = useCallback((dogId: string, timeSlot: string): boolean => {
    const dogObservations = observations[dogId] || [];
    
    return dogObservations.some(obs => {
      // For the right category
      const categoryMatch = activeCategory === 'feeding' 
        ? obs.category === 'feeding_observation'
        : obs.category === 'observation';
        
      // And the right time slot
      return categoryMatch && obs.timeSlot === timeSlot;
    });
  }, [observations, activeCategory]);
  
  // Find the selected dog
  const selectedDog = dogsStatus.find(dog => dog.dog_id === selectedDogId);
  
  // Combined loading state
  const showLoading = isRefreshing || isLoading;
  
  return (
    <ErrorBoundary name="DogTimeTable">
      <div className="w-full space-y-4 relative">
        {/* Table actions row */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {activeCategory === 'pottybreaks' ? 'Potty Break Tracker' : 'Feeding Schedule'}
          </h3>
          <TableActions 
            activeCategory={activeCategory}
            isRefreshing={showLoading}
            onRefresh={handleRefresh}
          />
        </div>
        
        {/* Category tabs */}
        <CategoryTabs 
          activeCategory={activeCategory} 
          onValueChange={handleCategoryChange} 
        />
        
        {/* Table content */}
        <Card className="overflow-hidden">
          <TimeTableContent
            activeCategory={activeCategory}
            sortedDogs={sortedDogs}
            timeSlots={timeSlots}
            hasPottyBreak={hasPottyBreak}
            hasCareLogged={hasCareLogged}
            hasObservation={hasObservationForTimeSlot}
            getObservationDetails={(dogId) => getObservationDetails(observations, dogId, activeCategory)}
            onCellClick={handleCellClick}
            onCellContextMenu={handleCellContextMenu}
            onDogClick={handleDogClick}
            onObservationClick={handleObservationClick}
            isCurrentHourSlot={isCurrentHourSlot}
            isLoading={showLoading}
          />
        </Card>
        
        {/* Observation dialog */}
        <ObservationDialogManager
          selectedDog={selectedDog}
          observationDialogOpen={observationDialogOpen}
          onOpenChange={setObservationDialogOpen}
          onSubmit={submitObservation}
          observations={observations}
          timeSlots={timeSlots}
          isMobile={isMobile}
          activeCategory={activeCategory}
        />
      </div>
    </ErrorBoundary>
  );
};

export default DogTimeTable;
