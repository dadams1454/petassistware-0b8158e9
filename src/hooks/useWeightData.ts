
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightData } from '@/types/puppyTracking';

export const useWeightData = (puppyId: string) => {
  const [weightData, setWeightData] = useState<WeightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWeightData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch weight records for the specified puppy
      const { data, error: fetchError } = await supabase
        .from('weight_records')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('date', { ascending: true });

      if (fetchError) throw fetchError;

      // Transform the data to match WeightData format
      const transformedData: WeightData[] = data.map(record => ({
        weight: record.weight,
        weight_unit: record.weight_unit,
        date: record.date,
        age: calculateAge(record.date, record.birth_date),
        id: record.id,
        birth_date: record.birth_date,
        notes: record.notes,
        created_at: record.created_at
      }));
      
      setWeightData(transformedData);
    } catch (err) {
      console.error('Error fetching weight data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch weight data'));
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate age in days based on birth date and record date
  const calculateAge = (recordDate: string, birthDate?: string): number => {
    if (!birthDate) return 0;
    
    const birth = new Date(birthDate);
    const record = new Date(recordDate);
    const diffTime = Math.abs(record.getTime() - birth.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
      // Insert new weight record into Supabase
      const { data, error } = await supabase
        .from('weight_records')
        .insert({
          puppy_id: puppyId,
          weight: record.weight,
          weight_unit: record.weight_unit,
          date: record.date,
          notes: record.notes
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh weight data
      await fetchWeightData();
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
