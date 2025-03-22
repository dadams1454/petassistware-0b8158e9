
import React, { useState, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CareCategories from './CareCategories';
import ActiveTabContent from './components/ActiveTabContent';
import useTimeManager from './components/TimeManager';
import usePottyBreakTable from './hooks/usePottyBreakTable';
import TableActions from './components/TableActions';
import AddGroupDialog from './components/AddGroupDialog';
import NoDogsState from './components/NoDogsState';
import TableLoadingOverlay from './components/TableLoadingOverlay';
import ErrorBoundary from '@/components/ErrorBoundary';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('pottybreaks');
  
  // Track tab change count for debugging
  const tabChangeCountRef = React.useRef<number>(0);
  
  // Use the time manager hook to get time slots and current hour
  const { timeSlots, currentHour } = useTimeManager(activeCategory);
  
  // Use the potty break table hook to get all the necessary data and handlers
  const {
    sortedDogs,
    hasPottyBreak,
    hasCareLogged,
    hasObservation,
    getObservationDetails,
    handleCellClick,
    handleRefresh,
    handleDogClick,
    isLoading
  } = usePottyBreakTable(dogsStatus, onRefresh, activeCategory, currentDate);
  
  // Safe tab change handler with logging
  const handleCategoryChange = useCallback((value: string) => {
    tabChangeCountRef.current += 1;
    console.log(`Tab changed to ${value} (change #${tabChangeCountRef.current})`);
    setActiveCategory(value);
  }, []);
  
  // Create a stable cell click handler
  const memoizedCellClickHandler = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    console.log(`Cell clicked: ${dogName}, ${timeSlot}, ${category}`);
    handleCellClick(dogId, dogName, timeSlot, category);
  }, [handleCellClick]);
  
  // Handle cell right-click for observations/notes
  const handleCellContextMenu = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Display a context menu or add observation
    console.log('Right-clicked on cell:', dogId, dogName, timeSlot, category);
  }, []);
  
  // Handle care log click
  const handleCareLogClick = useCallback((dogId: string, dogName: string) => {
    // Navigate to care log page or open care log dialog
    console.log('Care log clicked for:', dogId, dogName);
  }, []);

  // Error reset handler
  const handleErrorReset = useCallback(() => {
    console.log("Resetting after error");
    onRefresh();
  }, [onRefresh]);

  // Combine loading states
  const showLoading = isRefreshing || isLoading;

  return (
    <ErrorBoundary onReset={handleErrorReset}>
      <div className="w-full space-y-4 relative">
        {/* Table actions with title and add group button */}
        <TableActions
          onAddGroup={() => setIsDialogOpen(true)}
          isRefreshing={showLoading}
          currentDate={currentDate}
        />

        {/* Category Tabs */}
        <Tabs 
          defaultValue="pottybreaks" 
          value={activeCategory} 
          onValueChange={handleCategoryChange}
          className="w-full"
        >
          <TabsList>
            {CareCategories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id} 
                className="flex items-center"
                onClick={(e) => {
                  // Prevent default to avoid any navigation
                  e.preventDefault();
                }}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative table-refresh-transition">
          {/* Loading Overlay */}
          <TableLoadingOverlay isLoading={showLoading} />
          
          {dogsStatus.length > 0 ? (
            <ActiveTabContent
              activeCategory={activeCategory}
              sortedDogs={sortedDogs}
              timeSlots={timeSlots}
              hasPottyBreak={hasPottyBreak}
              hasCareLogged={hasCareLogged}
              hasObservation={hasObservation}
              getObservationDetails={getObservationDetails}
              onCellClick={memoizedCellClickHandler}
              onCellContextMenu={handleCellContextMenu}
              onCareLogClick={handleCareLogClick}
              onDogClick={handleDogClick}
              onRefresh={handleRefresh}
              currentHour={currentHour}
              isMobile={false}
            />
          ) : (
            <NoDogsState onRefresh={onRefresh} isRefreshing={showLoading} />
          )}
        </div>

        {/* Add Group Dialog */}
        <AddGroupDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    </ErrorBoundary>
  );
};

export default DogTimeTable;
