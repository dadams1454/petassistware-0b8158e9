
import React from 'react';
import { Heart, Slash, AlertCircle, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DogFlag } from '@/types/dailyCare';

interface DogFlagsListProps {
  flags: DogFlag[];
}

export const DogFlagsList: React.FC<DogFlagsListProps> = ({ flags }) => {
  return (
    <>
      {flags.map((flag, index) => {
        let icon;
        let tooltipText;
        let color;

        switch (flag.type) {
          case 'in_heat':
            icon = <Heart className="h-4 w-4 fill-red-500 text-red-500" />;
            tooltipText = 'In Heat';
            color = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            break;
          case 'incompatible':
            icon = <Slash className="h-4 w-4 text-amber-500" />;
            tooltipText = flag.incompatible_with && flag.incompatible_with.length > 0 
              ? `Doesn't get along with ${flag.incompatible_with.length} other dog(s)` 
              : 'Incompatible with other dogs';
            color = 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
            break;
          case 'special_attention':
            icon = <AlertCircle className="h-4 w-4 text-blue-500" />;
            tooltipText = flag.value || 'Needs special attention';
            color = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            break;
          default:
            icon = <Flag className="h-4 w-4 text-gray-500" />;
            tooltipText = flag.value || 'Other flag';
            color = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }

        return (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className={`ml-1 ${color}`}>
                  {icon}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </>
  );
};
