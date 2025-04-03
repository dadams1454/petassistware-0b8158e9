
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useWeightTracking } from '@/hooks/useWeightTracking';
import WeightHistoryChart from '@/components/dogs/components/health/WeightHistoryChart';
import WeightRecordsTable from '@/components/dogs/components/health/WeightRecordsTable';
import WeightEntryDialog from '@/components/dogs/components/health/WeightEntryDialog';
import GrowthStatsCard from '@/components/dogs/components/health/GrowthStatsCard';
import { LoadingState, ErrorState } from '@/components/ui/standardized';

const WeightTracking: React.FC = () => {
  const { dogId } = useParams<{ dogId: string }>();
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  
  const { 
    weightHistory, 
    isLoading, 
    isError, 
    error, 
    growthStats, 
    addWeightRecord, 
    selectedWeight, 
    setSelectedWeight, 
    updateWeightRecord, 
    deleteWeightRecord 
  } = useWeightTracking({ dogId: dogId || '' });
  
  const handleAddWeight = () => {
    setIsAddingWeight(true);
  };
  
  const handleCancelAdd = () => {
    setIsAddingWeight(false);
  };
  
  const handleWeightAdded = () => {
    setIsAddingWeight(false);
  };
  
  if (isLoading) {
    return <LoadingState message="Loading weight records..." />;
  }
  
  if (isError) {
    return <ErrorState title="Error" message={error?.message || 'Failed to load weight records'} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Weight Tracking</h2>
        <Button onClick={handleAddWeight}>
          <Plus className="mr-2 h-4 w-4" />
          Add Weight
        </Button>
      </div>
      
      <GrowthStatsCard stats={growthStats} />
      
      <Card>
        <CardHeader>
          <CardTitle>Weight History</CardTitle>
        </CardHeader>
        <CardContent>
          <WeightHistoryChart weightRecords={weightHistory} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Weight Records</CardTitle>
        </CardHeader>
        <CardContent>
          <WeightRecordsTable 
            weightRecords={weightHistory}
            onEdit={setSelectedWeight}
            onDelete={deleteWeightRecord}
          />
        </CardContent>
      </Card>
      
      {isAddingWeight && (
        <WeightEntryDialog 
          open={isAddingWeight} 
          onOpenChange={setIsAddingWeight}
          dogId={dogId || ''}
          onSave={addWeightRecord}
          onSuccess={handleWeightAdded}
          onCancel={handleCancelAdd}
        />
      )}
      
      {selectedWeight && (
        <WeightEntryDialog 
          open={!!selectedWeight} 
          onOpenChange={() => setSelectedWeight(null)}
          dogId={dogId || ''}
          weightRecord={selectedWeight}
          onSave={updateWeightRecord}
          onSuccess={() => setSelectedWeight(null)}
          onCancel={() => setSelectedWeight(null)}
        />
      )}
    </div>
  );
};

export default WeightTracking;
