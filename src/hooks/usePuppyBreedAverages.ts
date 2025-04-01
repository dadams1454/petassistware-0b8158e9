
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightData } from '@/types/puppyTracking';

export const usePuppyBreedAverages = (breed: string) => {
  const [averageWeights, setAverageWeights] = useState<WeightData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchAverageWeights = async () => {
      if (!breed) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, you would fetch this data from a database
        // For now we'll use mock data
        
        // Here you would query the database for average weight data by breed and age
        // const { data, error } = await supabase
        //   .from('breed_weight_averages')
        //   .select('*')
        //   .eq('breed', breed)
        //   .order('age_days', { ascending: true });
        
        // if (error) throw error;
        
        // For demonstration purposes, let's create some mock data
        const mockAverageWeights: WeightData[] = [
          { id: '1', weight: 340, date: '2023-01-01', age: 1, unit: 'g' },
          { id: '2', weight: 454, date: '2023-01-02', age: 7, unit: 'g' },
          { id: '3', weight: 567, date: '2023-01-03', age: 14, unit: 'g' },
          { id: '4', weight: 680, date: '2023-01-04', age: 21, unit: 'g' },
          { id: '5', weight: 794, date: '2023-01-05', age: 28, unit: 'g' },
          { id: '6', weight: 907, date: '2023-01-06', age: 35, unit: 'g' },
          { id: '7', weight: 1021, date: '2023-01-07', age: 42, unit: 'g' },
          { id: '8', weight: 1134, date: '2023-01-08', age: 49, unit: 'g' },
          { id: '9', weight: 1247, date: '2023-01-09', age: 56, unit: 'g' },
          { id: '10', weight: 1361, date: '2023-01-10', age: 63, unit: 'g' },
          { id: '11', weight: 1474, date: '2023-01-11', age: 70, unit: 'g' },
          { id: '12', weight: 1588, date: '2023-01-12', age: 77, unit: 'g' },
          { id: '13', weight: 1701, date: '2023-01-13', age: 84, unit: 'g' }
        ];
        
        setAverageWeights(mockAverageWeights);
      } catch (err) {
        console.error('Error fetching breed average weights:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAverageWeights();
  }, [breed]);
  
  return {
    averageWeights,
    isLoading,
    error
  };
};
