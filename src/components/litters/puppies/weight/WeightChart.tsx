
import React from 'react';
import { WeightRecord } from '@/types/puppyTracking';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { convertWeight } from './weightUnits';

interface WeightChartProps {
  weightRecords: WeightRecord[];
  displayUnit: 'oz' | 'g' | 'lb' | 'kg';
}

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="text-sm font-medium">{`Age: ${label} days`}</p>
        <p className="text-sm">{`Weight: ${payload[0].value} ${data.displayUnit}`}</p>
        {data.notes && <p className="text-xs text-muted-foreground mt-1">{data.notes}</p>}
      </div>
    );
  }
  return null;
};

const WeightChart: React.FC<WeightChartProps> = ({ 
  weightRecords, 
  displayUnit 
}) => {
  if (!weightRecords || weightRecords.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No weight records available to display
      </div>
    );
  }

  // Convert weights to the selected display unit
  const chartData = weightRecords.map(record => {
    const displayWeight = convertWeight(
      record.weight, 
      record.weight_unit, 
      displayUnit
    );
    
    return {
      ...record,
      age: record.age_days,
      displayWeight,
      displayUnit
    };
  });

  // Calculate trend line (simple linear regression)
  let trendData: { age: number, displayWeight: number }[] = [];
  
  if (chartData.length > 1) {
    const n = chartData.length;
    
    // Calculate sums for regression formula
    const sumX = chartData.reduce((sum, item) => sum + item.age, 0);
    const sumY = chartData.reduce((sum, item) => sum + item.displayWeight, 0);
    const sumXY = chartData.reduce((sum, item) => sum + (item.age * item.displayWeight), 0);
    const sumXX = chartData.reduce((sum, item) => sum + (item.age * item.age), 0);
    
    // Calculate slope and y-intercept
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const yIntercept = (sumY - slope * sumX) / n;
    
    // Create trend line data points
    const firstAge = chartData[0].age;
    const lastAge = chartData[chartData.length - 1].age;
    const futureAge = lastAge + 14; // Project 2 weeks into the future
    
    trendData = [
      { age: firstAge, displayWeight: yIntercept + slope * firstAge },
      { age: futureAge, displayWeight: yIntercept + slope * futureAge }
    ];
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="age" 
            label={{ 
              value: 'Age (days)', 
              position: 'insideBottom', 
              offset: -10 
            }} 
          />
          <YAxis 
            label={{ 
              value: `Weight (${displayUnit})`, 
              angle: -90, 
              position: 'insideLeft' 
            }} 
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Line 
            type="monotone" 
            dataKey="displayWeight" 
            stroke="#3b82f6" 
            strokeWidth={2}
            activeDot={{ r: 8 }} 
          />
          
          {trendData.length > 0 && (
            <Line 
              data={trendData}
              type="linear" 
              dataKey="displayWeight"
              stroke="#f43f5e" 
              strokeWidth={2}
              strokeDasharray="5 5" 
              dot={false}
              activeDot={false}
              label="Trend"
            />
          )}
          
          {chartData.length > 0 && (
            <ReferenceLine 
              y={chartData[chartData.length - 1].displayWeight} 
              stroke="#64748b" 
              strokeDasharray="3 3"
              label="Current"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;
