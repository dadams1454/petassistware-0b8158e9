
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
  initialCategory = 'feeding'
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
          hasCareLogged={hasCareLogged}
          hasObservation={hasObservation}
          getObservationDetails={getObservationDetails}
          onCellClick={memoizedCellClickHandler}
          onCellContextMenu={handleCellContextMenu}
          onCareLogClick={handleCareLogClick}
          onDogClick={handleDogClick}
          onObservationClick={handleObservationClick}
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
