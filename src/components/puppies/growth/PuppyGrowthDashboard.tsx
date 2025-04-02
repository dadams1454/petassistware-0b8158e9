
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';

import GrowthChart from './GrowthChart';
import WeightForm from './WeightForm';
import WeightTable from './WeightTable';
import { useWeightData } from '@/hooks/useWeightData';
import { WeightRecord } from '@/types/health';

interface PuppyGrowthDashboardProps {
  puppyId: string;
  birthDate?: string; 
}

const PuppyGrowthDashboard: React.FC<PuppyGrowthDashboardProps> = ({ puppyId, birthDate }) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  
  // Use the hook to fetch weight data
  const { weightData, isLoading, addWeightRecord, refetch } = useWeightData(puppyId, undefined, birthDate);
  
  const handleAddWeight = () => {
    setIsAddingWeight(true);
  };
  
  const handleCancelAdd = () => {
    setIsAddingWeight(false);
  };
  
  const handleWeightAdded = async (data: any) => {
    const success = await addWeightRecord(data);
    if (success) {
      setIsAddingWeight(false);
      refetch();
    }
    return success;
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Growth Tracking</CardTitle>
        {!isAddingWeight && (
          <Button 
            onClick={handleAddWeight}
            size="sm"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Weight
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAddingWeight ? (
          <Card className="border-dashed border-2">
            <CardContent className="pt-6">
              <WeightForm
                puppyId={puppyId}
                onSubmit={handleWeightAdded}
                onCancel={handleCancelAdd}
                defaultUnit="oz"
                birthDate={birthDate}
              />
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="chart" value={activeTab} onValueChange={(v) => setActiveTab(v as 'chart' | 'table')}>
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Growth Chart</TabsTrigger>
                <TabsTrigger value="table">Weight History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <p>Loading growth data...</p>
                  </div>
                ) : weightData && weightData.length > 0 ? (
                  <GrowthChart weightData={weightData} />
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <p>No weight records available. Add a weight record to see the growth chart.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="table">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <p>Loading weight history...</p>
                  </div>
                ) : weightData && weightData.length > 0 ? (
                  <WeightTable weightRecords={weightData} />
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <p>No weight records available.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PuppyGrowthDashboard;
