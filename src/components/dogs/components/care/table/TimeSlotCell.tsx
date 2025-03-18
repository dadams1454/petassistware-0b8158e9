
import React, { memo, useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { DogFlag } from '@/types/dailyCare';
import CellContent from './components/CellContent';
import { useCellStyles } from './components/useCellStyles';
import ObservationDialog from './components/ObservationDialog';

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
  const [observationDialogOpen, setObservationDialogOpen] = useState(false);
  
  // Create a stable copy of flags to prevent reference issues
  // This helps ensure each dog's flags stay with that dog
  const dogFlags = [...flags];
  
  const { cellClassNames } = useCellStyles({
    category,
    hasPottyBreak,
    hasCareLogged,
    flags: dogFlags
  });
  
  const cellIdentifier = `${dogId}-${timeSlot}-${category}`;
  
  // Handle right-click to open observation dialog
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddObservation) {
      setObservationDialogOpen(true);
    }
  };
  
  return (
    <>
      <TableCell 
        key={cellIdentifier}
        className={`${cellClassNames} cursor-pointer border border-slate-200 dark:border-slate-700 p-0 overflow-hidden transition-all duration-200 ${
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
        title={`${dogName} - ${timeSlot}${isCurrentHour ? ' (Current hour)' : ''}${hasObservation ? ' - Has observation' : ''}`}
        data-cell-id={cellIdentifier}
        data-dog-id={dogId}
        data-flags-count={dogFlags.length}
        data-is-current-hour={isCurrentHour ? 'true' : 'false'}
        data-has-observation={hasObservation ? 'true' : 'false'}
      >
        <div className="w-full h-full p-1">
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
        </div>
      </TableCell>
      
      {onAddObservation && (
        <ObservationDialog
          open={observationDialogOpen}
          onOpenChange={setObservationDialogOpen}
          dogId={dogId}
          dogName={dogName}
          onSubmit={onAddObservation}
          existingObservations={existingObservations}
        />
      )}
    </>
  );
});

// Add display name for better debugging
TimeSlotCell.displayName = 'TimeSlotCell';

export default TimeSlotCell;
