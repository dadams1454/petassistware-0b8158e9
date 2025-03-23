
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useChartData } from './useChartData';
import ChartContent from './ChartContent';
import EmptyState from './EmptyState';
import { GenderDistributionChartProps } from './types';

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({ 
  puppies,
  title = "Gender Distribution"
}) => {
  const { chartData, hasData } = useChartData(puppies);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      
      {!hasData ? (
        <EmptyState />
      ) : (
        <CardContent>
          <ChartContent data={chartData} />
        </CardContent>
      )}
    </Card>
  );
};

export default GenderDistributionChart;
