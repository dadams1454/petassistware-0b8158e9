
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/standardized';
import { WeightRecord, WeightData } from '@/types/puppyTracking';

interface GrowthChartProps {
  weights: WeightRecord[];
  birthDate: string;
  breedAverages?: {
    breed: string;
    averageGrowthData: WeightData[];
  } | null;
  isLoading?: boolean;
}

interface ChartDataPoint {
  age: number;
  weight: number;
  date: string;
  actualWeight?: number;
  avgWeight?: number;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ 
  weights, 
  birthDate, 
  breedAverages,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Growth Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <LoadingState message="Loading growth data..." />
        </CardContent>
      </Card>
    );
  }

  const prepareChartData = (): ChartDataPoint[] => {
    if (!weights || weights.length === 0) {
      return [];
    }

    // Convert puppy weights to the right format
    const weightDataPoints = weights.map(record => {
      const recordDate = new Date(record.date);
      const ageInDays = differenceInDays(recordDate, new Date(birthDate));
      
      return {
        age: ageInDays,
        actualWeight: record.weight,
        date: record.date,
        weight: record.weight // For tooltip display
      };
    }).sort((a, b) => a.age - b.age);
    
    // If we have breed averages, merge them with actual weights
    let chartData = [...weightDataPoints];
    
    if (breedAverages && breedAverages.averageGrowthData && Array.isArray(breedAverages.averageGrowthData)) {
      // Get breed average data points
      const averageDataPoints = breedAverages.averageGrowthData.map(point => ({
        age: point.age,
        avgWeight: point.weight,
        date: format(new Date(new Date(birthDate).getTime() + point.age * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
      }));
      
      // Create a combined dataset with both actual weights and averages
      const allAges = new Set([
        ...weightDataPoints.map(d => d.age),
        ...averageDataPoints.map(d => d.age)
      ]);
      
      chartData = [...allAges].sort((a, b) => a - b).map(age => {
        const actualPoint = weightDataPoints.find(d => d.age === age);
        const avgPoint = averageDataPoints.find(d => d.age === age);
        
        return {
          age,
          date: actualPoint?.date || avgPoint?.date || '',
          actualWeight: actualPoint?.actualWeight,
          avgWeight: avgPoint?.avgWeight,
          weight: actualPoint?.weight || avgPoint?.avgWeight || 0
        };
      });
    }
    
    return chartData;
  };
  
  const chartData = prepareChartData();
  
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint;
      return (
        <div className="custom-tooltip bg-white p-2 border rounded shadow-sm">
          <p className="font-semibold">{`Age: ${data.age} days`}</p>
          <p className="text-sm">{`Date: ${format(new Date(data.date), 'MMM d, yyyy')}`}</p>
          {data.actualWeight !== undefined && (
            <p className="text-primary">{`Actual Weight: ${data.actualWeight}`}</p>
          )}
          {data.avgWeight !== undefined && (
            <p className="text-secondary">{`Breed Average: ${data.avgWeight}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Growth Chart</span>
          {breedAverages && (
            <span className="text-sm font-normal text-muted-foreground">
              Compared to {breedAverages.breed} average
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 mt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="age" 
                  label={{ value: 'Age (days)', position: 'insideBottomRight', offset: -5 }} 
                />
                <YAxis label={{ value: 'Weight', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {weights.length > 0 && (
                  <Line 
                    type="monotone" 
                    dataKey="actualWeight" 
                    name="Actual Weight" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    connectNulls 
                  />
                )}
                {breedAverages && (
                  <Line 
                    type="monotone" 
                    dataKey="avgWeight" 
                    name="Breed Average" 
                    stroke="#10b981" 
                    connectNulls 
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-muted-foreground">
                No weight data available yet
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthChart;
