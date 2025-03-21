
import React, { memo, useRef, useEffect } from 'react';
import { TableCell } from '@/components/ui/table';
import { DogFlag } from '@/types/dailyCare';
import CellContent from './components/CellContent';
import { useCellStyles } from './components/useCellStyles';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface TimeSlotCellProps {
  dogId: string;
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  onClick: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  flags?: DogFlag[];
  isCurrentHour?: boolean;
  isIncident?: boolean;
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
  onContextMenu,
  flags = [],
  isCurrentHour = false,
  isIncident = false
}) => {
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
  
  // Get user preferences for dog color
  const { getDogColor } = useUserPreferences();
  const customDogColor = getDogColor(dogId);
  
  const { cellClassNames } = useCellStyles({
    category,
    hasPottyBreak,
    hasCareLogged,
    flags: dogFlags
  });
  
  const cellIdentifier = `${dogId}-${timeSlot}-${category}`;

  // Get background color based on category and status
  const getBgColor = () => {
    if (category === 'feeding') {
      if (isIncident) {
        return 'bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20';
      }
      if (hasCareLogged) {
        return 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/40';
      }
      return 'hover:bg-green-50 dark:hover:bg-green-900/10';
    }
    
    if (isIncident) {
      return 'bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20';
    } 
    if (hasPottyBreak) {
      return 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/40'; 
    }
    if (isCurrentHour) {
      return 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20';
    }
    
    return customDogColor || 'hover:bg-blue-50 dark:hover:bg-blue-900/20';
  };
  
  // Touch event handlers for quick click
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartTimeRef.current = Date.now();
    isTouchActiveRef.current = true;
  };
  
  const handleTouchEnd = () => {
    isTouchActiveRef.current = false;
  };
  
  const handleTouchMove = () => {
    isTouchActiveRef.current = false;
  };
  
  // Handle long press for mobile context menu alternative
  const handleTouchStart2 = (e: React.TouchEvent) => {
    if (onContextMenu) {
      touchTimeoutRef.current = setTimeout(() => {
        if (isTouchActiveRef.current) {
          // Long press detected, trigger context menu handler
          const touch = e.touches[0];
          const mouseEvent = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: touch.clientX,
            clientY: touch.clientY
          });
          
          onContextMenu(mouseEvent as unknown as React.MouseEvent);
        }
      }, 800); // 800ms long press
    }
    
    handleTouchStart(e);
  };
  
  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);
  
  // Get border color based on category and status
  const getBorderColor = () => {
    if (category === 'feeding') {
      if (isIncident) {
        return 'border-l-2 border-r-2 border-red-400 dark:border-red-600';
      }
      if (hasCareLogged) {
        return 'border-l-2 border-r-2 border-green-400 dark:border-green-600';
      }
      return '';
    }
    
    if (isIncident) {
      return 'border-l-2 border-r-2 border-red-400 dark:border-red-600';
    }
    if (isCurrentHour) {
      return 'border-l-2 border-r-2 border-blue-400 dark:border-blue-600';
    }
    return '';
  };
  
  // Determine cursor style to show this is toggleable
  const getCursorStyle = () => {
    return 'cursor-pointer';
  };
  
  return (
    <TableCell 
      ref={cellRef}
      key={cellIdentifier}
      className={`${cellClassNames} ${getCursorStyle()} border border-slate-200 dark:border-slate-700 p-0 overflow-hidden transition-all duration-200 relative ${
        getBgColor()
      } ${
        getBorderColor()
      } touch-manipulation`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onTouchStart={handleTouchStart2}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      title={`${dogName} - ${timeSlot}${isIncident ? ' (Incident reported)' : ''}${isCurrentHour ? ' (Current hour)' : ''}${hasCareLogged ? ' (Click to remove)' : ' (Click to log)'}`}
      data-cell-id={cellIdentifier}
      data-dog-id={dogId}
      data-flags-count={dogFlags.length}
      data-is-current-hour={isCurrentHour ? 'true' : 'false'}
      data-is-incident={isIncident ? 'true' : 'false'}
      data-mobile-cell={isMobile ? "true" : "false"}
      data-custom-color={customDogColor ? "true" : "false"}
      data-category={category}
      data-care-logged={hasCareLogged ? "true" : "false"}
    >
      <div className="w-full h-full p-1 flex items-center justify-center">
        <CellContent 
          dogName={dogName}
          timeSlot={timeSlot}
          category={category}
          hasPottyBreak={hasPottyBreak}
          hasCareLogged={hasCareLogged}
          isCurrentHour={isCurrentHour}
          isIncident={isIncident}
        />
      </div>
    </TableCell>
  );
});

// Add display name for better debugging
TimeSlotCell.displayName = 'TimeSlotCell';

export default TimeSlotCell;
