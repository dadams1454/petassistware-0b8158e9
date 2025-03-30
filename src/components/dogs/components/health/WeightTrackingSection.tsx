
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

interface WeightTrackingSectionProps {
  dogId: string;
}

const WeightTrackingSection: React.FC<WeightTrackingSectionProps> = ({ dogId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { weightRecords, isLoading, error, addWeightRecord, refetch } = useWeightTracking(dogId);

  const handleAddWeight = async (weightRecord: any) => {
    try {
      await addWeightRecord(weightRecord);
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to add weight record:', error);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading weight history..." />;
  }

  if (error) {
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

      {weightRecords && weightRecords.length > 0 ? (
        <Tabs defaultValue="chart" className="w-full">
          <TabsList>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <Card>
              <CardContent className="pt-6">
                <WeightHistoryChart weightRecords={weightRecords} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="table">
            <WeightRecordsTable weightRecords={weightRecords} />
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

      {isAddDialogOpen && (
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
