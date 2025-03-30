
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ColorProbability } from '@/types/genetics';

interface ColorProbabilityPieChartProps {
  colorData: ColorProbability[];
}

export const ColorProbabilityPieChart: React.FC<ColorProbabilityPieChartProps> = ({ 
  colorData 
}) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={colorData}
            dataKey="probability"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, probability }) => `${name}: ${probability}%`}
          >
            {colorData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [`${value}%`, 'Probability']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ColorProbabilityPieChart;
