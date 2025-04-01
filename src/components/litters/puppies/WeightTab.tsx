
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, LineChart, Table as TableIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { usePuppyWeights } from '@/hooks/usePuppyWeights';
import { usePuppyDetails } from '@/hooks/usePuppyDetails';
import WeightForm from './weight/WeightForm';
import WeightChartView from './weight/WeightChartView';
import WeightTableView from './weight/WeightTableView';
import { WeightUnit } from '@/types/health';

const WeightTab: React.FC = () => {
  const { puppyId } = useParams<{ puppyId: string }>();
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [displayUnit, setDisplayUnit] = useState<WeightUnit>('oz');
  
  const { data: puppy, isLoading: isPuppyLoading } = usePuppyDetails(puppyId || '');
  const { weights, isLoading: isWeightsLoading, error, addWeight, deleteWeight } = usePuppyWeights(puppyId || '');
  
  const isLoading = isPuppyLoading || isWeightsLoading;
  
  const handleAddWeight = async (data: any) => {
    if (!puppyId) return;
    
    try {
      await addWeight({
        puppy_id: puppyId,
        date: data.date.toISOString().split('T')[0],
        weight: data.weight,
        weight_unit: data.weight_unit,
        notes: data.notes
      });
      
      setIsAddingWeight(false);
    } catch (error) {
      console.error('Error adding weight record:', error);
    }
  };
  
  const handleDeleteWeight = async (weightId: string) => {
    if (window.confirm('Are you sure you want to delete this weight record?')) {
      try {
        await deleteWeight(weightId);
      } catch (error) {
        console.error('Error deleting weight record:', error);
      }
    }
  };
  
  const getDefaultUnit = (): WeightUnit => {
    // Use most recent weight unit if available
    if (weights && weights.length > 0) {
      return weights[0].weight_unit;
    }
    return 'oz';
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weight Tracking</CardTitle>
        
        {!isAddingWeight && (
          <Button onClick={() => setIsAddingWeight(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Weight
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {isAddingWeight && (
          <div className="mb-6 border rounded-md p-4 bg-muted/20">
            <WeightForm 
              onSubmit={handleAddWeight}
              onCancel={() => setIsAddingWeight(false)}
              defaultUnit={getDefaultUnit()}
              isSubmitting={false}
            />
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <Tabs defaultValue="chart" className="w-full">
                <TabsList>
                  <TabsTrigger value="chart">
                    <LineChart className="h-4 w-4 mr-2" />
                    Chart
                  </TabsTrigger>
                  <TabsTrigger value="table">
                    <TableIcon className="h-4 w-4 mr-2" />
                    Table
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart">
                  <WeightChartView 
                    weightRecords={weights || []} 
                    displayUnit={displayUnit}
                  />
                </TabsContent>
                
                <TabsContent value="table">
                  <WeightTableView 
                    weightRecords={weights || []}
                    onDelete={handleDeleteWeight}
                    displayUnit={displayUnit}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightTab;
