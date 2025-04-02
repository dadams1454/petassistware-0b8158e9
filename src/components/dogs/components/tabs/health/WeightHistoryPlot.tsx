
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { WeightRecord } from '@/types/health';

interface WeightHistoryPlotProps {
  weightRecords: WeightRecord[];
}

const WeightHistoryPlot: React.FC<WeightHistoryPlotProps> = ({ weightRecords }) => {
  if (!weightRecords || weightRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weight History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <AlertCircle className="mb-2 h-8 w-8" />
            <p>No weight records available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          {/* Weight chart would go here */}
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Weight chart loading...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightHistoryPlot;
