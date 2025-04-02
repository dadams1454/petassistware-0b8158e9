
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeightRecord } from '../../types/dog';
import WeightHistoryChart from './WeightHistoryChart';
import WeightRecordsTable from './WeightRecordsTable';
import WeightStatCards from './WeightStatCards';

interface WeightTrackingSectionProps {
  dogId: string;
  weightHistory: WeightRecord[];
  growthStats: any;
  onAddWeight: () => void;
  isLoading: boolean;
}

const WeightTrackingSection: React.FC<WeightTrackingSectionProps> = ({
  dogId,
  weightHistory,
  growthStats,
  onAddWeight,
  isLoading
}) => {
  if (isLoading) {
    return <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button onClick={onAddWeight}>
          <Plus className="h-4 w-4 mr-2" />
          Add Weight Record
        </Button>
      </div>
      
      <WeightStatCards
        weightHistory={weightHistory}
        growthStats={growthStats}
      />
      
      {weightHistory.length > 0 ? (
        <>
          <WeightHistoryChart weightHistory={weightHistory} />
          <WeightRecordsTable weightHistory={weightHistory} />
        </>
      ) : (
        <div className="text-center py-10 bg-muted/20 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No Weight Records</h3>
          <p className="text-muted-foreground mb-4">Start tracking your dog's weight to see progress over time.</p>
          <Button onClick={onAddWeight}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Weight Record
          </Button>
        </div>
      )}
    </div>
  );
};

export default WeightTrackingSection;
