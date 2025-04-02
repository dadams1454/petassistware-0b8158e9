
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import { usePuppyDetail } from '@/hooks/usePuppyDetail';
import GrowthChart from './GrowthChart';
import GrowthMilestoneTracker from './GrowthMilestoneTracker';
import WeightForm from './WeightForm';

interface PuppyGrowthDashboardProps {
  puppyId: string;
}

const PuppyGrowthDashboard: React.FC<PuppyGrowthDashboardProps> = ({ puppyId }) => {
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');
  
  const { 
    data: puppy, 
    isLoading, 
    error 
  } = usePuppyDetail(puppyId);
  
  if (isLoading) {
    return <LoadingState message="Loading puppy growth data..." />;
  }
  
  if (error || !puppy) {
    return (
      <ErrorState 
        title="Error Loading Puppy Data" 
        message={`Could not load puppy data: ${(error as Error)?.message || 'Unknown error'}`}
      />
    );
  }

  const handleWeightSuccess = () => {
    setIsAddingWeight(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Growth Chart</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button
          onClick={() => setIsAddingWeight(true)}
          disabled={isAddingWeight}
        >
          Add New Weight
        </Button>
      </div>
      
      {isAddingWeight && (
        <WeightForm 
          puppyId={puppyId} 
          birthDate={puppy.birth_date || puppy.litter?.birth_date}
          onCancel={() => setIsAddingWeight(false)}
          onSuccess={handleWeightSuccess}
          onSubmit={async (data) => {
            // Handle submission
            console.log('Submitting weight data:', data);
            return true;
          }}
          defaultUnit="oz"
        />
      )}
      
      <TabsContent value="chart" className="mt-0">
        <GrowthChart puppyId={puppyId} />
      </TabsContent>
      
      <TabsContent value="milestones" className="mt-0">
        <GrowthMilestoneTracker puppyId={puppyId} />
      </TabsContent>
    </div>
  );
};

export default PuppyGrowthDashboard;
