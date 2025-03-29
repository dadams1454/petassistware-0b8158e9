
import React from 'react';
import { ColorProbability } from '@/types/genetics';

interface ChartLegendProps {
  colorData: ColorProbability[];
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ colorData }) => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-2">
        {colorData.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-4 h-4 mr-2 rounded-sm" 
              style={{ backgroundColor: item.color }} 
            />
            <span>{item.name} ({item.probability}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartLegend;
