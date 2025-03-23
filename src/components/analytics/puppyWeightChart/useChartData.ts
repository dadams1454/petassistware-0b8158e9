
import { useMemo } from 'react';
import { WeightData } from './types';

export const useChartData = (puppies: Puppy[]) => {
  // Extract basic chart data from puppies
  const chartData: WeightData[] = useMemo(() => {
    return puppies
      .filter(puppy => puppy.current_weight || puppy.birth_weight)
      .map(puppy => {
        // Handle different types for weight values
        const currentWeight = puppy.current_weight 
          ? (typeof puppy.current_weight === 'string' 
              ? parseFloat(puppy.current_weight) 
              : puppy.current_weight)
          : 0;
          
        const birthWeight = puppy.birth_weight 
          ? (typeof puppy.birth_weight === 'string' 
              ? parseFloat(puppy.birth_weight) 
              : puppy.birth_weight)
          : 0;
        
        return {
          name: puppy.name || `Puppy #${puppy.id.substring(0, 4)}`,
          weight: currentWeight,
          birthWeight: birthWeight,
          color: puppy.color,
          id: puppy.id,
          gender: puppy.gender
        };
      });
  }, [puppies]);

  // Calculate litter average for current weights
  const litterAverageData = useMemo(() => {
    if (chartData.length === 0) return [];
    
    const totalWeight = chartData.reduce((sum, puppy) => sum + puppy.weight, 0);
    const averageWeight = totalWeight / chartData.length;
    
    return chartData.map(puppy => ({
      ...puppy,
      litterAverage: averageWeight
    }));
  }, [chartData]);

  return {
    chartData,
    litterAverageData,
    hasData: chartData.length > 0
  };
};
