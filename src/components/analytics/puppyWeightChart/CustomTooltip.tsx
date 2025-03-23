
import React from 'react';
import { TooltipProps } from 'recharts';
import { WeightData } from './types';

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null;
  
  const data = payload[0]?.payload as WeightData;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 border rounded-md shadow-lg">
      <p className="font-medium text-sm">{label}</p>
      <div className="grid gap-1 mt-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">
              {entry.name}: 
            </span>
            <span className="text-sm font-medium">
              {Number(entry.value).toFixed(1)} oz
            </span>
          </div>
        ))}
      </div>
      {data.gender && (
        <p className="text-xs text-muted-foreground mt-2">
          Gender: {data.gender}
        </p>
      )}
    </div>
  );
};

export default CustomTooltip;
