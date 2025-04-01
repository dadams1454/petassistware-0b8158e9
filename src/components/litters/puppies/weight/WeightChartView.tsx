
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { WeightRecord } from '@/types/puppyTracking';
import { convertWeight } from './weightUnits';

interface WeightChartViewProps {
  weightRecords: WeightRecord[];
  displayUnit: 'oz' | 'g' | 'lbs' | 'kg';
}

const WeightChartView: React.FC<WeightChartViewProps> = ({ weightRecords, displayUnit }) => {
  if (!weightRecords || weightRecords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p>No weight records available to display.</p>
      </div>
    );
  }

  // Sort records by date
  const sortedRecords = [...weightRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Convert all weights to the display unit
  const chartData = sortedRecords.map(record => {
    const convertedWeight = convertWeight(
      record.weight,
      record.weight_unit as any,
      displayUnit as any
    );

    return {
      date: format(new Date(record.date), 'MMM d'),
      weight: Number(convertedWeight.toFixed(2)),
      formattedDate: format(new Date(record.date), 'MMM d, yyyy')
    };
  });

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            tickMargin={10}
          />
          <YAxis 
            tickMargin={10}
            label={{ 
              value: displayUnit, 
              position: 'insideLeft', 
              angle: -90, 
              dy: 50 
            }} 
          />
          <Tooltip 
            formatter={(value: number) => [`${value} ${displayUnit}`, 'Weight']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="weight"
            name={`Weight (${displayUnit})`}
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChartView;
