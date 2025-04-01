
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, differenceInDays } from 'date-fns';
import { Calendar, Clock, Heart, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDogStatus } from '../../hooks/useDogStatus';

interface BreedingTimingIndicatorProps {
  dogId: string;
}

const BreedingTimingIndicator: React.FC<BreedingTimingIndicatorProps> = ({ dogId }) => {
  const { data: dog, isLoading } = useQuery({
    queryKey: ['dog-for-breeding', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', dogId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!dogId
  });

  const { heatCycle } = useDogStatus(dog || {});
  
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading cycle data...</p>
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Error loading dog data
      </div>
    );
  }

  // Female dogs only, and not pregnant
  if (dog.gender !== 'Female' || dog.is_pregnant) {
    return null;
  }

  const { 
    isInHeat, 
    currentStage, 
    lastHeatDate, 
    nextHeatDate, 
    fertileDays,
    recommendedBreedingDays,
    daysIntoCurrentHeat,
    daysUntilNextHeat
  } = heatCycle;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Breeding Window Information</CardTitle>
          <CardDescription>
            Indicators to help determine optimal breeding timing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isInHeat ? (
            <CurrentHeatCycleIndicator 
              currentStage={currentStage} 
              daysIntoHeat={daysIntoCurrentHeat || 0}
              fertileDays={fertileDays}
              recommendedBreedingDays={recommendedBreedingDays}
              lastHeatDate={lastHeatDate}
            />
          ) : (
            <UpcomingHeatCycleIndicator 
              nextHeatDate={nextHeatDate} 
              daysUntilNextHeat={daysUntilNextHeat}
              lastHeatDate={lastHeatDate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface CurrentHeatCycleIndicatorProps {
  currentStage: any;
  daysIntoHeat: number;
  fertileDays: any;
  recommendedBreedingDays: any;
  lastHeatDate?: Date;
}

const CurrentHeatCycleIndicator: React.FC<CurrentHeatCycleIndicatorProps> = ({ 
  currentStage, 
  daysIntoHeat, 
  fertileDays,
  recommendedBreedingDays,
  lastHeatDate
}) => {
  const today = new Date();
  const isFertileNow = fertileDays?.start && fertileDays?.end && 
    today >= fertileDays.start && today <= fertileDays.end;
  
  const isRecommendedBreedingTime = recommendedBreedingDays?.start && recommendedBreedingDays?.end && 
    today >= recommendedBreedingDays.start && today <= recommendedBreedingDays.end;
  
  const fertileStartsIn = fertileDays?.start && today < fertileDays.start ? 
    differenceInDays(fertileDays.start, today) : null;
  
  const fertileEndsIn = fertileDays?.end && today <= fertileDays.end ? 
    differenceInDays(fertileDays.end, today) : null;

  return (
    <div className="space-y-4">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4">
        <div className="flex items-start">
          <Heart className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium">Currently In Heat - {currentStage?.name || 'Active Phase'}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Day {daysIntoHeat} of heat cycle {lastHeatDate ? `(started ${format(lastHeatDate, 'MMM d, yyyy')})` : ''}
            </p>
            
            {currentStage && (
              <p className="text-sm mt-2">{currentStage.description}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="relative pt-2">
        <div className="overflow-hidden h-3 mb-1 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
          <div 
            style={{ width: `${Math.min((daysIntoHeat / 21) * 100, 100)}%` }} 
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
              daysIntoHeat <= 9 ? 'bg-pink-500' : 
              daysIntoHeat <= 14 ? 'bg-red-500' : 'bg-purple-500'
            }`}
          ></div>
        </div>
        <div className="flex justify-between">
          <span className="text-xs">Day 0</span>
          <span className="text-xs">Day 10</span>
          <span className="text-xs">Day 21</span>
        </div>
        <div className="flex justify-between mt-1 text-xs">
          <span>Proestrus</span>
          <span>Estrus</span>
          <span>Diestrus</span>
        </div>
      </div>
      
      {isFertileNow && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mt-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">Fertile Window Active</h3>
              <p className="text-sm mt-1">
                Current date is within the fertile window.
                {fertileDays?.end && (
                  <span> Window ends in {differenceInDays(fertileDays.end, today)} days.</span>
                )}
              </p>
              {isRecommendedBreedingTime && (
                <p className="text-sm font-medium mt-2 text-amber-600 dark:text-amber-400">
                  OPTIMAL BREEDING TIME (NOW)
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {fertileStartsIn !== null && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mt-4">
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">Approaching Fertile Window</h3>
              <p className="text-sm mt-1">
                Fertile window begins in {fertileStartsIn} days
                {fertileDays?.start && (
                  <span> ({format(fertileDays.start, 'MMM d')} - {format(fertileDays.end, 'MMM d')})</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {recommendedBreedingDays?.start && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Optimal Breeding Days</h4>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm">
                {format(recommendedBreedingDays.start, 'MMM d')} - {format(recommendedBreedingDays.end, 'MMM d')}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                isRecommendedBreedingTime ? 
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
              }`}>
                {isRecommendedBreedingTime ? 'Active Now' : today > recommendedBreedingDays.end ? 'Passed' : 'Upcoming'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface UpcomingHeatCycleIndicatorProps {
  nextHeatDate?: Date;
  daysUntilNextHeat?: number;
  lastHeatDate?: Date;
}

const UpcomingHeatCycleIndicator: React.FC<UpcomingHeatCycleIndicatorProps> = ({ 
  nextHeatDate, 
  daysUntilNextHeat,
  lastHeatDate
}) => {
  if (!nextHeatDate) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>No heat cycle data available to predict breeding windows.</p>
        <p className="text-sm mt-2">Record heat cycle data to see optimal breeding predictions.</p>
      </div>
    );
  }

  const isApproaching = daysUntilNextHeat && daysUntilNextHeat <= 14;

  return (
    <div className="space-y-4">
      {isApproaching ? (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-900 rounded-lg p-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">Heat Cycle Approaching</h3>
              <p className="text-sm mt-1">
                Next heat cycle expected to begin in {daysUntilNextHeat} days
                {nextHeatDate && (
                  <span> ({format(nextHeatDate, 'MMM d, yyyy')})</span>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">Next Heat Cycle Prediction</h3>
              <p className="text-sm mt-1">
                Next heat cycle expected to begin on {format(nextHeatDate, 'MMM d, yyyy')}
                {daysUntilNextHeat && (
                  <span> ({daysUntilNextHeat} days from now)</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {lastHeatDate && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Previous Heat Cycle</h4>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm">Last heat started on {format(lastHeatDate, 'MMM d, yyyy')}</span>
              <span className="text-xs text-muted-foreground">
                {differenceInDays(new Date(), lastHeatDate)} days ago
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Breeding Window Prediction</h4>
        {nextHeatDate ? (
          <div className="space-y-2">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-sm">Predicted Fertile Window</span>
                <span className="text-sm font-medium">
                  {format(new Date(nextHeatDate.getTime() + 9 * 24 * 60 * 60 * 1000), 'MMM d')} - {format(new Date(nextHeatDate.getTime() + 13 * 24 * 60 * 60 * 1000), 'MMM d')}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-sm">Optimal Breeding Days</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {format(new Date(nextHeatDate.getTime() + 10 * 24 * 60 * 60 * 1000), 'MMM d')} - {format(new Date(nextHeatDate.getTime() + 12 * 24 * 60 * 60 * 1000), 'MMM d')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <p>Record heat cycle data to see breeding window predictions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreedingTimingIndicator;
