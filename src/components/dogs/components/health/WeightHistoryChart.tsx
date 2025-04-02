
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
import { format } from 'date-fns';
import { WeightRecord } from '@/types/health';

interface WeightHistoryChartProps {
  weightRecords: WeightRecord[];
}

const WeightHistoryChart: React.FC<WeightHistoryChartProps> = ({ weightRecords }) => {
  // Sort records by date ascending for the chart
  const sortedRecords = [...weightRecords].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Format data for the chart with fallback for unit
  const chartData = sortedRecords.map(record => ({
    date: format(new Date(record.date), 'MMM d, yyyy'),
    weight: record.weight,
    unit: record.unit || record.weight_unit || 'lbs'
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ 
              value: 'Weight', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }} 
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'weight') {
                const record = chartData.find(r => r.weight === value);
                return [`${value} ${record?.unit || ''}`];
              }
              return [value];
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#8884d8"
            name="Weight"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightHistoryChart;
