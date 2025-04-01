
import { useState, useEffect } from 'react';

export interface WeightData {
  age: number;
  weight: number;
  unit: string;
  // Add id for compatibility with existing code
  id?: string;
}

interface UsePuppyBreedAveragesReturn {
  averageWeights: WeightData[];
  isLoading: boolean;
  error: Error | null;
}

export const usePuppyBreedAverages = (breed: string): UsePuppyBreedAveragesReturn => {
  const [averageWeights, setAverageWeights] = useState<WeightData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchBreedData = async () => {
      setIsLoading(true);
      
      try {
        // This would be replaced with an actual API call in production
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock breed average data
        // This would come from the database in a real implementation
        const mockAverageWeights: WeightData[] = [
          { age: 1, weight: 2.1, unit: 'lbs' },
          { age: 2, weight: 4.3, unit: 'lbs' },
          { age: 3, weight: 6.8, unit: 'lbs' },
          { age: 4, weight: 9.2, unit: 'lbs' },
          { age: 5, weight: 11.5, unit: 'lbs' },
          { age: 6, weight: 13.7, unit: 'lbs' },
          { age: 7, weight: 15.8, unit: 'lbs' },
          { age: 8, weight: 17.6, unit: 'lbs' },
          { age: 10, weight: 20.4, unit: 'lbs' },
          { age: 12, weight: 22.8, unit: 'lbs' },
          { age: 16, weight: 26.3, unit: 'lbs' },
          { age: 20, weight: 28.9, unit: 'lbs' },
          { age: 24, weight: 30.5, unit: 'lbs' }
        ];
        
        setAverageWeights(mockAverageWeights);
      } catch (err) {
        console.error('Error fetching breed average data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch breed data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    if (breed) {
      fetchBreedData();
    }
  }, [breed]);
  
  return {
    averageWeights,
    isLoading,
    error
  };
};
