
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChartData } from './useChartData';
import ChartContent from './ChartContent';
import EmptyState from './EmptyState';
import { ColorDistributionChartProps } from './types';

const ColorDistributionChart: React.FC<ColorDistributionChartProps> = ({ 
  puppies,
  title = "Color Distribution"
}) => {
  const { chartData, barColors, hasData } = useChartData(puppies);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      
      {!hasData ? (
        <EmptyState />
      ) : (
        <CardContent>
          <ChartContent data={chartData} colors={barColors} />
        </CardContent>
      )}
    </Card>
  );
};

export default ColorDistributionChart;
