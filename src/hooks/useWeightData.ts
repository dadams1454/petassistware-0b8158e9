
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '@/types/health';
import { format } from 'date-fns';

export const useWeightData = (dogId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);

  const fetchWeightHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('date', { ascending: false });

      if (error) throw error;
      setWeightRecords(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching weight history:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addWeightRecord = async (record: Omit<WeightRecord, 'id' | 'created_at'>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('weight_records')
        .insert(record);

      if (error) {
        console.error('Error adding weight record:', error);
        return false;
      }
      
      await fetchWeightHistory();
      return true;
    } catch (error) {
      console.error('Error in addWeightRecord function:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWeightRecord = async (recordId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', recordId);

      if (error) {
        console.error('Error deleting weight record:', error);
        return false;
      }
      
      await fetchWeightHistory();
      return true;
    } catch (error) {
      console.error('Error in deleteWeightRecord function:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    weightRecords,
    isLoading,
    fetchWeightHistory,
    addWeightRecord,
    deleteWeightRecord
  };
};
