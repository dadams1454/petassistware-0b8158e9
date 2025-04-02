import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeightTracker from '@/components/litters/puppies/weight/WeightTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWeightData } from '@/hooks/useWeightData';

interface PuppyGrowthDashboardProps {
  puppyId: string;
  puppyName?: string;
  birthDate?: string;
}

const PuppyGrowthDashboard: React.FC<PuppyGrowthDashboardProps> = ({
  puppyId,
  puppyName = "Puppy",
  birthDate
}) => {
  const [activeTab, setActiveTab] = useState("weight");
  const { weightRecords, isLoading, fetchWeightHistory } = useWeightData({ puppyId });
  
  // Handle refresh
  const handleRefresh = async () => {
    await fetchWeightHistory();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{puppyName}'s Growth Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weight" className="space-y-4">
          <TabsList>
            <TabsTrigger value="weight">Weight Tracker</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="socialization">Socialization</TabsTrigger>
          </TabsList>
          <TabsContent value="weight">
            <div className="mt-4">
              <WeightTracker
                puppyId={puppyId}
                birthDate={birthDate}
                onAddSuccess={handleRefresh}
              />
            </div>
          </TabsContent>
          <TabsContent value="milestones">
            <div>
              <p>Milestones content coming soon</p>
            </div>
          </TabsContent>
          <TabsContent value="socialization">
            <div>
              <p>Socialization content coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PuppyGrowthDashboard;
