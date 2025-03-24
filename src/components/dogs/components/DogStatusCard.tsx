
import React from 'react';
import { format, addDays, isAfter } from 'date-fns';
import { Heart, AlertTriangle, Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDogStatus, isWithinDays } from '../hooks/useDogStatus';

interface DogStatusCardProps {
  dog: any;
}

const DogStatusCard: React.FC<DogStatusCardProps> = ({ dog }) => {
  // Use our custom hook to get dog status
  const { 
    isPregnant, 
    inHeatWindow, 
    vaccinationDueSoon,
    lastHeatDate, 
    nextHeatDate, 
    lastVaccinationDate, 
    nextVaccinationDate,
    tieDate
  } = useDogStatus(dog);
  
  const today = new Date();

  // If no status to show, return null
  if (!isPregnant && !inHeatWindow && !vaccinationDueSoon) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* Pregnant Status */}
      {isPregnant && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium text-sm shadow-md hover:shadow-lg transition-shadow cursor-help">
                <Heart className="h-4 w-4 fill-pink-600 dark:fill-pink-300" />
                Pregnant
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">This dog is currently pregnant</p>
              {tieDate && (
                <p className="text-xs mt-1">
                  Due date: {format(addDays(new Date(tieDate), 65), 'MMM d, yyyy')}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Heat Cycle Status */}
      {inHeatWindow && !isPregnant && nextHeatDate && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium text-sm shadow-md hover:shadow-lg transition-shadow cursor-help">
                <Flame className="h-4 w-4 text-purple-500 dark:text-purple-300" />
                {isWithinDays(today, nextHeatDate, 0) ? 'In Heat' : 'Heat Soon'}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isWithinDays(today, nextHeatDate, 0) 
                ? <p className="text-sm">This dog is likely in heat now</p>
                : <p className="text-sm">Heat cycle expected soon</p>
              }
              <p className="text-xs mt-1">
                Predicted heat: {format(nextHeatDate, 'MMM d, yyyy')}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Vaccination Status */}
      {vaccinationDueSoon && lastVaccinationDate && nextVaccinationDate && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium text-sm shadow-md hover:shadow-lg transition-shadow cursor-help">
                <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-300" />
                {isAfter(today, nextVaccinationDate) ? 'Vaccination Overdue' : 'Vaccination Due Soon'}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                {isAfter(today, nextVaccinationDate) 
                  ? 'Vaccinations are overdue' 
                  : 'Vaccinations due within 30 days'}
              </p>
              <p className="text-xs mt-1">
                Last vaccination: {format(lastVaccinationDate, 'MMM d, yyyy')}
              </p>
              <p className="text-xs mt-1">
                Due date: {format(nextVaccinationDate, 'MMM d, yyyy')}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default DogStatusCard;
