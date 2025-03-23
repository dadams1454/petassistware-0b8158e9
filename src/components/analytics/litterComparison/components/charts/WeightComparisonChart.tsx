
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface WeightComparisonChartProps {
  data: any[];
}

const WeightComparisonChart: React.FC<WeightComparisonChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-md">
        <p className="text-muted-foreground">No weight data available for puppies of this dam.</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            interval={0}
          />
          <YAxis 
            label={{ value: 'Average Weight (oz)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'birthWeight') return [`${Number(value).toFixed(1)} oz`, 'Birth Weight'];
              return [`${Number(value).toFixed(1)} oz`, 'Current Weight'];
            }}
            labelFormatter={(label) => {
              const item = data.find(d => d.name === label);
              return `${label} (Sire: ${item?.sire}, Puppies: ${item?.puppyCount})`;
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="birthWeight" 
            name="Avg. Birth Weight" 
            stroke="#9333ea" 
            strokeWidth={2} 
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="currentWeight" 
            name="Avg. Current Weight" 
            stroke="#16a34a" 
            strokeWidth={2} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightComparisonChart;
