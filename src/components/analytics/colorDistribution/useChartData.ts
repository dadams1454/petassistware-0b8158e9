
import { useMemo } from 'react';
import { ColorCount } from './types';

export const useChartData = (puppies: Puppy[]) => {
  // Generate chart data from puppies
  const chartData: ColorCount[] = useMemo(() => {
    const colorCounts: { [key: string]: number } = {};
    
    puppies.forEach(puppy => {
      if (puppy.color) {
        const color = puppy.color;
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      } else {
        colorCounts['Unknown'] = (colorCounts['Unknown'] || 0) + 1;
      }
    });
    
    return Object.keys(colorCounts).map(color => ({
      name: color,
      count: colorCounts[color]
    }));
  }, [puppies]);
  
  // Generate unique colors for bars
  const generateColors = (count: number) => {
    const baseColors = [
      '#2563eb', '#9333ea', '#16a34a', '#db2777', 
      '#ea580c', '#ca8a04', '#0891b2', '#4f46e5'
    ];
    
    return baseColors.slice(0, Math.min(count, baseColors.length));
  };
  
  const barColors = generateColors(chartData.length);
  
  return {
    chartData,
    barColors,
    hasData: chartData.length > 0
  };
};
