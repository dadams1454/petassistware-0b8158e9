
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { AlertCircle, Dog, Heart, Flame, PlusCircle } from 'lucide-react';
import { DogCareStatus, DogFlag } from '@/types/dailyCare';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DogNameCellProps {
  dog: DogCareStatus;
  onCareLogClick: () => void;
  activeCategory: string;
}

const DogNameCell: React.FC<DogNameCellProps> = ({ dog, onCareLogClick, activeCategory }) => {
  // Determine if dog is female based on gender field
  const isFemale = dog.sex?.toLowerCase() === 'female';
  
  const genderColor = isFemale ? 'text-pink-500 dark:text-pink-400' : 'text-blue-500 dark:text-blue-400';
  
  // Check for special conditions
  const isInHeat = dog.flags?.some(flag => flag.type === 'in_heat');
  const isPregnant = dog.flags?.some(flag => 
    flag.type === 'special_attention' && 
    flag.value?.toLowerCase().includes('pregnant')
  );
  const hasSpecialAttention = dog.flags?.some(flag => 
    flag.type === 'special_attention' && 
    !flag.value?.toLowerCase().includes('pregnant')
  );
  const hasIncompatibility = dog.flags?.some(flag => flag.type === 'incompatible');
  
  // Get special attention value for tooltip
  const specialAttentionValue = dog.flags?.find(flag => 
    flag.type === 'special_attention' && 
    !flag.value?.toLowerCase().includes('pregnant')
  )?.value || "Needs special attention";

  // Get category-specific label
  const actionLabel = {
    'pottybreaks': 'Log Break',
    'feeding': 'Log Meal',
    'medications': 'Log Meds',
    'exercise': 'Log Exercise'
  }[activeCategory] || 'Log Care';
  
  return (
    <TableCell className="font-medium sticky left-0 z-10 border-r border-slate-200 bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {dog.dog_photo ? (
            <img 
              src={dog.dog_photo} 
              alt={dog.dog_name} 
              className={`w-8 h-8 rounded-full object-cover border-2 ${isFemale ? 'border-pink-300' : 'border-blue-300'}`}
            />
          ) : (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isFemale ? 'bg-pink-100' : 'bg-blue-100'}`}>
              <Dog className={`h-4 w-4 ${genderColor}`} />
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className={`text-sm font-medium ${genderColor}`}>{dog.dog_name}</span>
              
              {/* Special condition indicators */}
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
              
              {hasIncompatibility && (
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
              
              {hasSpecialAttention && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="h-4 w-4 ml-1 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{specialAttentionValue}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {dog.breed} {dog.color ? `• ${dog.color}` : ''}
            </span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCareLogClick}
          className="ml-2 flex items-center text-xs px-2 py-1 h-7"
        >
          <PlusCircle className="h-3 w-3 mr-1" />
          {actionLabel}
        </Button>
      </div>
    </TableCell>
  );
};

export default DogNameCell;
