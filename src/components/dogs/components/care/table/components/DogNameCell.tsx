
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { AlertCircle, Dog } from 'lucide-react';
import { DogCareStatus, DogFlag } from '@/types/dailyCare';
import { DogFlagsList } from '../../DogFlagsList';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DogNameCellProps {
  dog: DogCareStatus;
}

const DogNameCell: React.FC<DogNameCellProps> = ({ dog }) => {
  // Get only non-special-attention flags for the flags list
  const regularFlags = dog.flags?.filter(flag => flag.type !== 'special_attention') || [];
  
  // Get only the FIRST special attention flag if it exists (to prevent duplicates)
  const specialAttentionFlags = dog.flags?.filter(flag => flag.type === 'special_attention') || [];
  const specialAttentionFlag = specialAttentionFlags.length > 0 ? specialAttentionFlags[0] : null;
  const hasSpecialAttention = !!specialAttentionFlag;
  
  return (
    <TableCell className="font-medium sticky left-0 z-10 border-r border-slate-200 bg-white dark:bg-slate-900">
      <div className="flex items-center space-x-2">
        {dog.dog_photo ? (
          <img 
            src={dog.dog_photo} 
            alt={dog.dog_name} 
            className="w-6 h-6 rounded-full object-cover" 
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Dog className="h-3 w-3 text-primary" />
          </div>
        )}
        <div className="flex items-center">
          <span>{dog.dog_name}</span>
          {hasSpecialAttention && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 ml-1 text-blue-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{specialAttentionFlag.value || "Needs special attention"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {regularFlags.length > 0 && (
            <div className="ml-1 flex">
              <DogFlagsList flags={regularFlags} />
            </div>
          )}
        </div>
      </div>
    </TableCell>
  );
};

export default DogNameCell;
