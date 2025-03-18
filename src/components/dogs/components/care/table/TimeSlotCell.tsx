
import React, { memo } from 'react';
import { useCellStyles } from './components/useCellStyles';
import ObservationDialog from './components/ObservationDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCellInteractions } from './hooks/useCellInteractions';

// Import new cell components
import CellContextMenu from './components/cellComponents/CellContextMenu';
import CellTouchHandler from './components/cellComponents/CellTouchHandler';
import CellWrapper from './components/cellComponents/CellWrapper';
import CellContentWrapper from './components/cellComponents/CellContent';

interface TimeSlotCellProps {
  dogId: string;
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  onClick: () => void;
  flags?: any[];
  isCurrentHour?: boolean;
  hasObservation?: boolean;
  onAddObservation?: (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'other') => Promise<void>;
  existingObservations?: Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
  }>;
}

// Use memo to prevent unnecessary re-renders that could cause flag flickering
const TimeSlotCell: React.FC<TimeSlotCellProps> = memo(({
  dogId,
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  hasCareLogged,
  onClick,
  flags = [],
  isCurrentHour = false,
  hasObservation = false,
  onAddObservation,
  existingObservations = []
}) => {
  // Check if we're on a mobile device
  const isMobile = useIsMobile();
  
  // Use interaction hooks for handling cell events
  const {
    observationDialogOpen,
    setObservationDialogOpen,
    popoverOpen,
    setPopoverOpen,
    cellRef,
    handleContextMenu,
    handleObservationIconClick
  } = useCellInteractions();
  
  // Create a stable copy of flags to prevent reference issues
  const dogFlags = [...flags];
  
  const { cellClassNames } = useCellStyles({
    category,
    hasPottyBreak,
    hasCareLogged,
    flags: dogFlags
  });
  
  const cellIdentifier = `${dogId}-${timeSlot}-${category}`;
  
  // Check if we should show observation helpers (tooltip, icon, etc)
  const showObservationHelpers = onAddObservation !== undefined;
  
  // Handle cell content based on platform (mobile vs desktop)
  if (!isMobile) {
    // Desktop version with context menu
    return (
      <>
        <CellContextMenu 
          hasObservation={hasObservation} 
          onOpenObservation={() => setObservationDialogOpen(true)}
        >
          <CellWrapper
            cellRef={cellRef}
            cellIdentifier={cellIdentifier}
            dogId={dogId}
            dogName={dogName}
            timeSlot={timeSlot}
            hasObservation={hasObservation}
            hasPottyBreak={hasPottyBreak}
            isCurrentHour={isCurrentHour}
            dogFlags={dogFlags}
            cellClassNames={cellClassNames}
            onClick={onClick}
            onContextMenu={showObservationHelpers ? handleContextMenu : undefined}
          >
            <CellContentWrapper
              dogName={dogName}
              timeSlot={timeSlot}
              category={category}
              hasPottyBreak={hasPottyBreak}
              hasCareLogged={hasCareLogged}
              flags={dogFlags}
              isCurrentHour={isCurrentHour}
              hasObservation={hasObservation}
              showObservationHelpers={showObservationHelpers}
              isMobile={isMobile}
              onObservationIconClick={handleObservationIconClick}
            />
          </CellWrapper>
        </CellContextMenu>
        
        {/* Observation Dialog */}
        {renderObservationDialog()}
      </>
    );
  } else {
    // Mobile version with touch handler
    return (
      <>
        <CellTouchHandler
          popoverOpen={popoverOpen}
          setPopoverOpen={setPopoverOpen}
          onLongPress={() => setObservationDialogOpen(true)}
        >
          <CellWrapper
            cellRef={cellRef}
            cellIdentifier={cellIdentifier}
            dogId={dogId}
            dogName={dogName}
            timeSlot={timeSlot}
            hasObservation={hasObservation}
            hasPottyBreak={hasPottyBreak}
            isCurrentHour={isCurrentHour}
            dogFlags={dogFlags}
            cellClassNames={cellClassNames}
            onClick={onClick}
            extraAttributes={{ 
              'data-mobile-cell': 'true',
              className: 'touch-manipulation'
            }}
          >
            <CellContentWrapper
              dogName={dogName}
              timeSlot={timeSlot}
              category={category}
              hasPottyBreak={hasPottyBreak}
              hasCareLogged={hasCareLogged}
              flags={dogFlags}
              isCurrentHour={isCurrentHour}
              hasObservation={hasObservation}
              showObservationHelpers={showObservationHelpers}
              isMobile={isMobile}
              onObservationIconClick={handleObservationIconClick}
            />
          </CellWrapper>
        </CellTouchHandler>
        
        {/* Observation Dialog */}
        {renderObservationDialog()}
      </>
    );
  }
  
  // Helper function to render observation dialog
  function renderObservationDialog() {
    if (!onAddObservation) return null;
    
    return (
      <ObservationDialog
        open={observationDialogOpen}
        onOpenChange={setObservationDialogOpen}
        dogId={dogId}
        dogName={dogName}
        onSubmit={onAddObservation}
        existingObservations={existingObservations}
        timeSlot={timeSlot}
        isMobile={isMobile}
      />
    );
  }
});

// Add display name for better debugging
TimeSlotCell.displayName = 'TimeSlotCell';

export default TimeSlotCell;
