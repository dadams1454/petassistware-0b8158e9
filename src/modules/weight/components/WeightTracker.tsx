
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import WeightChartView from './WeightChartView';
import WeightTableView from './WeightTableView';
import WeightEntryForm from './WeightEntryForm';
import { useWeightData } from '../hooks/useWeightData';
import { WeightRecord } from '@/types/weight';
import { WeightUnit } from '@/types/weight-units';
import { formatWeight } from '@/utils/weightConversion';
import { WeightTrackerProps } from '../types';

const WeightTracker: React.FC<WeightTrackerProps> = ({
  puppyId,
  dogId,
  birthDate,
  onAddSuccess
}) => {
  const [activeTab, setActiveTab] = useState('chart');
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [displayUnit, setDisplayUnit] = useState<WeightUnit>('lb');
  
  const { 
    weightRecords, 
    isLoading, 
    addWeight, 
    deleteWeight 
  } = useWeightData({ puppyId, dogId });
  
  // Handle adding a new weight record
  const handleAddWeight = async (record: Partial<WeightRecord>) => {
    await addWeight(record);
    setIsAddingWeight(false);
    if (onAddSuccess) onAddSuccess();
  };
  
  // Get the latest weight for display at the top
  const getLatestWeight = () => {
    if (weightRecords.length === 0) return null;
    
    // Sort records to get the most recent one
    const sortedRecords = [...weightRecords].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
    
    return sortedRecords[0];
  };
  
  const latestWeight = getLatestWeight();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weight Tracking</CardTitle>
        <Button onClick={() => setIsAddingWeight(true)} size="sm">
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Weight
        </Button>
      </CardHeader>
      
      <CardContent>
        {latestWeight ? (
          <div className="mb-4 p-3 bg-muted/30 rounded-md">
            <div className="text-sm text-muted-foreground">Current Weight</div>
            <div className="text-2xl font-bold">
              {formatWeight(latestWeight.weight, latestWeight.weight_unit)} {latestWeight.weight_unit}
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-muted/30 rounded-md">
            <div className="text-sm text-muted-foreground">No weight records</div>
            <div className="text-lg">
              Add a weight record to track {puppyId ? 'puppy' : 'dog'} growth
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart">
            <WeightChartView 
              puppyId={puppyId}
              dogId={dogId}
              birthDate={birthDate}
              displayUnit={displayUnit}
              weightRecords={weightRecords}
            />
          </TabsContent>
          
          <TabsContent value="table">
            <WeightTableView 
              puppyId={puppyId}
              dogId={dogId}
              displayUnit={displayUnit}
              weightRecords={weightRecords}
              onDelete={deleteWeight}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Weight Entry Dialog */}
      <Dialog open={isAddingWeight} onOpenChange={setIsAddingWeight}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Weight Record</DialogTitle>
          </DialogHeader>
          <WeightEntryForm 
            puppyId={puppyId} 
            dogId={dogId}
            birthDate={birthDate}
            onSuccess={handleAddWeight}
            onCancel={() => setIsAddingWeight(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WeightTracker;
