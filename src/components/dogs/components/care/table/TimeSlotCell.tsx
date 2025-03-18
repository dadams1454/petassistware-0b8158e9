
import React, { memo, useState, useRef, useEffect } from 'react';
import { TableCell } from '@/components/ui/table';
import { DogFlag } from '@/types/dailyCare';
import CellContent from './components/CellContent';
import { useCellStyles } from './components/useCellStyles';
import ObservationDialog from './components/ObservationDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { MessageCircle } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';

interface TimeSlotCellProps {
  dogId: string;
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  onClick: () => void;
  flags?: DogFlag[];
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
  // State
  const [observationDialogOpen, setObservationDialogOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  // Create a stable copy of flags to prevent reference issues
  // This helps ensure each dog's flags stay with that dog
  const dogFlags = [...flags];
  
  // Refs for touch handling
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const cellRef = useRef<HTMLTableCellElement>(null);
  const isTouchActiveRef = useRef<boolean>(false);
  
  // Check if we're on a mobile device
  const isMobile = useIsMobile();
  
  const { cellClassNames } = useCellStyles({
    category,
    hasPottyBreak,
    hasCareLogged,
    flags: dogFlags
  });
  
  const cellIdentifier = `${dogId}-${timeSlot}-${category}`;
  
  // Touch event handlers for long press
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!onAddObservation) return;
    
    touchStartTimeRef.current = Date.now();
    isTouchActiveRef.current = true;
    
    // Set a timeout for long press (700ms is a good balance)
    touchTimeoutRef.current = setTimeout(() => {
      if (isTouchActiveRef.current) {
        // Prevent the regular click from firing
        e.preventDefault();
        setObservationDialogOpen(true);
        
        // Provide haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 700);
  };
  
  const handleTouchEnd = () => {
    // Clear the timeout and reset the touch state
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    isTouchActiveRef.current = false;
  };
  
  const handleTouchMove = () => {
    // If the user moves their finger, cancel the long press
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    isTouchActiveRef.current = false;
  };
  
  // Handle right-click to open observation dialog
  const handleContextMenu = (e: React.MouseEvent) => {
    if (isMobile) return; // Don't handle right-click on mobile
    
    e.preventDefault();
    if (onAddObservation) {
      setObservationDialogOpen(true);
    }
  };
  
  // Handle the observation icon click
  const handleObservationIconClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the cell click handler
    if (onAddObservation) {
      setObservationDialogOpen(true);
    }
  };
  
  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);
  
  // Check if we should show observation helpers (tooltip, icon, etc)
  const showObservationHelpers = onAddObservation !== undefined;
  
  return (
    <>
      {/* Use Context Menu on desktop */}
      {!isMobile ? (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <TableCell 
              ref={cellRef}
              key={cellIdentifier}
              className={`${cellClassNames} cursor-pointer border border-slate-200 dark:border-slate-700 p-0 overflow-hidden transition-all duration-200 relative ${
                hasObservation
                  ? 'bg-amber-50 dark:bg-amber-900/20'  
                  : hasPottyBreak 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : isCurrentHour
                      ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                      : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
              } ${
                isCurrentHour ? 'border-l-2 border-r-2 border-blue-400 dark:border-blue-600' : ''
              }`}
              onClick={onClick}
              onContextMenu={handleContextMenu}
              title={`${dogName} - ${timeSlot}${isCurrentHour ? ' (Current hour)' : ''}${hasObservation ? ' - Has observation' : ''}${hasObservation ? ' (Right-click to view)' : ' (Right-click to add observation)'}`}
              data-cell-id={cellIdentifier}
              data-dog-id={dogId}
              data-flags-count={dogFlags.length}
              data-is-current-hour={isCurrentHour ? 'true' : 'false'}
              data-has-observation={hasObservation ? 'true' : 'false'}
            >
              <div className="w-full h-full p-1 flex items-center justify-center">
                <CellContent 
                  dogName={dogName}
                  timeSlot={timeSlot}
                  category={category}
                  hasPottyBreak={hasPottyBreak}
                  hasCareLogged={hasCareLogged}
                  flags={dogFlags}
                  isCurrentHour={isCurrentHour}
                  hasObservation={hasObservation}
                />
                
                {/* Show observation icon for desktop if the cell has observation capabilities */}
                {showObservationHelpers && (
                  <div 
                    className={`absolute top-0 right-0 opacity-0 hover:opacity-100 transition-opacity p-0.5 ${hasObservation ? 'opacity-70' : ''}`}
                    onClick={handleObservationIconClick}
                  >
                    <MessageCircle 
                      className={`h-3 w-3 ${hasObservation ? 'text-amber-600 dark:text-amber-400 fill-amber-100 dark:fill-amber-900/30' : 'text-gray-400 dark:text-gray-600'}`}
                      aria-label="Add or view observation"
                    />
                  </div>
                )}
              </div>
            </TableCell>
          </ContextMenuTrigger>
          
          <ContextMenuContent>
            <ContextMenuItem onSelect={() => setObservationDialogOpen(true)}>
              {hasObservation ? "View/Add Observation" : "Add Observation"}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ) : (
        // Mobile version - use Popover for observation button
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <TableCell 
              ref={cellRef}
              key={cellIdentifier}
              className={`${cellClassNames} cursor-pointer border border-slate-200 dark:border-slate-700 p-0 overflow-hidden transition-all duration-200 relative ${
                hasObservation
                  ? 'bg-amber-50 dark:bg-amber-900/20'  
                  : hasPottyBreak 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : isCurrentHour
                      ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                      : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
              } ${
                isCurrentHour ? 'border-l-2 border-r-2 border-blue-400 dark:border-blue-600' : ''
              } touch-manipulation`}
              onClick={onClick}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              title={`${dogName} - ${timeSlot}${isCurrentHour ? ' (Current hour)' : ''}${hasObservation ? ' - Has observation' : ''}`}
              data-cell-id={cellIdentifier}
              data-dog-id={dogId}
              data-flags-count={dogFlags.length}
              data-is-current-hour={isCurrentHour ? 'true' : 'false'}
              data-has-observation={hasObservation ? 'true' : 'false'}
              data-mobile-cell="true"
            >
              <div className="w-full h-full p-1 flex items-center justify-center">
                <CellContent 
                  dogName={dogName}
                  timeSlot={timeSlot}
                  category={category}
                  hasPottyBreak={hasPottyBreak}
                  hasCareLogged={hasCareLogged}
                  flags={dogFlags}
                  isCurrentHour={isCurrentHour}
                  hasObservation={hasObservation}
                />
                
                {/* Show observation icon for mobile if the cell has observation capabilities */}
                {showObservationHelpers && (
                  <div 
                    className={`absolute top-1 right-1 ${hasObservation ? 'opacity-90' : 'opacity-40'} touch-manipulation`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setObservationDialogOpen(true);
                      
                      // Provide haptic feedback if available
                      if (navigator.vibrate) {
                        navigator.vibrate(50);
                      }
                    }}
                  >
                    <MessageCircle 
                      className={`h-4 w-4 ${hasObservation ? 'text-amber-600 dark:text-amber-400 fill-amber-100 dark:fill-amber-900/30' : 'text-gray-500 dark:text-gray-500'}`}
                      aria-label="Add or view observation"
                    />
                  </div>
                )}
              </div>
            </TableCell>
          </PopoverTrigger>
          
          {/* Mobile popover tooltip to help users understand */}
          <PopoverContent className="w-auto p-2 text-xs" side="top">
            <p>Tap to log care, tap and hold for observations</p>
          </PopoverContent>
        </Popover>
      )}
      
      {/* Observation Dialog - used for both mobile and desktop */}
      {onAddObservation && (
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
      )}
    </>
  );
});

// Add display name for better debugging
TimeSlotCell.displayName = 'TimeSlotCell';

export default TimeSlotCell;
