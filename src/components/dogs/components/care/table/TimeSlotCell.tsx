
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { X } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface TimeSlotCellProps {
  dogId: string;
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  onClick: () => void;
}

const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
  dogId,
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  onClick
}) => {
  const isPottyCategory = category === 'pottybreaks';
  
  return (
    <TableCell 
      className={`text-center p-0 h-10 border border-slate-200 
        ${isPottyCategory ? 'cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/20' : ''}
        ${(isPottyCategory && hasPottyBreak) ? 'bg-green-50 dark:bg-green-900/10' : ''}
      `}
      onClick={isPottyCategory ? onClick : undefined}
    >
      {isPottyCategory && hasPottyBreak ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center h-full">
                <X className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{hasPottyBreak ? `${dogName} - Click to remove potty break at ${timeSlot}` : `Click to log potty break for ${dogName} at ${timeSlot}`}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span>&nbsp;</span>
      )}
    </TableCell>
  );
};

export default TimeSlotCell;
