
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar, Heart, Clock, AlertTriangle, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BreedingTimingOptimizerProps {
  dog: any;
  heatCycle: any;
}

const BreedingTimingOptimizer: React.FC<BreedingTimingOptimizerProps> = ({ dog, heatCycle }) => {
  const { 
    isInHeat, 
    isPreHeat, 
    currentStage,
    fertileDays,
    recommendedBreedingDays,
    lastHeatDate,
    nextHeatDate
  } = heatCycle;
  
  // If not in heat or approaching heat, show planning view
  if (!isInHeat && !isPreHeat) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Breeding Timing Optimizer</CardTitle>
          <CardDescription>
            Plan your breeding based on optimal timing for success
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Not Currently in Breeding Window</h3>
                <p className="text-sm text-amber-700 mt-1">
                  The dog is not currently in heat or approaching heat. Breeding timing optimization is available during heat cycles.
                </p>
                
                {lastHeatDate && nextHeatDate && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Last heat: {format(lastHeatDate, 'MMM d, yyyy')}</span>
                      <span>Next heat: {format(nextHeatDate, 'MMM d, yyyy')}</span>
                    </div>
                    <Progress value={calculateProgressValue(lastHeatDate, nextHeatDate)} className="h-2" />
                    <p className="text-xs text-amber-700">
                      {differenceInDays(nextHeatDate, new Date())} days until next estimated heat cycle
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard 
              title="Expected Heat Duration"
              value={lastHeatDate ? "18-21 days" : "Unknown"}
              description="Average duration based on breed and history"
              icon={<Clock className="h-5 w-5 text-blue-500" />}
            />
            
            <InfoCard 
              title="Optimal Breeding Window"
              value="Days 10-14 of heat cycle"
              description="When fertility is highest for successful breeding"
              icon={<Heart className="h-5 w-5 text-red-500" />}
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Breeding Preparation Recommendations
            </h3>
            <ul className="mt-2 space-y-2">
              <li className="text-sm text-blue-700 flex items-start">
                <Check className="h-4 w-4 mr-2 mt-0.5" />
                Schedule progesterone testing 7-10 days into the next heat cycle
              </li>
              <li className="text-sm text-blue-700 flex items-start">
                <Check className="h-4 w-4 mr-2 mt-0.5" />
                Plan for Brucellosis testing within 30 days before breeding
              </li>
              <li className="text-sm text-blue-700 flex items-start">
                <Check className="h-4 w-4 mr-2 mt-0.5" />
                Ensure all health testing is current before next breeding cycle
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // In heat or approaching heat - show active optimizer
  return (
    <Card>
      <CardHeader>
        <CardTitle>Breeding Timing Optimizer</CardTitle>
        <CardDescription>
          {isInHeat 
            ? "Active heat cycle - optimize your breeding timing" 
            : "Heat cycle approaching - prepare for optimal breeding"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isInHeat && currentStage && (
          <div className={getStageCardClass(currentStage.name)}>
            <div className="flex items-start space-x-3">
              <Clock className={`h-5 w-5 ${getStageIconClass(currentStage.name)} mt-0.5`} />
              <div>
                <h3 className="font-medium">{currentStage.name} Stage</h3>
                <p className="text-sm mt-1">
                  {currentStage.description}
                </p>
                
                {currentStage.name === 'Proestrus' && (
                  <p className="text-xs mt-2 italic">
                    Breeding not recommended yet. Wait for Estrus stage.
                  </p>
                )}
                
                {currentStage.name === 'Estrus' && (
                  <p className="text-xs mt-2 font-medium">
                    Optimal breeding time! Breed during this window for best results.
                  </p>
                )}
                
                {currentStage.name === 'Diestrus' && (
                  <p className="text-xs mt-2 italic">
                    Breeding window has passed. Wait for next cycle.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {isInHeat && fertileDays.start && fertileDays.end && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-800 flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Fertile Window
            </h3>
            <p className="text-sm text-red-700 mt-1">
              {format(fertileDays.start, 'MMM d')} - {format(fertileDays.end, 'MMM d, yyyy')}
            </p>
            
            <div className="mt-3">
              <div className="relative pt-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Start of Heat</span>
                  <span>End of Heat</span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: "100%" }}
                    className="relative shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-300"
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: `${calculateFertileWindowPosition(fertileDays.start).start}%`,
                        width: `${calculateFertileWindowPosition(fertileDays.start).width}%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 h-full rounded"
                    ></div>
                  </div>
                </div>
                
                <div className="mt-1 text-xs text-red-800 flex justify-center">
                  {isWithinFertileWindow(fertileDays) ? (
                    <span className="font-semibold">Currently in fertile window!</span>
                  ) : isAfterFertileWindow(fertileDays) ? (
                    <span>Fertile window has passed</span>
                  ) : (
                    <span>Fertile window approaching</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isInHeat && recommendedBreedingDays.start && recommendedBreedingDays.end && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Optimal Breeding Days
            </h3>
            <p className="text-sm text-green-700 mt-1">
              {format(recommendedBreedingDays.start, 'MMM d')} - {format(recommendedBreedingDays.end, 'MMM d, yyyy')}
            </p>
            
            {isWithinOptimalBreedingWindow(recommendedBreedingDays) && (
              <div className="mt-2 bg-green-100 p-2 rounded">
                <p className="text-sm font-medium text-green-800">
                  Optimal breeding time is now! Plan breeding within the next {getRemainingDays(recommendedBreedingDays.end)} days.
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <ul className="space-y-2">
                {isInHeat && currentStage && currentStage.name === 'Proestrus' && (
                  <>
                    <ActionItem 
                      label="Schedule progesterone testing" 
                      isPrimary 
                    />
                    <ActionItem 
                      label="Plan stud dog availability" 
                    />
                    <ActionItem 
                      label="Monitor for behavioral changes"
                    />
                  </>
                )}
                
                {isInHeat && currentStage && currentStage.name === 'Estrus' && (
                  <>
                    <ActionItem 
                      label="Arrange breeding" 
                      isPrimary 
                    />
                    <ActionItem 
                      label="Continue progesterone testing" 
                    />
                    <ActionItem 
                      label="Document breeding dates"
                    />
                  </>
                )}
                
                {isInHeat && currentStage && currentStage.name === 'Diestrus' && (
                  <>
                    <ActionItem 
                      label="Monitor for pregnancy signs" 
                      isPrimary 
                    />
                    <ActionItem 
                      label="Schedule pregnancy confirmation" 
                    />
                    <ActionItem 
                      label="Plan nutrition adjustments"
                    />
                  </>
                )}
                
                {isPreHeat && (
                  <>
                    <ActionItem 
                      label="Prepare for upcoming heat" 
                      isPrimary 
                    />
                    <ActionItem 
                      label="Contact stud dog owner" 
                    />
                    <ActionItem 
                      label="Schedule pre-breeding health checks"
                    />
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Timing Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <ul className="space-y-3">
                {isInHeat && currentStage && currentStage.name === 'Estrus' && (
                  <>
                    <RecommendationItem
                      label="First Breeding"
                      value="48-72 hours after LH surge"
                    />
                    <RecommendationItem
                      label="Second Breeding"
                      value="24-48 hours after first breeding"
                    />
                    <RecommendationItem
                      label="Progesterone Level"
                      value="5-8 ng/ml indicates optimal timing"
                    />
                  </>
                )}
                
                {isInHeat && currentStage && currentStage.name !== 'Estrus' && (
                  <>
                    <RecommendationItem
                      label="Optimal Progesterone"
                      value="5-8 ng/ml for breeding"
                    />
                    <RecommendationItem
                      label="Testing Frequency"
                      value="Every 2-3 days during proestrus"
                    />
                    <RecommendationItem
                      label="Breeding Window"
                      value="Days 10-14 of heat cycle (typical)"
                    />
                  </>
                )}
                
                {isPreHeat && (
                  <>
                    <RecommendationItem
                      label="Start Testing"
                      value="Day 5-7 of next heat cycle"
                    />
                    <RecommendationItem
                      label="Breeding Window"
                      value="Days 10-14 of heat cycle (typical)"
                    />
                    <RecommendationItem
                      label="Prepare In Advance"
                      value={`${differenceInDays(nextHeatDate, new Date())} days until estimated heat`}
                    />
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper components
const InfoCard: React.FC<{
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}> = ({ title, value, description, icon }) => (
  <div className="bg-card rounded-lg border p-4">
    <div className="flex items-start">
      <div className="mr-3">{icon}</div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <p className="text-base font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  </div>
);

const ActionItem: React.FC<{ label: string; isPrimary?: boolean }> = ({ label, isPrimary }) => (
  <li className="flex items-start">
    <div className={`mr-2 mt-0.5 h-4 w-4 rounded-full flex items-center justify-center ${isPrimary ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
      <Check className="h-3 w-3" />
    </div>
    <span className={isPrimary ? 'font-medium' : ''}>{label}</span>
  </li>
);

const RecommendationItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <li className="text-sm">
    <div className="text-muted-foreground">{label}</div>
    <div className="font-medium">{value}</div>
  </li>
);

// Helper functions
const calculateProgressValue = (lastHeatDate: Date, nextHeatDate: Date): number => {
  const today = new Date();
  const totalDays = differenceInDays(nextHeatDate, lastHeatDate);
  const daysPassed = differenceInDays(today, lastHeatDate);
  return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
};

const calculateFertileWindowPosition = (fertileDayStart: Date): { start: number; width: number } => {
  // Assuming a 21-day heat cycle where fertile window is typically days 9-15
  return {
    start: (9 / 21) * 100,
    width: (7 / 21) * 100
  };
};

const getStageCardClass = (stageName: string): string => {
  switch (stageName) {
    case 'Proestrus':
      return 'bg-pink-50 border border-pink-200 rounded-lg p-4 text-pink-800';
    case 'Estrus':
      return 'bg-red-50 border border-red-200 rounded-lg p-4 text-red-800';
    case 'Diestrus':
      return 'bg-purple-50 border border-purple-200 rounded-lg p-4 text-purple-800';
    case 'Anestrus':
      return 'bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800';
    default:
      return 'bg-gray-50 border border-gray-200 rounded-lg p-4';
  }
};

const getStageIconClass = (stageName: string): string => {
  switch (stageName) {
    case 'Proestrus':
      return 'text-pink-600';
    case 'Estrus':
      return 'text-red-600';
    case 'Diestrus':
      return 'text-purple-600';
    case 'Anestrus':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

const isWithinFertileWindow = (fertileDays: { start: Date; end: Date }): boolean => {
  const today = new Date();
  return today >= fertileDays.start && today <= fertileDays.end;
};

const isAfterFertileWindow = (fertileDays: { start: Date; end: Date }): boolean => {
  const today = new Date();
  return today > fertileDays.end;
};

const isWithinOptimalBreedingWindow = (breedingDays: { start: Date; end: Date }): boolean => {
  const today = new Date();
  return today >= breedingDays.start && today <= breedingDays.end;
};

const getRemainingDays = (endDate: Date): number => {
  return Math.max(0, differenceInDays(endDate, new Date()) + 1);
};

export default BreedingTimingOptimizer;
