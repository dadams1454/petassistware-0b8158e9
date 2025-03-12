
import React from 'react';
import { format, addDays, isAfter, isBefore, isToday } from 'date-fns';
import { Heart, AlertTriangle, Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DogStatusCardProps {
  dog: any;
}

const DogStatusCard: React.FC<DogStatusCardProps> = ({ dog }) => {
  // Extract relevant health data
  const isPregnant = dog.is_pregnant || false;
  const lastHeatDate = dog.last_heat_date ? new Date(dog.last_heat_date) : null;
  const lastVaccinationDate = dog.last_vaccination_date ? new Date(dog.last_vaccination_date) : null;
  
  // Calculate next heat date (approximately 6 months after last heat)
  const nextHeatDate = lastHeatDate ? addDays(lastHeatDate, 180) : null;
  
  // Calculate next vaccination date (approximately 1 year after last vaccination)
  const nextVaccinationDate = lastVaccinationDate ? addDays(lastVaccinationDate, 365) : null;
  
  const today = new Date();
  
  // Check if the dog is potentially in heat (2 weeks before to 2 weeks after calculated next heat date)
  const inHeatWindow = nextHeatDate && !isPregnant 
    ? isWithinDays(today, nextHeatDate, 14)
    : false;
  
  // Check if vaccinations are due soon or overdue (within 30 days or past due)
  const vaccinationDueSoon = nextVaccinationDate 
    ? isWithinDays(today, nextVaccinationDate, 30) || isAfter(today, nextVaccinationDate)
    : false;

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
              {dog.tie_date && (
                <p className="text-xs mt-1">
                  Due date: {format(addDays(new Date(dog.tie_date), 65), 'MMM d, yyyy')}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Heat Cycle Status */}
      {inHeatWindow && !isPregnant && (
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
      {vaccinationDueSoon && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium text-sm shadow-md hover:shadow-lg transition-shadow cursor-help">
                <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-300" />
                {isAfter(today, nextVaccinationDate!) ? 'Vaccination Overdue' : 'Vaccination Due Soon'}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                {isAfter(today, nextVaccinationDate!) 
                  ? 'Vaccinations are overdue' 
                  : 'Vaccinations due within 30 days'}
              </p>
              <p className="text-xs mt-1">
                Last vaccination: {format(lastVaccinationDate!, 'MMM d, yyyy')}
              </p>
              <p className="text-xs mt-1">
                Due date: {format(nextVaccinationDate!, 'MMM d, yyyy')}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

// Helper function to check if a date is within X days of a target date
function isWithinDays(date: Date, targetDate: Date, days: number): boolean {
  const earliestDate = addDays(targetDate, -days);
  const latestDate = addDays(targetDate, days);
  
  return (
    (isAfter(date, earliestDate) || isToday(earliestDate)) && 
    (isBefore(date, latestDate) || isToday(latestDate))
  );
}

export default DogStatusCard;
