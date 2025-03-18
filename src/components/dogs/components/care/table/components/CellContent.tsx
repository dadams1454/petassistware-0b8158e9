
import React from 'react';
import { Check } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { DogFlag } from '@/types/dailyCare';
import { useCellStyles } from './useCellStyles';

interface CellContentProps {
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  flags: DogFlag[];
}

const CellContent: React.FC<CellContentProps> = ({
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  hasCareLogged,
  flags
}) => {
  // Filter out special_attention flags for cell content  
  const { isPottyCategory } = useCellStyles({ 
    category, 
    hasPottyBreak,
    hasCareLogged,
    flags 
  });
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center h-full w-full">
            {hasPottyBreak ? (
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <span className="h-5 w-5 flex items-center justify-center">&nbsp;</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm font-medium">{dogName}</p>
          <p className="text-xs">
            {hasPottyBreak ? 
              `Potty break at ${timeSlot}` : 
              `Click to log potty break at ${timeSlot}`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CellContent;
