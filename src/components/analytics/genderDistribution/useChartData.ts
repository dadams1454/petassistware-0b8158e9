
import { useMemo } from 'react';
import { GenderCount } from './types';

export const useChartData = (puppies: Puppy[]) => {
  const chartData = useMemo(() => {
    const maleCount = puppies.filter(puppy => 
      puppy.gender?.toLowerCase() === 'male').length;
    const femaleCount = puppies.filter(puppy => 
      puppy.gender?.toLowerCase() === 'female').length;
    const unknownCount = puppies.filter(puppy => 
      !puppy.gender || puppy.gender.toLowerCase() !== 'male' && puppy.gender.toLowerCase() !== 'female').length;
    
    const data: GenderCount[] = [];
    
    if (maleCount > 0) {
      data.push({ name: 'Male', value: maleCount });
    }
    
    if (femaleCount > 0) {
      data.push({ name: 'Female', value: femaleCount });
    }
    
    if (unknownCount > 0) {
      data.push({ name: 'Unknown', value: unknownCount });
    }
    
    return data;
  }, [puppies]);

  return {
    chartData,
    hasData: chartData.length > 0
  };
};
