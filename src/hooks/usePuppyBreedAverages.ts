
import { useState } from 'react';
import { WeightData } from '@/types/puppyTracking';

// This is a mock implementation - in a real app, this would fetch from an API or database
export const usePuppyBreedAverages = (breed: string) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock breed growth data for Newfoundlands
  const getBreedGrowthData = (): WeightData[] => {
    if (breed.toLowerCase().includes('newfoundland')) {
      return [
        { 
          age: 0, 
          weight: 1.5, 
          unit: 'lbs',
          date: new Date().toISOString()
        },
        { 
          age: 7, 
          weight: 3.5, 
          unit: 'lbs',
          date: new Date().toISOString()
        },
        { 
          age: 14, 
          weight: 7, 
          unit: 'lbs',
          date: new Date().toISOString()
        },
        { 
          age: 21, 
          weight: 11, 
          unit: 'lbs',
          date: new Date().toISOString()
        },
        { 
          age: 28, 
          weight: 15, 
          unit: 'lbs',
          date: new Date().toISOString()
        },
        { 
          age: 42, 
          weight: 24, 
          unit: 'lbs',
          date: new Date().toISOString()
        },
        { 
          age: 56, 
          weight: 33, 
          unit: 'lbs',
          date: new Date().toISOString()
        },
        { 
          age: 70, 
          weight: 42, 
          unit: 'lbs',
          date: new Date().toISOString()
        },
        { 
          age: 84, 
          weight: 51, 
          unit: 'lbs',
          date: new Date().toISOString()
        },
        { 
          age: 98, 
          weight: 59, 
          unit: 'lbs',
          date: new Date().toISOString()
        },
        { 
          age: 112, 
          weight: 67, 
          unit: 'lbs',
          date: new Date().toISOString()
        },
        { 
          age: 168, 
          weight: 95, 
          unit: 'lbs',
          date: new Date().toISOString()
        },
        { 
          age: 365, 
          weight: 130, 
          unit: 'lbs',
          date: new Date().toISOString()
        }
      ];
    }
    
    // Default growth data for other breeds
    return [
      { age: 0, weight: 1, unit: 'lbs', date: new Date().toISOString() },
      { age: 28, weight: 10, unit: 'lbs', date: new Date().toISOString() },
      { age: 56, weight: 20, unit: 'lbs', date: new Date().toISOString() },
      { age: 84, weight: 30, unit: 'lbs', date: new Date().toISOString() },
      { age: 365, weight: 50, unit: 'lbs', date: new Date().toISOString() }
    ];
  };
  
  return {
    breedWeightData: getBreedGrowthData(),
    isLoading
  };
};
