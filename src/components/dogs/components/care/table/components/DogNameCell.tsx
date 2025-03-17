
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { AlertCircle, Dog, Heart, Flame } from 'lucide-react';
import { DogCareStatus, DogFlag } from '@/types/dailyCare';
import { DogFlagsList } from '../../DogFlagsList';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DogNameCellProps {
  dog: DogCareStatus;
}

const DogNameCell: React.FC<DogNameCellProps> = ({ dog }) => {
  // Determine dog gender color (assumption: females have "female" in breed or color field)
  const isFemale = dog.breed?.toLowerCase().includes('female') || 
                  dog.color?.toLowerCase().includes('female') || 
                  !dog.breed?.toLowerCase().includes('male');
  
  const genderColor = isFemale ? 'text-pink-500 dark:text-pink-400' : 'text-blue-500 dark:text-blue-400';
  
  // Check for special conditions
  const isInHeat = dog.flags?.some(flag => flag.type === 'in_heat');
  const isPregnant = dog.flags?.some(flag => 
    flag.type === 'pregnant' || 
    (flag.type === 'special_attention' && flag.value?.toLowerCase().includes('pregnant'))
  );
  
  return (
    <TableCell className="font-medium sticky left-0 z-10 border-r border-slate-200 bg-white dark:bg-slate-900">
      <div className="flex items-center space-x-2">
        {dog.dog_photo ? (
          <img 
            src={dog.dog_photo} 
            alt={dog.dog_name} 
            className={`w-6 h-6 rounded-full object-cover border-2 ${isFemale ? 'border-pink-300' : 'border-blue-300'}`}
          />
        ) : (
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isFemale ? 'bg-pink-100' : 'bg-blue-100'}`}>
            <Dog className={`h-3 w-3 ${genderColor}`} />
          </div>
        )}
        <div className="flex items-center">
          <span className={genderColor}>{dog.dog_name}</span>
          
          {/* Simple symbols for special conditions */}
          {isPregnant && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Heart className="h-4 w-4 ml-1 text-pink-500 fill-pink-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pregnant</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {isInHeat && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Flame className="h-4 w-4 ml-1 text-red-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>In Heat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {dog.flags?.some(flag => flag.type === 'incompatible') && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 text-amber-500">⚠️</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Incompatible with other dogs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {dog.flags?.some(flag => flag.type === 'special_attention' && !flag.value?.toLowerCase().includes('pregnant')) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 ml-1 text-blue-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{dog.flags.find(f => f.type === 'special_attention')?.value || "Needs special attention"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </TableCell>
  );
};

export default DogNameCell;
