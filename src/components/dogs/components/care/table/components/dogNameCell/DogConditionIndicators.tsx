
import React from 'react';
import { Heart, Flame, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DogFlag } from '@/types/dailyCare';

interface DogConditionIndicatorsProps {
  flags: DogFlag[];
}

const DogConditionIndicators: React.FC<DogConditionIndicatorsProps> = ({ flags }) => {
  // Extract flag statuses
  const isPregnant = flags.some(flag => 
    flag.type === 'special_attention' && 
    flag.value?.toLowerCase().includes('pregnant')
  );
  const isInHeat = flags.some(flag => flag.type === 'in_heat');
  const hasIncompatibility = flags.some(flag => flag.type === 'incompatible');
  const hasSpecialAttention = flags.some(flag => 
    flag.type === 'special_attention' && 
    !flag.value?.toLowerCase().includes('pregnant')
  );
  
  // Get special attention value for tooltip
  const specialAttentionValue = flags.find(flag => 
    flag.type === 'special_attention' && 
    !flag.value?.toLowerCase().includes('pregnant')
  )?.value || "Needs special attention";
  
  if (!isPregnant && !isInHeat && !hasIncompatibility && !hasSpecialAttention) {
    return null;
  }
  
  return (
    <>
      {/* Pregnant indicator */}
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
      
      {/* In heat indicator */}
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
      
      {/* Incompatibility indicator */}
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
      
      {/* Special attention indicator */}
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
    </>
  );
};

export default DogConditionIndicators;
