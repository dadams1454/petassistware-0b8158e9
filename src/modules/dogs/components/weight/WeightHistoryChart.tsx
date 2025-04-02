
import React from 'react';
import { WeightRecord } from '../../types/dog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeightHistoryChartProps {
  weightHistory: WeightRecord[];
}

const WeightHistoryChart: React.FC<WeightHistoryChartProps> = ({ weightHistory }) => {
  // This is a placeholder for now - in a real implementation, you'd use a charting library like recharts
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight History Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-md">
          <p className="text-muted-foreground">
            Weight history chart would be displayed here with a charting library.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightHistoryChart;
