
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '@/types/puppyTracking';

export function usePuppyWeightRecords(puppyId: string) {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [puppyBirthDate, setPuppyBirthDate] = useState<string | null>(null);

  const fetchWeightHistory = useCallback(async () => {
    if (!puppyId) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch the puppy's birth date for age calculation
      const { data: puppyData, error: puppyError } = await supabase
        .from('puppies')
        .select('birth_date')
        .eq('id', puppyId)
        .single();
      
      if (puppyError) throw puppyError;
      
      if (puppyData && puppyData.birth_date) {
        setPuppyBirthDate(puppyData.birth_date);
      }
      
      // Fetch weight records
      const { data, error: recordsError } = await supabase
        .from('weight_records')
        .select('*')
        .eq('dog_id', puppyId)
        .order('date', { ascending: false });
      
      if (recordsError) throw recordsError;
      
      setWeightRecords(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching weight records:', err);
      setError(err as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [puppyId]);

  const addWeightRecord = useCallback(async (record: Omit<WeightRecord, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('weight_records')
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      
      setWeightRecords(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding weight record:', err);
      throw err;
    }
  }, []);

  const deleteWeightRecord = useCallback(async (recordId: string) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', recordId);
      
      if (error) throw error;
      
      setWeightRecords(prev => prev.filter(r => r.id !== recordId));
      return true;
    } catch (err) {
      console.error('Error deleting weight record:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (puppyId) {
      fetchWeightHistory();
    }
  }, [puppyId, fetchWeightHistory]);

  return {
    weightRecords,
    isLoading,
    fetchWeightHistory,
    addWeightRecord,
    deleteWeightRecord,
    puppyBirthDate
  };
}
