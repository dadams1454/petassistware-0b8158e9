
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, addDays } from 'date-fns';
import { Calendar, Clock, ThumbsUp, AlertTriangle, Heart } from 'lucide-react';

interface BreedingTimingOptimizerProps {
  dog: any;
  heatCycle: any;
}

const BreedingTimingOptimizer: React.FC<BreedingTimingOptimizerProps> = ({ dog, heatCycle }) => {
  const { isInHeat, daysIntoCurrentHeat, fertileDays, recommendedBreedingDays } = heatCycle;
  
  if (!isInHeat) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Breeding Timing Optimizer</CardTitle>
          <CardDescription>
            Plan optimal breeding timing based on heat cycle data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mb-4 text-amber-500" />
            <h3 className="text-lg font-medium">Not Currently in Heat</h3>
            <p className="max-w-md mt-2">
              This tool is only available when the dog is actively in heat. 
              Record a heat cycle to enable breeding optimization.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Breeding Timing Optimizer</CardTitle>
        <CardDescription>
          Recommendations for optimal breeding timing based on current heat cycle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Current Heat Status
          </h3>
          <p className="text-blue-700 mt-1">
            Day {daysIntoCurrentHeat} of heat cycle
          </p>
        </div>
        
        {fertileDays?.start && fertileDays?.end && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Fertile Window
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Period when ovulation occurs and breeding has chance of success
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="border rounded p-3 text-center">
                <div className="text-sm text-muted-foreground">Start</div>
                <div className="font-medium">{format(fertileDays.start, 'MMM d, yyyy')}</div>
              </div>
              <div className="border rounded p-3 text-center">
                <div className="text-sm text-muted-foreground">End</div>
                <div className="font-medium">{format(fertileDays.end, 'MMM d, yyyy')}</div>
              </div>
            </div>
          </div>
        )}
        
        {recommendedBreedingDays?.start && recommendedBreedingDays?.end && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-green-800 font-medium flex items-center">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Optimal Breeding Days
            </h3>
            <p className="text-green-700 mt-1">
              {format(recommendedBreedingDays.start, 'MMM d')} - {format(recommendedBreedingDays.end, 'MMM d')}
            </p>
            <p className="text-sm text-green-600 mt-2">
              This is the ideal window for successful breeding
            </p>
          </div>
        )}
        
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Breeding Recommendation</h3>
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p>
                Schedule breeding attempts every 24-48 hours during the fertile window for the best chance of successful conception.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreedingTimingOptimizer;
