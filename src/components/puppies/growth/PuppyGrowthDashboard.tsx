
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarCheck, ChartLine } from 'lucide-react';
import WeightTracker from '@/components/litters/puppies/weight/WeightTracker';
import PuppyWeightInfo from '@/components/litters/puppies/common/PuppyWeightInfo';
import GrowthMilestoneTracker from './GrowthMilestoneTracker';
import GrowthChart from './GrowthChart';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePuppyDetail } from '@/hooks/usePuppyDetail';
import { LoadingState, ErrorState } from '@/components/ui/standardized';

interface PuppyGrowthDashboardProps {
  puppyId: string;
}

const PuppyGrowthDashboard: React.FC<PuppyGrowthDashboardProps> = ({ puppyId }) => {
  const [activeTab, setActiveTab] = useState('weight');
  const navigate = useNavigate();
  
  const { puppy, isLoading, error } = usePuppyDetail(puppyId);
  
  if (isLoading) {
    return <LoadingState message="Loading puppy data..." />;
  }
  
  if (error || !puppy) {
    return <ErrorState title="Error" message="Failed to load puppy information." />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{puppy.name || 'Puppy'} Growth Tracking</h2>
          <p className="text-muted-foreground">
            Track weight progress, growth trends, and important developmental milestones
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => navigate(`/litters/${puppy.litter_id}`)}
        >
          Back to Litter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-row justify-between">
                <span className="text-sm font-medium">Age:</span>
                <span className="font-semibold">{puppy.ageInDays || 0} days</span>
              </div>
              <div>
                <PuppyWeightInfo 
                  birthWeight={puppy.birth_weight} 
                  currentWeight={puppy.current_weight}
                  displayUnit="both"
                  showTrend={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ChartLine className="h-4 w-4" />
              Growth Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="mb-2">Based on current growth rate:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded p-2 text-center">
                  <div className="text-muted-foreground text-xs">2 weeks</div>
                  <div className="font-semibold">~{calculateProjectedWeight(puppy, 14)} lbs</div>
                </div>
                <div className="border rounded p-2 text-center">
                  <div className="text-muted-foreground text-xs">4 weeks</div>
                  <div className="font-semibold">~{calculateProjectedWeight(puppy, 28)} lbs</div>
                </div>
                <div className="border rounded p-2 text-center">
                  <div className="text-muted-foreground text-xs">8 weeks</div>
                  <div className="font-semibold">~{calculateProjectedWeight(puppy, 56)} lbs</div>
                </div>
                <div className="border rounded p-2 text-center">
                  <div className="text-muted-foreground text-xs">12 weeks</div>
                  <div className="font-semibold">~{calculateProjectedWeight(puppy, 84)} lbs</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              Next Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getUpcomingMilestones(puppy).map((milestone, index) => (
                <Alert key={index} variant={milestone.due ? "destructive" : "default"} className="py-2">
                  <AlertTitle className="text-sm font-semibold">{milestone.title}</AlertTitle>
                  <AlertDescription className="text-xs">
                    {milestone.description}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
          <TabsTrigger value="weight">Weight Tracking</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weight" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WeightTracker puppyId={puppyId} />
            </div>
            <div>
              <GrowthChart puppyId={puppyId} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="milestones" className="pt-4">
          <GrowthMilestoneTracker puppyId={puppyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to calculate projected weight
const calculateProjectedWeight = (puppy: any, targetDays: number): string => {
  // Simple projection based on current weight and birth weight
  if (!puppy.birth_weight || !puppy.current_weight || !puppy.ageInDays || puppy.ageInDays === 0) {
    return "N/A";
  }
  
  // Convert weights to numeric values
  const birthWeight = typeof puppy.birth_weight === 'string' ? 
    parseFloat(puppy.birth_weight) : puppy.birth_weight;
  const currentWeight = typeof puppy.current_weight === 'string' ? 
    parseFloat(puppy.current_weight) : puppy.current_weight;
  
  // Calculate daily growth rate
  const dailyGrowthRate = (currentWeight - birthWeight) / puppy.ageInDays;
  
  // Project weight at target days
  const projectedWeight = birthWeight + (dailyGrowthRate * targetDays);
  
  return projectedWeight.toFixed(1);
};

// Helper function to get upcoming milestones
const getUpcomingMilestones = (puppy: any): Array<{title: string, description: string, due: boolean}> => {
  const age = puppy.ageInDays || 0;
  const milestones = [];
  
  // Define major developmental milestones
  if (age < 14) {
    milestones.push({
      title: "Eyes Opening",
      description: `Expected around day 14 (in ${14 - age} days)`,
      due: age >= 12 && !puppy.eyes_open_date
    });
  }
  
  if (age < 21) {
    milestones.push({
      title: "First Vaccination",
      description: `Due around week 3 (in ${21 - age} days)`,
      due: age >= 19 && !puppy.vaccination_dates
    });
  }
  
  if (age < 28) {
    milestones.push({
      title: "Weaning",
      description: `Begin around week 4 (in ${28 - age} days)`,
      due: false
    });
  }
  
  if (age < 42) {
    milestones.push({
      title: "Second Vaccination",
      description: `Due around week 6 (in ${42 - age} days)`,
      due: age >= 40 && (!puppy.vaccination_dates || !puppy.vaccination_dates.includes('second'))
    });
  }
  
  if (age < 56) {
    milestones.push({
      title: "Go Home Day",
      description: `Around week 8 (in ${56 - age} days)`,
      due: false
    });
  }
  
  // If no milestones are upcoming (older puppy)
  if (milestones.length === 0) {
    milestones.push({
      title: "All Major Milestones Completed",
      description: "This puppy has passed the major developmental milestones.",
      due: false
    });
  }
  
  return milestones.slice(0, 3); // Return just the next 3 milestones
};

export default PuppyGrowthDashboard;
