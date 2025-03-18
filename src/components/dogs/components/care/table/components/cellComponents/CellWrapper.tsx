
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { DogFlag } from '@/types/dailyCare';

interface CellWrapperProps {
  children: React.ReactNode;
  cellRef: React.RefObject<HTMLTableCellElement>;
  cellIdentifier: string;
  dogId: string;
  dogName: string;
  timeSlot: string;
  hasObservation: boolean;
  hasPottyBreak: boolean;
  isCurrentHour: boolean;
  dogFlags: DogFlag[];
  cellClassNames: string;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  extraAttributes?: Record<string, any>;
}

const CellWrapper: React.FC<CellWrapperProps> = ({
  children,
  cellRef,
  cellIdentifier,
  dogId,
  dogName,
  timeSlot,
  hasObservation,
  hasPottyBreak,
  isCurrentHour,
  dogFlags,
  cellClassNames,
  onClick,
  onContextMenu,
  extraAttributes = {}
}) => {
  return (
    <TableCell 
      ref={cellRef}
      key={cellIdentifier}
      className={`${cellClassNames} cursor-pointer border border-slate-200 dark:border-slate-700 p-0 overflow-hidden transition-all duration-200 relative w-12 h-12 ${
        hasObservation
          ? 'bg-amber-50 dark:bg-amber-900/20'  
          : hasPottyBreak 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : isCurrentHour
              ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20'
              : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
      } ${
        isCurrentHour ? 'border-l-2 border-r-2 border-blue-400 dark:border-blue-600' : ''
      } ${extraAttributes.className || ''}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      title={`${dogName} - ${timeSlot}${isCurrentHour ? ' (Current hour)' : ''}${hasObservation ? ' - Has observation' : ''}${hasObservation ? ' (Right-click to view)' : ' (Right-click to add observation)'}`}
      data-cell-id={cellIdentifier}
      data-dog-id={dogId}
      data-flags-count={dogFlags.length}
      data-is-current-hour={isCurrentHour ? 'true' : 'false'}
      data-has-observation={hasObservation ? 'true' : 'false'}
      {...extraAttributes}
    >
      {children}
    </TableCell>
  );
};

export default CellWrapper;
