
import React from 'react';
import { ColorProbability } from '@/types/genetics';

interface ChartLegendProps {
  colors: ColorProbability[];
}

const ChartLegend: React.FC<ChartLegendProps> = ({ colors }) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Color Probability</h3>
      <div className="flex flex-wrap gap-4">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-4 h-4 rounded mr-2" 
              style={{ 
                backgroundColor: color.hex || '#999',
                border: '1px solid #ddd'
              }}
            />
            <span className="text-sm">
              {color.color}: {(color.probability * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartLegend;
