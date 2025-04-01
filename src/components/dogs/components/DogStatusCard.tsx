import React from 'react';
import { format, addDays, isAfter } from 'date-fns';
import { Heart, AlertTriangle, Flame, Calendar, Timer, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDogStatus, isWithinDays } from '../hooks/useDogStatus';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface DogStatusCardProps {
  dog: any;
}

const DogStatusCard: React.FC<DogStatusCardProps> = ({ dog }) => {
  const navigate = useNavigate();
  
  // Use our enhanced hook to get dog status
  const { 
    isPregnant, 
    heatCycle,
    vaccinationDueSoon,
    lastVaccinationDate, 
    nextVaccinationDate,
    tieDate,
    hasVaccinationHeatConflict,
    shouldRestrictExercise,
    gestationProgressDays,
    estimatedDueDate
  } = useDogStatus(dog);
  
  const { 
    isInHeat, 
    isPreHeat, 
    nextHeatDate, 
    currentStage, 
    daysUntilNextHeat, 
    fertileDays,
    recommendedBreedingDays 
  } = heatCycle;
  
  const today = new Date();

  // If no status to show, return null
  if (!isPregnant && !isInHeat && !isPreHeat && !vaccinationDueSoon && !hasVaccinationHeatConflict) {
    return null;
  }

  // Add a navigation action to the pregnancy status tooltip
  if (isPregnant) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium text-sm shadow-md hover:shadow-lg transition-shadow cursor-help">
              <Heart className="h-4 w-4 fill-pink-600 dark:fill-pink-300" />
              {gestationProgressDays !== null ? `Pregnant (Day ${gestationProgressDays})` : 'Pregnant'}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-3">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Pregnancy Status</p>
              {tieDate && (
                <p className="text-xs">
                  Breeding date: {format(new Date(tieDate), 'MMM d, yyyy')}
                </p>
              )}
              {estimatedDueDate && (
                <p className="text-xs font-medium">
                  Due date: {format(estimatedDueDate, 'MMM d, yyyy')}
                  {gestationProgressDays !== null && (
                    <> ({63 - gestationProgressDays} days remaining)</>
                  )}
                </p>
              )}
              <div className="text-xs px-2 py-1 bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded">
                <AlertCircle className="h-3 w-3 inline-block mr-1" />
                Monitor closely for any signs of distress or labor
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-1"
                onClick={() => navigate(`/dogs/${dog.id}/reproductive`)}
              >
                Manage Pregnancy
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Active Heat Status
  {isInHeat && !isPregnant && currentStage && (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium text-sm shadow-md hover:shadow-lg transition-shadow cursor-help",
            currentStage.name === 'Proestrus' 
              ? "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          )}>
            <Flame className="h-4 w-4" />
            {currentStage.name} (In Heat)
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold">{currentStage.name} Stage</p>
            <p className="text-xs">{currentStage.description}</p>
            
            {fertileDays.start && fertileDays.end && (
              <div className="space-y-1">
                <p className="text-xs font-medium">Fertile Window:</p>
                <p className="text-xs">
                  {format(fertileDays.start, 'MMM d')} - {format(fertileDays.end, 'MMM d')}
                </p>
              </div>
            )}
            
            {recommendedBreedingDays.start && recommendedBreedingDays.end && (
              <div className="space-y-1">
                <p className="text-xs font-medium">Optimal Breeding Days:</p>
                <p className="text-xs">
                  {format(recommendedBreedingDays.start, 'MMM d')} - {format(recommendedBreedingDays.end, 'MMM d')}
                </p>
              </div>
            )}
            
            {shouldRestrictExercise && (
              <div className="text-xs px-2 py-1 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded">
                <AlertCircle className="h-3 w-3 inline-block mr-1" />
                Restrict intense exercise during this period
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )}
  
  // Approaching Heat Status
  {isPreHeat && !isPregnant && nextHeatDate && (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium text-sm shadow-md hover:shadow-lg transition-shadow cursor-help">
            <Calendar className="h-4 w-4" />
            Heat Approaching
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Approaching Heat Cycle</p>
            <p className="text-xs">
              Expected to start in {daysUntilNextHeat} days
            </p>
            <p className="text-xs font-medium">
              Predicted start: {format(nextHeatDate, 'MMM d, yyyy')}
            </p>
            <div className="text-xs px-2 py-1 bg-purple-50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded">
              <AlertCircle className="h-3 w-3 inline-block mr-1" />
              Prepare for cycle management and potential behavior changes
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )}
  
  // Vaccination Status
  {vaccinationDueSoon && lastVaccinationDate && nextVaccinationDate && (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium text-sm shadow-md hover:shadow-lg transition-shadow cursor-help">
            <AlertTriangle className="h-4 w-4" />
            {isAfter(today, nextVaccinationDate) ? 'Vaccination Overdue' : 'Vaccination Due Soon'}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              {isAfter(today, nextVaccinationDate) 
                ? 'Vaccinations are overdue' 
                : 'Vaccinations due within 30 days'}
            </p>
            <p className="text-xs">
              Last vaccination: {format(lastVaccinationDate, 'MMM d, yyyy')}
            </p>
            <p className="text-xs font-medium">
              Due date: {format(nextVaccinationDate, 'MMM d, yyyy')}
            </p>
            
            {hasVaccinationHeatConflict && (
              <div className="text-xs px-2 py-1 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded">
                <AlertTriangle className="h-3 w-3 inline-block mr-1" />
                Warning: Vaccination conflicts with predicted heat cycle. Consider rescheduling.
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )}
  
  // Vaccination and Heat Conflict Warning (shown separately for emphasis)
  {hasVaccinationHeatConflict && nextHeatDate && !isInHeat && !isPreHeat && !vaccinationDueSoon && (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium text-sm shadow-md hover:shadow-lg transition-shadow cursor-help">
            <AlertTriangle className="h-4 w-4" />
            Vaccination-Heat Conflict
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Scheduling Conflict</p>
            <p className="text-xs">
              Upcoming vaccination may interfere with heat cycle.
            </p>
            <p className="text-xs">
              Next heat: {format(nextHeatDate, 'MMM d, yyyy')}
            </p>
            {nextVaccinationDate && (
              <p className="text-xs">
                Next vaccination: {format(nextVaccinationDate, 'MMM d, yyyy')}
              </p>
            )}
            <div className="text-xs px-2 py-1 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded">
              <AlertTriangle className="h-3 w-3 inline-block mr-1" />
              Consider rescheduling vaccination to avoid interference with breeding
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )}
    </div>
  );
};

export default DogStatusCard;
