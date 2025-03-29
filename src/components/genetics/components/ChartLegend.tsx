
import React from 'react';
import { ColorProbability } from '@/types/genetics';

interface ChartLegendProps {
  data: ColorProbability[];
  colorScale?: (index: number) => string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ 
  data, 
  colorScale = (index) => {
    const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    return colors[index % colors.length];
  }
}) => {
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <div 
            className="w-4 h-4 rounded-sm mr-2" 
            style={{ backgroundColor: colorScale(index) }}
          ></div>
          <span className="text-sm">
            {item.color}: {item.percentage}%
          </span>
        </div>
      ))}
    </div>
  );
};

// Also export as default for compatibility
export default ChartLegend;
