
import React, { useState, useCallback, useRef } from 'react';
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
  
  // Track total clicks for debugging refresh issue
  const clickCountRef = useRef<number>(0);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
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
    console.log(`Tab changed to ${value}`);
    setActiveCategory(value);
  }, []);
  
  // Create a stable cell click handler with click tracking
  const memoizedCellClickHandler = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Increment click count
    clickCountRef.current += 1;
    const clickNumber = clickCountRef.current;
    
    // Log debug info
    console.log(`Cell clicked: ${clickNumber} times (${dogName}, ${timeSlot})`);
    setDebugInfo(`Last click: ${dogName} at ${timeSlot} (Click #${clickNumber})`);
    
    // Add extra protection to prevent refresh
    try {
      handleCellClick(dogId, dogName, timeSlot, category);
    } catch (error) {
      console.error('Error in cell click handler:', error);
      // Don't rethrow - contain the error
    }
    
    // Check if we're near the 6-click threshold
    if (clickNumber === 5) {
      console.log('⚠️ WARNING: Approaching 6 clicks - watch for refresh issue');
    }
    
    // Return false to prevent default behavior
    return false;
  }, [handleCellClick]);
  
  // Handle cell right-click for observations/notes with click tracking
  const handleCellContextMenu = useCallback((e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Prevent default context menu
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Right-clicked on cell:', dogId, dogName, timeSlot, category);
    return false;
  }, []);
  
  // Handle care log click with prevention
  const handleCareLogClick = useCallback((dogId: string, dogName: string) => {
    console.log('Care log clicked for:', dogId, dogName);
  }, []);

  // Error reset handler
  const handleErrorReset = useCallback(() => {
    console.log("Resetting after error");
    // Reset click counter
    clickCountRef.current = 0;
    setDebugInfo('Clicks reset after error');
    onRefresh();
  }, [onRefresh]);

  // Combine loading states
  const showLoading = isRefreshing || isLoading;

  return (
    <ErrorBoundary onReset={handleErrorReset} name="DogTimeTable">
      <div className="w-full space-y-4 relative">
        {/* Table actions with title and add group button */}
        <TableActions
          onAddGroup={() => setIsDialogOpen(true)}
          isRefreshing={showLoading}
          currentDate={currentDate}
        />

        {/* Debug info (only visible in development) */}
        {process.env.NODE_ENV !== 'production' && debugInfo && (
          <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2">
            Debug: {debugInfo} | Total clicks: {clickCountRef.current}
          </div>
        )}

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
                  e.stopPropagation();
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
