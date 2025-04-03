
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WeightChart } from './WeightChart';
import WeightTable from './WeightTable';
import WeightEntryForm from './WeightEntryForm';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WeightRecord } from '@/types/puppyTracking';
import { WeightUnit } from '@/types/common';
import { convertWeight } from './weightUnits';

interface WeightTrackerProps {
  puppyId: string;
  birthDate?: string;
  initialRecords?: WeightRecord[];
  onWeightAdded?: () => void;
}

const WeightTracker: React.FC<WeightTrackerProps> = ({
  puppyId,
  birthDate,
  initialRecords = [],
  onWeightAdded
}) => {
  const [activeTab, setActiveTab] = useState('chart');
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(initialRecords);
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [displayUnit, setDisplayUnit] = useState<WeightUnit>('oz');
  
  // Handle adding a new weight record
  const handleAddWeight = (record: WeightRecord) => {
    setWeightRecords([record, ...weightRecords]);
    setIsAddingWeight(false);
    if (onWeightAdded) onWeightAdded();
  };
  
  // Handle deleting a weight record
  const handleDeleteWeight = (id: string) => {
    setWeightRecords(weightRecords.filter(record => record.id !== id));
  };
  
  // Handle unit changes - convert all weights to the new unit
  const handleDisplayUnitChange = (unit: WeightUnit) => {
    setDisplayUnit(unit);
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
    
    // Convert the weight to the selected display unit
    const convertedWeight = convertWeight(
      latest.weight,
      latest.weight_unit,
      displayUnit
    );
    
    return {
      weight: convertedWeight,
      unit: displayUnit,
      date: latest.date
    };
  };
  
  const latestWeight = getLatestWeight();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weight Tracking</CardTitle>
        <div className="flex items-center gap-2">
          <Select
            value={displayUnit}
            onValueChange={(value) => handleDisplayUnitChange(value as WeightUnit)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Weight unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oz">Ounces (oz)</SelectItem>
              <SelectItem value="g">Grams (g)</SelectItem>
              <SelectItem value="lb">Pounds (lb)</SelectItem>
              <SelectItem value="kg">Kilograms (kg)</SelectItem>
            </SelectContent>
          </Select>
          
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
          
          <TabsContent value="chart" className="p-2">
            <WeightChart 
              weightRecords={weightRecords} 
              displayUnit={displayUnit} 
            />
          </TabsContent>
          
          <TabsContent value="table" className="p-2">
            <WeightTable 
              weightRecords={weightRecords} 
              onDelete={handleDeleteWeight}
              displayUnit={displayUnit}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <Dialog open={isAddingWeight} onOpenChange={setIsAddingWeight}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Weight Record</DialogTitle>
          </DialogHeader>
          <WeightEntryForm
            puppyId={puppyId}
            birthDate={birthDate}
            onSave={handleAddWeight}
            onCancel={() => setIsAddingWeight(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WeightTracker;
