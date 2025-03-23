
import React from 'react';
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface ColorDistributionChartProps {
  data: any[];
  colors: string[];
}

const ColorDistributionChart: React.FC<ColorDistributionChartProps> = ({ data, colors }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-md">
        <p className="text-muted-foreground">No color data available for puppies of this dam.</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis
            yAxisId="left"
            label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'Percentage', angle: 90, position: 'insideRight' }}
            unit="%"
          />
          <Tooltip 
            formatter={(value, name, props) => {
              if (name === 'percentage') return [`${value}%`, 'Percentage'];
              return [`${value} puppies`, 'Count'];
            }}
          />
          <Legend />
          <Bar 
            dataKey="count" 
            name="Number of Puppies" 
            fill="#2563eb"
            yAxisId="left"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
          <Bar 
            dataKey="percentage" 
            name="Percentage" 
            fill="#16a34a"
            yAxisId="right"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ColorDistributionChart;
