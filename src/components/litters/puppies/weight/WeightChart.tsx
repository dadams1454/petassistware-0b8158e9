
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeightRecord } from './types';
import { convertWeight } from './weightUnits';

export interface WeightChartProps {
  weightRecords: WeightRecord[];
  displayUnit: 'oz' | 'g' | 'lbs' | 'kg';
  title?: string;
}

const WeightChart: React.FC<WeightChartProps> = ({ 
  weightRecords, 
  displayUnit,
  title = 'Weight Progress' 
}) => {
  // Process data for the chart
  const chartData = weightRecords.map(record => {
    // Convert weight to the display unit if needed
    const convertedWeight = record.weight_unit !== displayUnit
      ? convertWeight(record.weight, record.weight_unit, displayUnit)
      : record.weight;
    
    return {
      date: record.date,
      weight: Number(convertedWeight.toFixed(2)),
      formattedDate: new Date(record.date).toLocaleDateString()
    };
  });

  // Format tooltip content
  const formatTooltip = (value: number, name: string) => {
    if (name === 'weight') {
      return [`${value} ${displayUnit}`, 'Weight'];
    }
    return [value, name];
  };

  // Calculate domain for Y axis
  const minWeight = Math.min(...chartData.map(data => data.weight)) * 0.9;
  const maxWeight = Math.max(...chartData.map(data => data.weight)) * 1.1;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No weight records available
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="formattedDate" 
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                  height={60}
                />
                <YAxis 
                  domain={[minWeight, maxWeight]}
                  tickFormatter={(value) => `${value}`}
                  label={{ 
                    value: `Weight (${displayUnit})`, 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Weight"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightChart;
