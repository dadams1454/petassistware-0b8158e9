
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Heart, CalendarDays, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDogStatus, CycleStage } from '../../hooks/useDogStatus';
import { cn } from '@/lib/utils';

interface BreedingCycleCardProps {
  dog: any;
  showCard?: boolean;
}

const BreedingCycleCard: React.FC<BreedingCycleCardProps> = ({ dog, showCard = true }) => {
  // Only show for female dogs
  if (dog.gender !== 'Female') return null;
  
  const { 
    isPregnant, 
    heatCycle, 
    tieDate,
    gestationProgressDays,
    estimatedDueDate,
    hasVaccinationHeatConflict
  } = useDogStatus(dog);

  const { 
    lastHeatDate, 
    nextHeatDate, 
    currentStage, 
    isInHeat,
    isPreHeat,
    daysUntilNextHeat,
    daysIntoCurrentHeat,
    fertileDays,
    recommendedBreedingDays,
    averageCycleLength
  } = heatCycle;

  if (!showCard) return null;

  const cycleProgress = isPregnant 
    ? (gestationProgressDays ? (gestationProgressDays / 63) * 100 : 0)
    : (daysIntoCurrentHeat ? (daysIntoCurrentHeat / averageCycleLength) * 100 : 
      (daysUntilNextHeat ? ((averageCycleLength - daysUntilNextHeat) / averageCycleLength) * 100 : 0));

  const today = new Date();
  const isFertileWindow = fertileDays.start && fertileDays.end
    ? (isAfter(today, fertileDays.start) && isBefore(today, fertileDays.end))
    : false;

  const isOptimalBreedingWindow = recommendedBreedingDays.start && recommendedBreedingDays.end
    ? (isAfter(today, recommendedBreedingDays.start) && isBefore(today, recommendedBreedingDays.end))
    : false;

  const formatDay = (date: Date | null) => {
    if (!date) return "Unknown";
    return format(date, "MMM d, yyyy");
  };

  if (isPregnant) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
            Pregnancy Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Day {gestationProgressDays || 0}</span>
                <span>Day 63</span>
              </div>
              <Progress value={cycleProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Breeding Date</div>
                <div className="font-medium">{tieDate ? format(new Date(tieDate), "MMM d, yyyy") : "Unknown"}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground">Due Date</div>
                <div className="font-medium">{estimatedDueDate ? format(estimatedDueDate, "MMM d, yyyy") : "Unknown"}</div>
              </div>
              
              <div className="col-span-2">
                <div className="text-muted-foreground">Status</div>
                <div className="font-medium">
                  {gestationProgressDays ? pregnancyStageLabel(gestationProgressDays) : "Early Pregnancy"}
                </div>
              </div>
              
              {gestationProgressDays && gestationProgressDays >= 45 && (
                <div className="col-span-2 mt-2 p-2 bg-blue-50 text-blue-800 rounded-md text-xs">
                  <CheckCircle className="inline-block h-3 w-3 mr-1" />
                  Prepare whelping box and supplies soon
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Heat Cycle Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heat Cycle Status Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cycle Status</span>
              {currentStage && (
                <Badge 
                  variant="outline" 
                  className={`bg-${currentStage.color} text-gray-800 dark:text-gray-100`}
                >
                  {currentStage.name}
                </Badge>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Day {daysIntoCurrentHeat || 0}</span>
                <span>Day {averageCycleLength}</span>
              </div>
              <Progress value={cycleProgress} className="h-2" />
            </div>
            
            {isInHeat && currentStage && (
              <div className={cn(
                "p-2 rounded-md text-xs",
                currentStage.name === "Estrus" 
                  ? "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                  : "bg-pink-50 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
              )}>
                <p className="font-medium">{currentStage.name} Stage - Day {daysIntoCurrentHeat}</p>
                <p>{currentStage.description}</p>
              </div>
            )}
            
            {isPreHeat && nextHeatDate && (
              <div className="p-2 bg-purple-50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-md text-xs">
                <p className="font-medium">Heat Approaching</p>
                <p>Expected to begin in {daysUntilNextHeat} days ({format(nextHeatDate, "MMM d")})</p>
              </div>
            )}
          </div>
          
          {/* Important Dates Section */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-muted-foreground text-xs">Last Heat</div>
              <div className="font-medium">{lastHeatDate ? format(lastHeatDate, "MMM d, yyyy") : "Unknown"}</div>
            </div>
            
            <div>
              <div className="text-muted-foreground text-xs">Next Heat (est.)</div>
              <div className="font-medium">{nextHeatDate ? format(nextHeatDate, "MMM d, yyyy") : "Unknown"}</div>
            </div>
            
            {isInHeat && (
              <>
                <div>
                  <div className="text-muted-foreground text-xs">Fertile Window</div>
                  <div className={cn("font-medium", isFertileWindow ? "text-red-600" : "")}>
                    {fertileDays.start && fertileDays.end 
                      ? `${format(fertileDays.start, "MMM d")} - ${format(fertileDays.end, "MMM d")}` 
                      : "Unknown"}
                  </div>
                </div>
                
                <div>
                  <div className="text-muted-foreground text-xs">Optimal Breeding</div>
                  <div className={cn("font-medium", isOptimalBreedingWindow ? "text-red-600 font-bold" : "")}>
                    {recommendedBreedingDays.start && recommendedBreedingDays.end 
                      ? `${format(recommendedBreedingDays.start, "MMM d")} - ${format(recommendedBreedingDays.end, "MMM d")}` 
                      : "Unknown"}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Warning Section */}
          {hasVaccinationHeatConflict && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300 text-xs">
              <div className="flex items-start gap-1.5">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Vaccination Conflict Warning</p>
                  <p>Upcoming vaccination may need to be rescheduled due to heat cycle</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper to get pregnancy stage label based on days
function pregnancyStageLabel(days: number): string {
  if (days < 21) return "Early Pregnancy";
  if (days < 42) return "Mid Pregnancy";
  if (days < 58) return "Late Pregnancy";
  return "Pre-Whelping";
}

// Helper to check if date is after another date
function isAfter(date1: Date, date2: Date): boolean {
  return date1.getTime() > date2.getTime();
}

// Helper to check if date is before another date
function isBefore(date1: Date, date2: Date): boolean {
  return date1.getTime() < date2.getTime();
}

export default BreedingCycleCard;
