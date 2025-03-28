
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import AddGroupDialog from './components/AddGroupDialog';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useTimeTableState } from './hooks/useTimeTableState';
import TableActions from './components/TableActions';
import DebugInfoPanel from './components/DebugInfoPanel';
import TableContentManager from './components/TableContentManager';
import ObservationDialogManager from './components/ObservationDialogManager';
import { useIsMobile } from '@/hooks/use-mobile';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh: () => void;
  isRefreshing: boolean;
  currentDate: Date;
  hideTopLevelTabs?: boolean;
  initialCategory?: string;
}

const DogTimeTable: React.FC<DogTimeTableProps> = ({ 
  dogsStatus, 
  onRefresh,
  isRefreshing,
  currentDate,
  hideTopLevelTabs = false,
  initialCategory = 'feeding' // Changed default from pottybreaks to feeding
}) => {
  const isMobile = useIsMobile();
  
  const {
    isDialogOpen,
    setIsDialogOpen,
    activeCategory,
    debugInfo,
    clickCountRef,
    errorCountRef,
    sortedDogs,
    hasPottyBreak,
    hasCareLogged,
    hasObservation,
    getObservationDetails,
    handleDogClick,
    handleCategoryChange,
    memoizedCellClickHandler,
    handleCellContextMenu,
    handleCareLogClick,
    handleErrorReset,
    handleRefresh,
    showLoading,
    selectedDogId,
    setSelectedDogId,
    observationDialogOpen,
    setObservationDialogOpen,
    observations,
    handleObservationClick,
    handleObservationSubmit,
    timeSlots
  } = useTimeTableState(dogsStatus || [], onRefresh, isRefreshing, currentDate, initialCategory);

  // Find the selected dog based on selectedDogId, with safeguards for undefined arrays
  const selectedDog = dogsStatus && Array.isArray(dogsStatus) 
    ? dogsStatus.find(dog => dog.dog_id === selectedDogId) 
    : undefined;
    
  // Extract the observations for the selected dog as an array
  const selectedDogObservations = selectedDog && observations && selectedDogId 
    ? observations[selectedDogId] || [] 
    : [];

  // Create wrapper functions to bridge type differences between the hooks and components
  const hasPottyBreakWrapper = (dogId: string, hour: number): boolean => {
    // Convert hour to timeSlot string format if needed
    const timeSlot = timeSlots && timeSlots[hour] ? timeSlots[hour] : '';
    return hasPottyBreak(dogId, timeSlot);
  };

  const hasCareLoggedWrapper = (dogId: string, hour: number): boolean => {
    const timeSlot = timeSlots && timeSlots[hour] ? timeSlots[hour] : '';
    return hasCareLogged(dogId, timeSlot, activeCategory);
  };

  const hasObservationWrapper = (dogId: string, hour: number): boolean => {
    const timeSlot = timeSlots && timeSlots[hour] ? timeSlots[hour] : '';
    return hasObservation(dogId, timeSlot);
  };

  const getObservationDetailsWrapper = (dogId: string, hour: number): any => {
    return getObservationDetails(dogId, activeCategory);
  };

  const onCellClickWrapper = (dogId: string, hour: number): void => {
    // Get the dog from the array
    const dog = sortedDogs.find(d => d.dog_id === dogId);
    if (!dog) return;
    
    const timeSlot = timeSlots && timeSlots[hour] ? timeSlots[hour] : '';
    memoizedCellClickHandler(dogId, dog.dog_name, timeSlot, activeCategory);
  };

  const onCellContextMenuWrapper = (event: React.MouseEvent, dogId: string, hour: number): void => {
    // Get the dog from the array
    const dog = sortedDogs.find(d => d.dog_id === dogId);
    if (!dog) return;
    
    const timeSlot = timeSlots && timeSlots[hour] ? timeSlots[hour] : '';
    handleCellContextMenu(event, dogId, dog.dog_name, timeSlot, activeCategory);
  };

  const onCareLogClickWrapper = (dogId: string): void => {
    // Get the dog from the array
    const dog = sortedDogs.find(d => d.dog_id === dogId);
    if (!dog) return;
    
    handleCareLogClick(dogId, dog.dog_name);
  };

  const onObservationClickWrapper = (dogId: string, hour: number): void => {
    // Get the dog from the array
    const dog = sortedDogs.find(d => d.dog_id === dogId);
    if (!dog) return;
    
    handleObservationClick(dogId, dog.dog_name);
  };

  return (
    <ErrorBoundary onReset={handleErrorReset} name="DogTimeTable">
      <div className="w-full space-y-4 relative" onClick={(e) => e.stopPropagation()}>
        {/* Table actions with title and add group button */}
        <TableActions
          onAddGroup={() => setIsDialogOpen(true)}
          isRefreshing={showLoading}
          currentDate={currentDate}
          activeCategory={activeCategory}
          hideTopLevelTabs={hideTopLevelTabs}
        />

        {/* Enhanced Debug info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <DebugInfoPanel 
            debugInfo={debugInfo}
            clickCount={clickCountRef.current}
            errorCount={errorCountRef.current}
            activeCategory={activeCategory}
          />
        )}

        {/* Table Content */}
        <TableContentManager 
          activeCategory={activeCategory}
          dogsStatus={dogsStatus || []} 
          sortedDogs={sortedDogs || []} 
          hasPottyBreak={hasPottyBreakWrapper}
          hasCareLogged={hasCareLoggedWrapper}
          hasObservation={hasObservationWrapper}
          getObservationDetails={getObservationDetailsWrapper}
          onCellClick={onCellClickWrapper}
          onCellContextMenu={onCellContextMenuWrapper}
          onCareLogClick={onCareLogClickWrapper}
          onDogClick={handleDogClick}
          onObservationClick={onObservationClickWrapper}
          onRefresh={handleRefresh}
          onCategoryChange={handleCategoryChange}
          showLoading={showLoading}
          hideTopLevelTabs={hideTopLevelTabs}
          timeSlots={timeSlots}
        />

        {/* Add Group Dialog */}
        <AddGroupDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
        
        {/* Observation Dialog */}
        <ObservationDialogManager 
          selectedDog={selectedDog}
          observationDialogOpen={observationDialogOpen}
          onOpenChange={setObservationDialogOpen}
          onSubmit={handleObservationSubmit}
          observations={selectedDogObservations} 
          timeSlots={timeSlots || []} 
          isMobile={isMobile}
          activeCategory={activeCategory}
        />
      </div>
    </ErrorBoundary>
  );
};

export default DogTimeTable;
