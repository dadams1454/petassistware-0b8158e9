
import React, { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeightRecord, WeightChartData } from './types';
import { convertWeight } from './weightUnits';

interface WeightChartProps {
  weightRecords: WeightRecord[];
  displayUnit: 'oz' | 'g' | 'lbs' | 'kg';
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded p-2 shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-primary">{`Weight: ${payload[0].value} ${payload[0].unit}`}</p>
        {payload[1] && payload[1].value !== undefined && (
          <p className={`${Number(payload[1].value) > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {`Change: ${payload[1].value > 0 ? '+' : ''}${payload[1].value}%`}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const WeightChart: React.FC<WeightChartProps> = ({ 
  weightRecords, 
  displayUnit,
  title = "Weight Progress"
}) => {
  const chartData: WeightChartData[] = useMemo(() => {
    return weightRecords.map(record => {
      // Convert weight to display unit
      const displayWeight = convertWeight(
        record.weight, 
        record.weight_unit, 
        displayUnit
      );
      
      return {
        date: typeof record.date === 'string' 
          ? format(parseISO(record.date), 'MMM d')
          : format(record.date, 'MMM d'),
        weight: Number(displayWeight.toFixed(2)),
        percentChange: record.percent_change || undefined
      };
    });
  }, [weightRecords, displayUnit]);

  if (weightRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No weight data available yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                yAxisId="left" 
                label={{ 
                  value: `Weight (${displayUnit})`, 
                  angle: -90, 
                  position: 'insideLeft' 
                }} 
              />
              {weightRecords.some(record => record.percent_change !== null) && (
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  label={{ 
                    value: 'Change (%)', 
                    angle: 90, 
                    position: 'insideRight'
                  }} 
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="weight"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name={`Weight (${displayUnit})`}
                unit={displayUnit}
              />
              {weightRecords.some(record => record.percent_change !== null) && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="percentChange"
                  stroke="#82ca9d"
                  name="% Change"
                  unit="%"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightChart;
