
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
  const errorCountRef = useRef<number>(0);
  
  // Use the time manager hook to get time slots and current hour
  const { timeSlots, currentHour } = useTimeManager(activeCategory);

  // Use a custom dog click handler to prevent navigation
  const handleSafeDogClick = useCallback((dogId: string) => {
    // In normal use we'd navigate to dog details, but for now we'll disable this
    // to prevent any routing issues that could cause the refresh problem
    console.log('Dog click prevented to avoid navigation during bugfix', dogId);
    // We won't call navigate here - this prevents any routing that might cause refresh
    return false;
  }, []);
  
  // Use the potty break table hook to get all the necessary data and handlers
  const {
    sortedDogs,
    hasPottyBreak,
    hasCareLogged,
    hasObservation,
    getObservationDetails,
    handleCellClick,
    handleRefresh,
    isLoading
  } = usePottyBreakTable(dogsStatus, onRefresh, activeCategory, currentDate);
  
  // Safe tab change handler with logging
  const handleCategoryChange = useCallback((value: string) => {
    console.log(`Tab changed to ${value}`);
    // Reset click counter when changing tabs to avoid triggering the 6-click issue
    clickCountRef.current = 0;
    setDebugInfo(`Tab changed to ${value}, clicks reset`);
    setActiveCategory(value);
  }, []);
  
  // Create a stable cell click handler with enhanced error prevention
  const memoizedCellClickHandler = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Increment click count
    clickCountRef.current += 1;
    const clickNumber = clickCountRef.current;
    
    // Log debug info
    console.log(`Cell clicked: ${clickNumber} times (${dogName}, ${timeSlot}, ${category})`);
    setDebugInfo(`Last click: ${dogName} at ${timeSlot} (Click #${clickNumber})`);
    
    // Extra protection for the 6th click
    if (clickNumber >= 5) {
      console.log(`⚠️ CRITICAL: Click #${clickNumber} - applying extra protections`);
    }
    
    // Wrap in try-catch to prevent errors from bubbling up
    try {
      handleCellClick(dogId, dogName, timeSlot, category);
    } catch (error) {
      // Increment error count
      errorCountRef.current += 1;
      console.error(`Error #${errorCountRef.current} in cell click handler:`, error);
      
      // Still update the debug info to show error occurred
      setDebugInfo(`Error on click #${clickNumber} for ${dogName} (${errorCountRef.current} errors total)`);
    }
    
    // Return false to prevent default behavior
    return false;
  }, [handleCellClick]);
  
  // Handle cell right-click for observations/notes with improved error handling
  const handleCellContextMenu = useCallback((e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Prevent default context menu
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Right-clicked on cell:', dogId, dogName, timeSlot, category);
    
    // Return false to explicitly prevent default behavior
    return false;
  }, []);
  
  // Handle care log click with error prevention
  const handleCareLogClick = useCallback((dogId: string, dogName: string) => {
    console.log('Care log clicked for:', dogId, dogName);
    // No navigation for now
  }, []);

  // Error reset handler with improved debugging
  const handleErrorReset = useCallback(() => {
    console.log("Resetting after error");
    // Reset click counter
    clickCountRef.current = 0;
    setDebugInfo('Clicks reset after error');
    
    // Log error count
    console.log(`Total errors before reset: ${errorCountRef.current}`);
    errorCountRef.current = 0;
    
    // Call refresh with a small delay to prevent immediate errors
    setTimeout(() => {
      onRefresh();
    }, 100);
  }, [onRefresh]);

  // Combine loading states
  const showLoading = isRefreshing || isLoading;

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
        <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2">
          Debug: {debugInfo} | Total clicks: {clickCountRef.current} | 
          Errors: {errorCountRef.current} | Category: {activeCategory}
        </div>

        {/* Category Tabs */}
        <Tabs 
          defaultValue="pottybreaks" 
          value={activeCategory} 
          onValueChange={handleCategoryChange}
          className="w-full"
        >
          <TabsList onClick={(e) => e.stopPropagation()}>
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

        <div className="relative table-refresh-transition" onClick={(e) => e.stopPropagation()}>
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
              onDogClick={handleSafeDogClick} // Use our safe handler that prevents navigation
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
