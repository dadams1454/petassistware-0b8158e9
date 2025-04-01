
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, differenceInDays } from 'date-fns';
import { useDogStatus } from '../../hooks/useDogStatus';
import BreedingCycleCard from './BreedingCycleCard';
import { Heart, AlertTriangle, Calendar, Check, Clipboard, Info } from 'lucide-react';
import { BreedingRecommendations } from './BreedingRecommendations';
import { useNavigate } from 'react-router-dom';

interface BreedingDashboardProps {
  dog: any;
}

const BreedingDashboard: React.FC<BreedingDashboardProps> = ({ dog }) => {
  const navigate = useNavigate();
  // Only relevant for female dogs
  if (dog.gender !== 'Female') {
    return <NonFemaleDogMessage dog={dog} />;
  }

  const { 
    isPregnant, 
    heatCycle, 
    estimatedDueDate,
    gestationProgressDays,
    tieDate
  } = useDogStatus(dog);
  
  const { 
    isInHeat,
    isPreHeat,
    lastHeatDate,
    nextHeatDate,
    daysUntilNextHeat,
    currentStage
  } = heatCycle;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Breeding Management</h2>
        
        <div className="flex items-center gap-2">
          <div className="flex space-x-2">
            {isPregnant && (
              <Badge className="bg-pink-500">Pregnant</Badge>
            )}
            
            {isInHeat && currentStage && (
              <Badge className="bg-red-500">In Heat ({currentStage.name})</Badge>
            )}
            
            {isPreHeat && !isInHeat && !isPregnant && (
              <Badge className="bg-purple-500">Heat Approaching</Badge>
            )}
            
            {!isPregnant && !isInHeat && !isPreHeat && (
              <Badge variant="outline">Not Breeding</Badge>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dogs/${dog.id}/reproductive`)}
          >
            Advanced Tracking
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cycle">Heat Cycle</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <CurrentStatusSection 
                      isPregnant={isPregnant}
                      isInHeat={isInHeat}
                      isPreHeat={isPreHeat}
                      currentStage={currentStage}
                      tieDate={tieDate}
                      estimatedDueDate={estimatedDueDate}
                      gestationProgressDays={gestationProgressDays}
                      nextHeatDate={nextHeatDate}
                      daysUntilNextHeat={daysUntilNextHeat}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard 
                        label="Last Heat Date" 
                        value={lastHeatDate ? format(lastHeatDate, "MMM d, yyyy") : "Not recorded"}
                        icon={<Calendar className="h-4 w-4 text-gray-500" />}
                      />
                      
                      <InfoCard 
                        label="Next Heat (est.)" 
                        value={nextHeatDate ? format(nextHeatDate, "MMM d, yyyy") : "Unknown"}
                        subtext={daysUntilNextHeat ? `In ${daysUntilNextHeat} days` : undefined}
                        icon={<Calendar className="h-4 w-4 text-purple-500" />}
                      />
                      
                      <InfoCard 
                        label="Litter Count" 
                        value={`${dog.litter_number || 0} of 4`}
                        icon={<Heart className="h-4 w-4 text-pink-500" />}
                      />
                      
                      <InfoCard 
                        label="Breeding Status" 
                        value={getBreedingStatus(dog, isPregnant, isInHeat, isPreHeat)}
                        icon={<Clipboard className="h-4 w-4 text-blue-500" />}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cycle">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <BreedingCycleCard dog={dog} showCard={false} />
                    
                    <CycleHistoryTimeline dog={dog} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations">
              <Card>
                <CardContent className="pt-6">
                  <BreedingRecommendations dog={dog} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <BreedingCycleCard dog={dog} />
          
          <BreedingUpcomingEvents dog={dog} className="mt-6" />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const CurrentStatusSection = ({ 
  isPregnant, 
  isInHeat, 
  isPreHeat, 
  currentStage, 
  tieDate, 
  estimatedDueDate,
  gestationProgressDays,
  nextHeatDate,
  daysUntilNextHeat
}: { 
  isPregnant: boolean; 
  isInHeat: boolean; 
  isPreHeat: boolean; 
  currentStage: any; 
  tieDate: string | null;
  estimatedDueDate: Date | null;
  gestationProgressDays: number | null;
  nextHeatDate: Date | null;
  daysUntilNextHeat: number | null;
}) => {
  if (isPregnant) {
    return (
      <div className="p-4 bg-pink-50 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300 rounded-lg border border-pink-200 dark:border-pink-800">
        <div className="flex items-start gap-2">
          <Heart className="h-5 w-5 fill-pink-500 text-pink-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-base">Pregnant</h3>
            <p className="text-sm">
              {gestationProgressDays !== null ? `Day ${gestationProgressDays} of gestation` : 'Early pregnancy'}
            </p>
            {tieDate && (
              <p className="text-sm mt-1">
                Breeding date: {format(new Date(tieDate), "MMM d, yyyy")}
              </p>
            )}
            {estimatedDueDate && (
              <p className="text-sm font-medium mt-1">
                Due date: {format(estimatedDueDate, "MMM d, yyyy")}
                {gestationProgressDays !== null && (
                  <> ({63 - gestationProgressDays} days remaining)</>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  if (isInHeat && currentStage) {
    return (
      <div className="p-4 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-base">In Heat - {currentStage.name} Stage</h3>
            <p className="text-sm">{currentStage.description}</p>
            {currentStage.name === 'Estrus' && (
              <p className="text-sm font-medium mt-1">
                This is the optimal time for breeding if desired
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  if (isPreHeat && nextHeatDate) {
    return (
      <div className="p-4 bg-purple-50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-2">
          <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-base">Heat Cycle Approaching</h3>
            <p className="text-sm">
              Heat expected to begin in {daysUntilNextHeat} days
            </p>
            <p className="text-sm font-medium mt-1">
              Predicted start: {format(nextHeatDate, "MMM d, yyyy")}
            </p>
            <p className="text-sm mt-1">
              Begin preparing now for proper management during the heat cycle
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-2">
        <Check className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <h3 className="font-semibold text-base">Not Currently Breeding</h3>
          <p className="text-sm">
            {nextHeatDate 
              ? `Next heat cycle expected around ${format(nextHeatDate, "MMM d, yyyy")}` 
              : "No heat cycle data available to predict next cycle"}
          </p>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ 
  label, 
  value, 
  subtext, 
  icon 
}: { 
  label: string; 
  value: string; 
  subtext?: string; 
  icon: React.ReactNode 
}) => (
  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-sm">{value}</p>
        {subtext && <p className="text-xs text-muted-foreground mt-0.5">{subtext}</p>}
      </div>
      {icon}
    </div>
  </div>
);

const CycleHistoryTimeline = ({ dog }: { dog: any }) => {
  // In a real app, this would come from historical heat cycle data
  // For now, we'll simulate some history from the last heat date
  const lastHeatDate = dog.last_heat_date ? new Date(dog.last_heat_date) : null;
  
  if (!lastHeatDate) {
    return (
      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md text-center text-sm text-muted-foreground">
        No heat cycle history available
      </div>
    );
  }
  
  // Calculate some previous cycles based on the last one (for demonstration)
  const cycleHistory = [
    { date: lastHeatDate, notes: "Normal cycle, duration: 21 days" },
    { date: new Date(lastHeatDate.getTime() - 180 * 24 * 60 * 60 * 1000), notes: "Normal cycle, duration: 20 days" },
    { date: new Date(lastHeatDate.getTime() - 360 * 24 * 60 * 60 * 1000), notes: "Slightly longer cycle, duration: 24 days" },
  ];
  
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium">Heat Cycle History</h3>
      <div className="pl-2 border-l-2 border-gray-200 dark:border-gray-700 space-y-4 py-2">
        {cycleHistory.map((cycle, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-[25px] mt-0.5 w-4 h-4 bg-pink-100 dark:bg-pink-900 border-2 border-pink-500 dark:border-pink-300 rounded-full"></div>
            <div className="text-sm">
              <p className="font-medium">{format(cycle.date, "MMM d, yyyy")}</p>
              <p className="text-xs text-muted-foreground">{cycle.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BreedingUpcomingEvents = ({ dog, className }: { dog: any, className?: string }) => {
  const { 
    isPregnant, 
    heatCycle,
    estimatedDueDate,
    tieDate
  } = useDogStatus(dog);
  
  const { 
    nextHeatDate,
    daysUntilNextHeat,
    isInHeat
  } = heatCycle;
  
  const today = new Date();
  
  // Generate upcoming events based on pregnancy or heat cycle status
  const upcomingEvents = [];
  
  if (isPregnant && tieDate && estimatedDueDate) {
    const breedingDate = new Date(tieDate);
    
    // Ultrasound date ~30 days after breeding
    const ultrasoundDate = new Date(breedingDate);
    ultrasoundDate.setDate(ultrasoundDate.getDate() + 30);
    
    // X-ray date ~55 days after breeding
    const xrayDate = new Date(breedingDate);
    xrayDate.setDate(xrayDate.getDate() + 55);
    
    // Whelping prep 1 week before due date
    const whelpingPrepDate = new Date(estimatedDueDate);
    whelpingPrepDate.setDate(whelpingPrepDate.getDate() - 7);
    
    if (isAfter(ultrasoundDate, today)) {
      upcomingEvents.push({
        date: ultrasoundDate,
        title: "Pregnancy Ultrasound",
        type: "health"
      });
    }
    
    if (isAfter(xrayDate, today)) {
      upcomingEvents.push({
        date: xrayDate,
        title: "Pregnancy X-ray",
        type: "health"
      });
    }
    
    if (isAfter(whelpingPrepDate, today)) {
      upcomingEvents.push({
        date: whelpingPrepDate,
        title: "Prepare Whelping Box",
        type: "task"
      });
    }
    
    upcomingEvents.push({
      date: estimatedDueDate,
      title: "Expected Whelping Date",
      type: "critical"
    });
  } else if (!isPregnant && nextHeatDate) {
    if (isInHeat) {
      // Already in heat, calculate events related to current heat
      const proestrusEndDate = new Date(nextHeatDate);
      proestrusEndDate.setDate(proestrusEndDate.getDate() - daysUntilNextHeat! + 9);
      
      const estrusStartDate = new Date(proestrusEndDate);
      
      const estrusEndDate = new Date(nextHeatDate);
      estrusEndDate.setDate(estrusEndDate.getDate() - daysUntilNextHeat! + 15);
      
      if (isAfter(proestrusEndDate, today)) {
        upcomingEvents.push({
          date: proestrusEndDate,
          title: "Proestrus End / Estrus Begin",
          type: "breeding"
        });
      }
      
      if (isAfter(estrusEndDate, today)) {
        upcomingEvents.push({
          date: estrusEndDate,
          title: "Estrus End / Diestrus Begin",
          type: "breeding"
        });
      }
    } else {
      // Approaching heat or between cycles
      const preHeatPrep = new Date(nextHeatDate);
      preHeatPrep.setDate(preHeatPrep.getDate() - 14);
      
      if (isAfter(preHeatPrep, today)) {
        upcomingEvents.push({
          date: preHeatPrep,
          title: "Heat Cycle Preparation",
          type: "task"
        });
      }
      
      upcomingEvents.push({
        date: nextHeatDate,
        title: "Heat Cycle (Expected Start)",
        type: "breeding"
      });
    }
  }
  
  // Sort events by date
  upcomingEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Upcoming Breeding Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex justify-between items-start gap-2">
                <div className="min-w-[60px] text-xs text-muted-foreground">
                  {format(event.date, "MMM d")}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{event.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {differenceInDays(event.date, today) === 0 
                      ? "Today" 
                      : `In ${differenceInDays(event.date, today)} days`}
                  </div>
                </div>
                <div>
                  <Badge 
                    variant="outline" 
                    className={
                      event.type === "critical" 
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                        : event.type === "breeding" 
                          ? "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
                          : event.type === "health" 
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }
                  >
                    {event.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-4">
            No upcoming breeding events
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// For male dogs, show a different message
const NonFemaleDogMessage = ({ dog }: { dog: any }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Breeding Management</h2>
      <Badge variant="outline">Male Dog</Badge>
    </div>
    
    <Card>
      <CardContent className="pt-6">
        <div className="p-4 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Information className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-base">Male Breeding Information</h3>
              <p className="text-sm">
                Detailed heat cycle tracking is available for female dogs only. Male dogs can breed year-round once mature.
              </p>
              <p className="text-sm mt-1">
                For stud services, track breeding dates and partners in the breeding history section.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Helper to determine breeding status display
function getBreedingStatus(dog: any, isPregnant: boolean, isInHeat: boolean, isPreHeat: boolean): string {
  if (isPregnant) return "Pregnant";
  if (isInHeat) return "In Heat";
  if (isPreHeat) return "Heat Approaching";
  
  if (dog.gender !== 'Female') return "Male (Stud)";
  
  return "Not Breeding";
}

// Helper components
const Information = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

// Helper to check if a date is after today
function isAfter(date: Date, today: Date): boolean {
  return date.getTime() > today.getTime();
}

export default BreedingDashboard;
