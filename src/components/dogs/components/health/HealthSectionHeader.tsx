
import React from 'react';
import { useDogStatus } from '../../hooks/useDogStatus';
import { AlertTriangle, Calendar, Heart, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, addDays } from 'date-fns';

interface HealthSectionHeaderProps {
  gender: string;
  dog: any;
}

const HealthSectionHeader: React.FC<HealthSectionHeaderProps> = ({
  gender,
  dog
}) => {
  if (gender !== 'Female') return null;
  
  const {
    isPregnant,
    heatCycle,
    hasVaccinationHeatConflict,
    tieDate,
    estimatedDueDate,
    gestationProgressDays
  } = useDogStatus(dog);
  
  const {
    lastHeatDate,
    nextHeatDate,
    isInHeat,
    isPreHeat,
    currentStage,
    fertileDays
  } = heatCycle;
  
  return (
    <div className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-base text-purple-800 dark:text-purple-300">Breeding Information</h4>
        {isPregnant && (
          <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            Pregnant
          </span>
        )}
        
        {isInHeat && currentStage && (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            {currentStage.name}
          </span>
        )}
        
        {isPreHeat && !isInHeat && !isPregnant && (
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
            Heat Approaching
          </span>
        )}
      </div>
      
      <BreedingInfoSection 
        isPregnant={isPregnant}
        lastHeatDate={lastHeatDate}
        nextHeatDate={nextHeatDate}
        tieDate={tieDate}
        estimatedDueDate={estimatedDueDate}
        gestationProgressDays={gestationProgressDays}
        hasVaccinationConflict={hasVaccinationHeatConflict}
        isInHeat={isInHeat}
        currentStage={currentStage}
        isPreHeat={isPreHeat}
        fertileDays={fertileDays}
        litterNumber={dog.litter_number || 0}
      />
    </div>
  );
};

const BreedingInfoSection = ({
  isPregnant,
  lastHeatDate,
  nextHeatDate,
  tieDate,
  estimatedDueDate,
  gestationProgressDays,
  hasVaccinationConflict,
  isInHeat,
  currentStage,
  isPreHeat,
  fertileDays,
  litterNumber
}: {
  isPregnant: boolean;
  lastHeatDate: Date | null;
  nextHeatDate: Date | null;
  tieDate: Date | null;
  estimatedDueDate: Date | null;
  gestationProgressDays: number | null;
  hasVaccinationConflict: boolean;
  isInHeat: boolean;
  currentStage: any;
  isPreHeat: boolean;
  fertileDays: { start: Date | null; end: Date | null };
  litterNumber: number;
}) => {
  return (
    <div className="space-y-2 text-sm">
      {lastHeatDate && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 text-purple-700 dark:text-purple-300" />
            <span className="text-purple-700 dark:text-purple-300">Last Heat:</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium hover:underline cursor-help">
                  {format(lastHeatDate, "MMM d, yyyy")}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Last recorded heat cycle start date
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      {nextHeatDate && !isPregnant && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 text-purple-700 dark:text-purple-300" />
            <span className="text-purple-700 dark:text-purple-300">
              {isInHeat ? "Current Heat Cycle:" : "Next Heat (est):"}
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center font-medium hover:underline cursor-help">
                  <span>{isInHeat ? "In Progress" : format(nextHeatDate, "MMM d, yyyy")}</span>
                  {hasVaccinationConflict && (
                    <AlertTriangle className="h-3.5 w-3.5 ml-1.5 text-amber-500 dark:text-amber-400" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3 space-y-2">
                {isInHeat && currentStage ? (
                  <>
                    <p className="text-sm font-medium">{currentStage.name} Stage</p>
                    <p className="text-xs">{currentStage.description}</p>
                  </>
                ) : (
                  <p className="text-sm">
                    Estimated next heat cycle start date
                  </p>
                )}
                
                {hasVaccinationConflict && (
                  <div className="text-xs bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 p-2 rounded">
                    Warning: Heat cycle may conflict with upcoming vaccinations
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      {isInHeat && fertileDays.start && fertileDays.end && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1 text-purple-700 dark:text-purple-300" />
            <span className="text-purple-700 dark:text-purple-300">Fertile Window:</span>
          </div>
          <span className="font-medium text-red-600 dark:text-red-400">
            {format(fertileDays.start, "MMM d")} - {format(fertileDays.end, "MMM d")}
          </span>
        </div>
      )}
      
      {isPregnant && tieDate && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 text-purple-700 dark:text-purple-300" />
            <span className="text-purple-700 dark:text-purple-300">Breeding Date:</span>
          </div>
          <span className="font-medium">{format(tieDate, "MMM d, yyyy")}</span>
        </div>
      )}
      
      {isPregnant && estimatedDueDate && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 text-purple-700 dark:text-purple-300" />
            <span className="text-purple-700 dark:text-purple-300">Due Date (est):</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium text-pink-600 dark:text-pink-400 hover:underline cursor-help">
                  {format(estimatedDueDate, "MMM d, yyyy")}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  {gestationProgressDays !== null && (
                    <>Currently at day {gestationProgressDays} of gestation ({63 - gestationProgressDays} days remaining)</>
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      {litterNumber > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Heart className="h-3.5 w-3.5 mr-1 text-purple-700 dark:text-purple-300" />
            <span className="text-purple-700 dark:text-purple-300">Previous Litters:</span>
          </div>
          <span className="font-medium">{litterNumber}</span>
        </div>
      )}
      
      {hasVaccinationConflict && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300">
          <div className="flex items-start gap-1.5">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Warning:</strong> Upcoming vaccinations may conflict with the heat cycle. Consider rescheduling.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthSectionHeader;
