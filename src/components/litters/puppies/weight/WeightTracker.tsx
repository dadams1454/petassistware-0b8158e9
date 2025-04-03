
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import WeightForm from './WeightForm';
import WeightChartView from './WeightChartView';
import WeightTableView from './WeightTableView';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WeightRecord, WeightUnit } from '@/types/health';
import { useToast } from '@/components/ui/use-toast';
import { useWeightData } from '@/hooks/useWeightData';

interface WeightTrackerProps {
  puppyId: string;
  birthDate?: string;
  onAddSuccess?: () => void;
  isAddingWeight?: boolean;
  onCancelAdd?: () => void;
  onWeightAdded?: () => void;
}

const WeightTracker: React.FC<WeightTrackerProps> = ({
  puppyId,
  birthDate,
  onAddSuccess,
  isAddingWeight = false,
  onCancelAdd = () => {},
  onWeightAdded = () => {}
}) => {
  const [showAddForm, setShowAddForm] = useState(isAddingWeight);
  const [displayUnit, setDisplayUnit] = useState<WeightUnit>('oz');
  const { toast } = useToast();
  
  const {
    weightRecords,
    isLoading,
    addWeightRecord,
    deleteWeightRecord
  } = useWeightData({ puppyId });

  // Sync with props
  useEffect(() => {
    setShowAddForm(isAddingWeight);
  }, [isAddingWeight]);

  const handleAddWeight = async (data: any) => {
    try {
      await addWeightRecord({
        ...data,
        birth_date: birthDate
      });
      
      toast({
        title: 'Weight recorded',
        description: 'The weight record has been saved successfully.',
      });
      
      setShowAddForm(false);
      
      if (onWeightAdded) {
        onWeightAdded();
      }
      
      if (onAddSuccess) {
        onAddSuccess();
      }
    } catch (error) {
      console.error('Error adding weight record:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the weight record. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    if (onCancelAdd) {
      onCancelAdd();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWeightRecord(id);
      toast({
        title: 'Weight deleted',
        description: 'The weight record has been removed successfully.',
      });
    } catch (error) {
      console.error('Error deleting weight record:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the weight record. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (showAddForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add Weight Record</CardTitle>
        </CardHeader>
        <CardContent>
          <WeightForm
            puppyId={puppyId}
            onSubmit={handleAddWeight}
            onCancel={handleCancelAdd}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Weight Tracking</h3>
        <Button size="sm" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Weight
        </Button>
      </div>

      <Tabs defaultValue="chart">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="table">History</TabsTrigger>
          </TabsList>
          
          <Select
            value={displayUnit}
            onValueChange={(value) => setDisplayUnit(value as WeightUnit)}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oz">Ounces (oz)</SelectItem>
              <SelectItem value="g">Grams (g)</SelectItem>
              <SelectItem value="lb">Pounds (lb)</SelectItem>
              <SelectItem value="kg">Kilograms (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <TabsContent value="chart">
          <Card>
            <CardContent className="pt-6">
              <WeightChartView
                puppyId={puppyId}
                birthDate={birthDate}
                displayUnit={displayUnit}
                weightRecords={weightRecords}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="table">
          <Card>
            <CardContent className="pt-6">
              <WeightTableView
                puppyId={puppyId}
                displayUnit={displayUnit}
                weightRecords={weightRecords}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeightTracker;
