
import React from 'react';
import { format, differenceInDays, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Calendar, AlertCircle, Bell, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDogStatus } from '../../hooks/useDogStatus';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface HeatCycleMonitorProps {
  dog: any;
}

const HeatCycleMonitor: React.FC<HeatCycleMonitorProps> = ({ dog }) => {
  const { toast } = useToast();
  
  // Only applicable for female dogs
  if (dog.gender !== 'Female') {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Heat Cycle Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Heat cycle monitoring is only available for female dogs.</p>
        </CardContent>
      </Card>
    );
  }
  
  const { 
    isPregnant, 
    heatCycle, 
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

  const today = new Date();
  
  // Calculate cycle progress for the progress bar
  const cycleProgress = isPregnant 
    ? 100 // Show full progress if pregnant
    : (daysIntoCurrentHeat 
        ? (daysIntoCurrentHeat / 30) * 100 // Show progress within current heat (focused on first 30 days)
        : (daysUntilNextHeat && nextHeatDate 
            ? 100 - ((daysUntilNextHeat / 14) * 100) // Show countdown if approaching heat
            : 0));
  
  const handleSetupReminder = (date: Date, eventType: string) => {
    // In a real implementation, this would add to a notification system
    // For now, just show a toast
    toast({
      title: "Reminder Set",
      description: `You'll be reminded about ${eventType} on ${format(date, "MMM d, yyyy")}`,
    });
  };
  
  const handleSeparationAlert = () => {
    // In a real implementation, this would trigger separation protocols
    toast({
      title: "Separation Alert",
      description: "This would activate separation protocols for dogs in heat",
      variant: "destructive",
    });
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-2 bg-purple-50 dark:bg-purple-900/20">
        <CardTitle className="text-base flex items-center gap-2">
          <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Heat Cycle Monitor
          {(isInHeat || isPreHeat) && (
            <Badge 
              className={cn(
                "ml-auto",
                isInHeat 
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                  : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
              )}
            >
              {isInHeat ? "In Heat" : "Heat Approaching"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        {/* Status Summary */}
        <div className="space-y-2">
          {isPregnant ? (
            <div className="p-3 bg-pink-50 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 rounded-md border border-pink-200 dark:border-pink-800">
              <p className="flex items-center gap-2 font-medium">
                <Heart className="h-4 w-4 fill-pink-500" />
                Dog is currently pregnant
              </p>
            </div>
          ) : isInHeat ? (
            <div className="p-3 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md border border-red-200 dark:border-red-800">
              <p className="flex items-center gap-2 font-medium">
                <AlertCircle className="h-4 w-4" />
                Dog is in heat - {currentStage?.name} phase
              </p>
              <p className="text-sm mt-1">{currentStage?.description}</p>
              
              {/* Separation Alert Button */}
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full mt-2"
                onClick={handleSeparationAlert}
              >
                Activate Separation Alert
              </Button>
            </div>
          ) : isPreHeat && nextHeatDate ? (
            <div className="p-3 bg-purple-50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-md border border-purple-200 dark:border-purple-800">
              <p className="flex items-center gap-2 font-medium">
                <Calendar className="h-4 w-4" />
                Heat cycle approaching in {daysUntilNextHeat} days
              </p>
              <p className="text-sm mt-1">Expected start: {format(nextHeatDate, 'MMM d, yyyy')}</p>
              
              {/* Set Reminder Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => handleSetupReminder(addDays(nextHeatDate, -2), "upcoming heat")}
              >
                <Bell className="h-3.5 w-3.5 mr-1.5" />
                Set Reminder
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-800">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Dog is not currently in heat
              </p>
              {nextHeatDate && (
                <p className="text-sm mt-1">Next heat expected: {format(nextHeatDate, 'MMM d, yyyy')}</p>
              )}
            </div>
          )}
        </div>
        
        {/* Cycle Timeline if in heat */}
        {isInHeat && currentStage && daysIntoCurrentHeat !== null && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Day {daysIntoCurrentHeat}</span>
              <span>Day 30</span>
            </div>
            <Progress value={cycleProgress} className="h-2" />
            
            {/* Critical Dates */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              {fertileDays.start && fertileDays.end && (
                <div className="col-span-2 bg-red-50 p-2 rounded-md text-red-800 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800">
                  <p className="font-medium">Fertile Window:</p>
                  <p>{format(fertileDays.start, 'MMM d')} - {format(fertileDays.end, 'MMM d')}</p>
                  
                  {recommendedBreedingDays.start && recommendedBreedingDays.end && (
                    <div className="mt-1">
                      <p className="font-medium">Optimal Breeding:</p>
                      <p>{format(recommendedBreedingDays.start, 'MMM d')} - {format(recommendedBreedingDays.end, 'MMM d')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Key Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm pt-2">
          <div>
            <p className="text-muted-foreground">Last Heat:</p>
            <p className="font-medium">{lastHeatDate ? format(lastHeatDate, 'MMM d, yyyy') : 'Not recorded'}</p>
          </div>
          
          {!isPregnant && nextHeatDate && (
            <div>
              <p className="text-muted-foreground">Next Heat (est):</p>
              <p className="font-medium flex items-center">
                {format(nextHeatDate, 'MMM d, yyyy')}
                {hasVaccinationHeatConflict && (
                  <AlertCircle className="h-3.5 w-3.5 ml-1.5 text-amber-500" />
                )}
              </p>
            </div>
          )}
        </div>
        
        {/* Conflict Warning */}
        {hasVaccinationHeatConflict && (
          <div className="p-2 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 rounded-md border border-amber-200 dark:border-amber-800 text-sm">
            <p className="flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              Heat cycle conflicts with scheduled vaccinations. Consider rescheduling vaccinations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeatCycleMonitor;
