
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import AddGroupDialog from './components/AddGroupDialog';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useTimeTableState } from './hooks/useTimeTableState';
import TableActions from './components/TableActions';
import DebugInfoPanel from './components/DebugInfoPanel';
import CategoryTabs from './components/CategoryTabs';
import TableContentManager from './components/TableContentManager';

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
    handleSafeDogClick,
    handleCategoryChange,
    memoizedCellClickHandler,
    handleCellContextMenu,
    handleCareLogClick,
    handleErrorReset,
    handleRefresh,
    showLoading
  } = useTimeTableState(dogsStatus, onRefresh, isRefreshing, currentDate);

  return (
    <ErrorBoundary onReset={handleErrorReset} name="DogTimeTable">
      <div className="w-full space-y-4 relative" onClick={(e) => e.stopPropagation()}>
        {/* Table actions with title and add group button */}
        <TableActions
          onAddGroup={() => setIsDialogOpen(true)}
          isRefreshing={showLoading}
          currentDate={currentDate}
        />

        {/* Enhanced Debug info (always visible during bugfix) */}
        <DebugInfoPanel 
          debugInfo={debugInfo}
          clickCount={clickCountRef.current}
          errorCount={errorCountRef.current}
          activeCategory={activeCategory}
        />

        {/* Category Tabs */}
        <CategoryTabs 
          activeCategory={activeCategory} 
          onValueChange={handleCategoryChange} 
        />

        {/* Table Content */}
        <TableContentManager 
          activeCategory={activeCategory}
          dogsStatus={dogsStatus}
          sortedDogs={sortedDogs}
          hasPottyBreak={hasPottyBreak}
          hasCareLogged={hasCareLogged}
          hasObservation={hasObservation}
          getObservationDetails={getObservationDetails}
          onCellClick={memoizedCellClickHandler}
          onCellContextMenu={handleCellContextMenu}
          onCareLogClick={handleCareLogClick}
          onDogClick={handleSafeDogClick}
          onRefresh={handleRefresh}
          showLoading={showLoading}
        />

        {/* Add Group Dialog */}
        <AddGroupDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    </ErrorBoundary>
  );
};

export default DogTimeTable;
