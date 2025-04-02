
import { useState, useEffect } from 'react';
import { WeightData } from '@/types/puppyTracking';

export const useWeightData = (puppyId: string) => {
  const [weightData, setWeightData] = useState<WeightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWeightData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would be a fetch from Supabase
      // Simulated API response with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data for development
      const mockWeightData: WeightData[] = [
        { weight: 1.2, age: 7, date: '2023-05-10', weight_unit: 'lbs' },
        { weight: 1.8, age: 14, date: '2023-05-17', weight_unit: 'lbs' },
        { weight: 2.5, age: 21, date: '2023-05-24', weight_unit: 'lbs' },
        { weight: 3.2, age: 28, date: '2023-05-31', weight_unit: 'lbs' },
        { weight: 4.0, age: 35, date: '2023-06-07', weight_unit: 'lbs' },
      ];
      
      setWeightData(mockWeightData);
    } catch (err) {
      console.error('Error fetching weight data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch weight data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (puppyId) {
      fetchWeightData();
    } else {
      setWeightData([]);
      setIsLoading(false);
    }
  }, [puppyId]);

  const addWeightRecord = async (record: Omit<WeightData, 'id' | 'age'>) => {
    try {
      // In a real implementation, this would be a POST to Supabase
      // Simulated API response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate adding the record locally
      const newRecord: WeightData = {
        ...record,
        age: 42, // Calculated based on birth date in a real implementation
        date: record.date
      };
      
      setWeightData(prev => [...prev, newRecord]);
      return true;
    } catch (err) {
      console.error('Error adding weight record:', err);
      throw err;
    }
  };

  return {
    weightData,
    isLoading,
    error,
    refresh: fetchWeightData,
    addWeightRecord
  };
};

export default useWeightData;
