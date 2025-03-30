
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, LineChart, Table as TableIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WeightForm from './WeightForm';
import WeightTable from './WeightTable';
import WeightChart from './WeightChart';
import { useWeightTracker } from '@/hooks/useWeightTracker';
import { weightUnits } from './weightUnits';
import { WeightTrackerProps } from './types';

const WeightTracker: React.FC<WeightTrackerProps> = ({ 
  puppyId,
  onAddSuccess
}) => {
  const [displayUnit, setDisplayUnit] = useState<'oz' | 'g' | 'lbs' | 'kg'>('oz');
  
  const {
    weightRecords,
    isLoading,
    isAddingWeight,
    setIsAddingWeight,
    isSubmitting,
    addWeightRecord,
    deleteWeightRecord
  } = useWeightTracker(puppyId);

  const handleFormSubmit = async (data: any) => {
    await addWeightRecord({
      puppy_id: puppyId,
      ...data
    });
    
    setIsAddingWeight(false);
    if (onAddSuccess) onAddSuccess();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this weight record?')) {
      await deleteWeightRecord(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Weight Tracking</CardTitle>
            <CardDescription>
              Record and monitor weight progress over time
            </CardDescription>
          </div>
          
          {!isAddingWeight && (
            <Button 
              onClick={() => setIsAddingWeight(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Weight
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {isAddingWeight && (
          <WeightForm 
            onSubmit={handleFormSubmit}
            onCancel={() => setIsAddingWeight(false)}
            isSubmitting={isSubmitting}
            defaultUnit={displayUnit}
          />
        )}
        
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Tabs defaultValue="chart" className="w-auto">
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
              </Tabs>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Display Unit:</span>
                <Select 
                  value={displayUnit} 
                  onValueChange={(value) => setDisplayUnit(value as 'oz' | 'g' | 'lbs' | 'kg')}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {weightUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="chart">
              <TabsContent value="chart" className="mt-0">
                <WeightChart 
                  weightRecords={weightRecords || []} 
                  displayUnit={displayUnit}
                />
              </TabsContent>
              
              <TabsContent value="table" className="mt-0">
                <WeightTable 
                  weightRecords={weightRecords || []} 
                  onDelete={handleDelete}
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

export default WeightTracker;
