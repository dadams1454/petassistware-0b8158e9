
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingState, EmptyState } from '@/components/ui/standardized';
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { usePuppyWeightRecords } from '@/hooks/usePuppyWeightRecords';
import { usePuppyBreedAverages } from '@/hooks/usePuppyBreedAverages';

interface GrowthChartProps {
  puppyId: string;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ puppyId }) => {
  const [timeframe, setTimeframe] = useState<'all' | '30days' | '7days'>('all');
  const [showBreedAverage, setShowBreedAverage] = useState<boolean>(true);
  
  const { 
    weightRecords, 
    isLoading 
  } = usePuppyWeightRecords(puppyId);
  
  const { breedAverages, isLoading: isLoadingAverages } = usePuppyBreedAverages(puppyId);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Growth Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState message="Loading weight data..." />
        </CardContent>
      </Card>
    );
  }
  
  if (!weightRecords || weightRecords.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Growth Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState 
            title="Insufficient Data" 
            description="Add at least two weight records to see a growth trend."
          />
        </CardContent>
      </Card>
    );
  }
  
  // Process data for the chart
  const chartData = weightRecords.map(record => {
    const recordDate = new Date(record.date);
    const daysSinceBirth = record.birth_date ? 
      Math.round((recordDate.getTime() - new Date(record.birth_date).getTime()) / (1000 * 60 * 60 * 24)) : 
      0;
    
    // Find breed average for this age if available
    const averageForAge = breedAverages && breedAverages.find(avg => avg.dayAge === daysSinceBirth);
    
    return {
      date: format(recordDate, 'MMM d'),
      weight: record.weight,
      unit: record.weight_unit,
      dayAge: daysSinceBirth,
      breedAverage: averageForAge?.weight || null
    };
  });
  
  // Apply timeframe filter
  const filteredData = applyTimeframeFilter(chartData, timeframe);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md">Growth Trend</CardTitle>
          <div className="flex gap-2">
            <Select
              value={timeframe}
              onValueChange={(value) => setTimeframe(value as 'all' | '30days' | '7days')}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="30days">30 days</SelectItem>
                <SelectItem value="7days">7 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowBreedAverage(!showBreedAverage)}
              className={showBreedAverage ? "bg-primary/10" : ""}
            >
              Breed Avg
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ 
                  value: weightRecords[0]?.weight_unit || '', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: 12 }
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                name="Actual Weight"
                type="monotone"
                dataKey="weight"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              {showBreedAverage && (
                <Line
                  name="Breed Average"
                  type="monotone"
                  dataKey="breedAverage"
                  stroke="#82ca9d"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                />
              )}
              {weightRecords.length > 0 && (
                <ReferenceLine
                  y={weightRecords[weightRecords.length - 1].weight}
                  stroke="red"
                  strokeDasharray="3 3"
                  label={{ 
                    value: 'Current', 
                    position: 'insideBottomRight',
                    style: { fill: 'red', fontSize: 10 }
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to apply timeframe filter
const applyTimeframeFilter = (data: any[], timeframe: 'all' | '30days' | '7days') => {
  if (timeframe === 'all' || data.length <= 2) {
    return data;
  }
  
  // Get the latest record's day age
  const latestDayAge = data[data.length - 1]?.dayAge || 0;
  
  // Filter based on timeframe
  if (timeframe === '30days') {
    return data.filter(item => item.dayAge >= latestDayAge - 30);
  } else if (timeframe === '7days') {
    return data.filter(item => item.dayAge >= latestDayAge - 7);
  }
  
  return data;
};

export default GrowthChart;
