
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import { usePuppyDetails } from '@/hooks/usePuppyDetails';
import { usePuppyWeights } from '@/hooks/usePuppyWeights';
import WeightChartView from './weight/WeightChartView';
import WeightTableView from './weight/WeightTableView';
import WeightForm from './weight/WeightForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Table, LineChart } from 'lucide-react';
import { WeightUnit } from '@/types/puppyTracking';

interface WeightTabProps {
  puppyId: string;
}

const WeightTab: React.FC<WeightTabProps> = ({ puppyId }) => {
  const [activeTab, setActiveTab] = useState('chart');
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [displayUnit, setDisplayUnit] = useState<WeightUnit>('oz');
  
  const puppy = usePuppyDetails(puppyId);
  const weights = usePuppyWeights(puppyId);
  
  const handleAddWeightRecord = async (data: any) => {
    try {
      await weights.addWeightRecord({
        ...data,
        puppy_id: puppyId
      });
      setIsAddingWeight(false);
    } catch (error) {
      console.error('Error adding weight record:', error);
    }
  };
  
  const handleDeleteWeight = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this weight record?')) {
      await weights.deleteWeightRecord(id);
    }
  };
  
  if (puppy.isLoading || weights.isLoading) {
    return <LoadingState message="Loading puppy weight data..." />;
  }
  
  if (puppy.error || weights.error) {
    return <ErrorState title="Error" message="Could not load weight data." />;
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Weight Tracking</CardTitle>
        <Button
          size="sm"
          onClick={() => setIsAddingWeight(true)}
          disabled={isAddingWeight}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Weight
        </Button>
      </CardHeader>
      
      <CardContent>
        {isAddingWeight ? (
          <WeightForm 
            onSubmit={handleAddWeightRecord}
            onCancel={() => setIsAddingWeight(false)}
            defaultUnit={displayUnit}
          />
        ) : (
          <>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="chart">
                    <LineChart className="h-4 w-4 mr-2" />
                    Chart View
                  </TabsTrigger>
                  <TabsTrigger value="table">
                    <Table className="h-4 w-4 mr-2" />
                    Table View
                  </TabsTrigger>
                </TabsList>
                
                <select
                  value={displayUnit}
                  onChange={(e) => setDisplayUnit(e.target.value as WeightUnit)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="oz">Ounces (oz)</option>
                  <option value="g">Grams (g)</option>
                  <option value="lbs">Pounds (lbs)</option>
                  <option value="kg">Kilograms (kg)</option>
                </select>
              </div>
              
              <TabsContent value="chart">
                <WeightChartView 
                  weights={weights.weightRecords}
                  puppy={puppy.data}
                  displayUnit={displayUnit}
                />
              </TabsContent>
              
              <TabsContent value="table">
                <WeightTableView 
                  weights={weights.weightRecords}
                  onDelete={handleDeleteWeight}
                  displayUnit={displayUnit}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightTab;
