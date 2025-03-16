
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { X } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { DogFlag } from '@/types/dailyCare';

interface TimeSlotCellProps {
  dogId: string;
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  onClick: () => void;
  flags?: DogFlag[];
}

const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
  dogId,
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  onClick,
  flags = []
}) => {
  const isPottyCategory = category === 'pottybreaks';
  const isInHeat = flags.some(flag => flag.type === 'in_heat');
  const isPregnant = (flags.some(flag => flag.type === 'special_attention' && flag.value?.includes('pregnant')));
  const hasIncompatibility = flags.some(flag => flag.type === 'incompatible');
  const hasSpecialAttention = flags.some(flag => flag.type === 'special_attention');
  
  const getBorderColor = () => {
    if (isInHeat) return 'border-red-400';
    if (isPregnant) return 'border-pink-400';
    if (hasIncompatibility) return 'border-amber-400';
    if (hasSpecialAttention) return 'border-blue-400';
    return 'border-slate-200';
  };
  
  const getCellFlag = () => {
    if (isInHeat) return '🔴';
    if (isPregnant) return '🩷';
    if (hasIncompatibility) return '⚠️';
    if (hasSpecialAttention) return 'ℹ️';
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
    
    if (hasSpecialAttention && !isPregnant) {
      const attentionNote = flags.find(f => f.type === 'special_attention')?.value;
      message += `• ${attentionNote || 'Needs special attention'}\n`;
    }
    
    if (hasPottyBreak) {
      message += `\n${isPottyCategory ? 'Click to remove potty break' : 'Has potty break logged'}`;
    } else if (isPottyCategory) {
      message += '\nClick to log potty break';
    }
    
    return message.trim();
  };
  
  return (
    <TableCell 
      className={`text-center p-0 h-10 border ${getBorderColor()}
        ${isPottyCategory ? 'cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/20' : ''}
        ${(isPottyCategory && hasPottyBreak) ? 'bg-green-50 dark:bg-green-900/10' : ''}
        ${isInHeat ? 'bg-red-50 dark:bg-red-900/10' : ''}
        ${isPregnant ? 'bg-pink-50 dark:bg-pink-900/10' : ''}
        ${hasIncompatibility ? 'bg-amber-50 dark:bg-amber-900/10' : ''}
        ${hasSpecialAttention && !isPregnant ? 'bg-blue-50 dark:bg-blue-900/10' : ''}
      `}
      onClick={isPottyCategory ? onClick : undefined}
    >
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
    </TableCell>
  );
};

export default TimeSlotCell;
