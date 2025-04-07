
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WeightUnit, WeightRecord } from '@/types';
import WeightUnitSelect from './WeightUnitSelect';
import WeightEntryForm from './WeightEntryForm';
import { getPuppyWeightRecords } from '@/services/puppyWeightService';
import { WeightTrackerProps } from './types';

/**
 * Weight tracker component for monitoring weight changes over time
 */
const WeightTracker: React.FC<WeightTrackerProps> = ({
  puppyId,
  birthDate,
  onAddSuccess
}) => {
  const [activeTab, setActiveTab] = useState('chart');
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [displayUnit, setDisplayUnit] = useState<WeightUnit>('oz');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch weight records on mount and when puppyId changes
  useEffect(() => {
    const fetchWeightRecords = async () => {
      if (!puppyId) return;
      
      setIsLoading(true);
      try {
        const records = await getPuppyWeightRecords(puppyId);
        setWeightRecords(records);
      } catch (error) {
        console.error('Error fetching weight records:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeightRecords();
  }, [puppyId]);
  
  // Handle adding a new weight record
  const handleAddWeight = (record: WeightRecord) => {
    setWeightRecords([record, ...weightRecords]);
    setIsAddingWeight(false);
    if (onAddSuccess) onAddSuccess();
  };
  
  // Handle deleting a weight record
  const handleDeleteWeight = (id: string) => {
    setWeightRecords(weightRecords.filter(record => record.id !== id));
  };
  
  // Get the latest weight for display at the top
  const getLatestWeight = (): { weight: number, unit: WeightUnit, date: string } | null => {
    if (weightRecords.length === 0) return null;
    
    // Sort records to get the most recent one
    const sortedRecords = [...weightRecords].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
    
    const latest = sortedRecords[0];
    
    return {
      weight: latest.weight,
      unit: latest.weight_unit,
      date: latest.date
    };
  };
  
  const latestWeight = getLatestWeight();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weight Tracking</CardTitle>
        <div className="flex items-center gap-2">
          <WeightUnitSelect
            value={displayUnit}
            onChange={setDisplayUnit}
            className="w-[120px]"
          />
          
          <Button onClick={() => setIsAddingWeight(true)} size="sm">
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Weight
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {latestWeight ? (
          <div className="mb-4 p-3 bg-muted/30 rounded-md">
            <div className="text-sm text-muted-foreground">Current Weight</div>
            <div className="text-2xl font-bold">
              {latestWeight.weight.toFixed(2)} {latestWeight.unit}
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-muted/30 rounded-md">
            <div className="text-sm text-muted-foreground">No weight records</div>
            <div className="text-lg">
              Add a weight record to track puppy growth
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart">
            {/* We will implement these views separately */}
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Weight chart will be displayed here
            </div>
          </TabsContent>
          
          <TabsContent value="table">
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Weight table will be displayed here
            </div>
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
