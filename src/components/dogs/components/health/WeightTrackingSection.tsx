
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import { useWeightTracking } from '@/components/dogs/hooks/useWeightTracking';
import WeightEntryDialog from './WeightEntryDialog';
import WeightHistoryChart from './WeightHistoryChart';
import WeightRecordsTable from './WeightRecordsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { WeightRecord } from '@/types/health';

interface WeightTrackingSectionProps {
  dogId?: string;
  weightHistory?: WeightRecord[];
  growthStats?: any;
  onAddWeight?: () => void;
  isLoading?: boolean;
}

const WeightTrackingSection: React.FC<WeightTrackingSectionProps> = ({ 
  dogId,
  weightHistory,
  growthStats,
  onAddWeight,
  isLoading: externalLoading
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Only use the hook if dogId is provided and no external data is passed
  const { 
    weightHistory: hookWeightHistory, 
    isLoading: hookLoading, 
    error, 
    addWeightRecord, 
    refetch 
  } = useWeightTracking(dogId || '');

  // Use external data if provided, otherwise use data from the hook
  const records = weightHistory || hookWeightHistory || [];
  const loading = externalLoading !== undefined ? externalLoading : hookLoading;

  const handleAddWeight = async (weightRecord: any) => {
    try {
      if (onAddWeight) {
        onAddWeight();
      } else if (dogId) {
        await addWeightRecord(weightRecord);
        refetch();
      }
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add weight record:', error);
    }
  };

  if (loading) {
    return <LoadingState message="Loading weight history..." />;
  }

  if (error && !weightHistory) {
    return <ErrorState title="Error" message="Could not load weight data" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Weight History</h3>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Weight
        </Button>
      </div>

      {records && records.length > 0 ? (
        <Tabs defaultValue="chart" className="w-full">
          <TabsList>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <Card>
              <CardContent className="pt-6">
                <WeightHistoryChart weightRecords={records} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="table">
            <WeightRecordsTable weightRecords={records} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center p-6 border rounded-md bg-background">
          <p className="text-muted-foreground">No weight records found</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddDialogOpen(true)}
            className="mt-2"
          >
            Add First Weight Record
          </Button>
        </div>
      )}

      {isAddDialogOpen && dogId && (
        <WeightEntryDialog
          dogId={dogId}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleAddWeight}
        />
      )}
    </div>
  );
};

export default WeightTrackingSection;
