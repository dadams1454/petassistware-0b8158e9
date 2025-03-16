
import React from 'react';
import { X } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { DogFlag } from '@/types/dailyCare';
import { useCellStyles } from './useCellStyles';

interface CellContentProps {
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  flags: DogFlag[];
}

const CellContent: React.FC<CellContentProps> = ({
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  flags
}) => {
  const { 
    isPottyCategory,
    isInHeat,
    isPregnant,
    hasIncompatibility
  } = useCellStyles({ category, hasPottyBreak, flags });
  
  const getCellFlag = () => {
    if (isInHeat) return '🔴';
    if (isPregnant) return '🩷';
    if (hasIncompatibility) return '⚠️';
    return '';
  };
  
  const getFlagTooltip = () => {
    let message = '';
    
    if (isInHeat) message += '• In heat\n';
    if (isPregnant) message += '• Pregnant\n';
    
    if (hasIncompatibility) {
      const incompatibleDogs = flags.find(f => f.type === 'incompatible')?.incompatible_with;
      message += `• Doesn't get along with ${incompatibleDogs?.length || 0} other dog(s)\n`;
    }
    
    if (hasPottyBreak) {
      message += `\n${isPottyCategory ? 'Click to remove potty break' : 'Has potty break logged'}`;
    } else if (isPottyCategory) {
      message += '\nClick to log potty break';
    }
    
    return message.trim();
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center h-full">
            {isPottyCategory && hasPottyBreak ? (
              <X className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <span className="text-xs">{getCellFlag()}</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="whitespace-pre-line">
          <p className="text-sm font-medium">{dogName}</p>
          <p className="text-xs">{getFlagTooltip()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CellContent;
