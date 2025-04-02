
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '@/types/puppyTracking';

interface UseWeightDataProps {
  puppyId?: string;
  dogId?: string;
}

export const useWeightData = ({ puppyId, dogId }: UseWeightDataProps) => {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWeightHistory = useCallback(async () => {
    if (!puppyId && !dogId) {
      setWeightRecords([]);
      setIsLoading(false);
      return [];
    }

    try {
      let query = supabase
        .from('weight_records')
        .select('*')
        .order('date', { ascending: true });

      if (puppyId) {
        query = query.eq('puppy_id', puppyId);
      } else if (dogId) {
        query = query.eq('dog_id', dogId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Sort by date ascending
      const sortedData = (data || []).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Calculate percent change for each record
      const recordsWithPercentChange = sortedData.map((record, index) => {
        let percentChange = 0;
        if (index > 0) {
          const prevWeight = sortedData[index - 1].weight;
          percentChange = ((record.weight - prevWeight) / prevWeight) * 100;
        }
        return { ...record, percent_change: percentChange };
      });

      setWeightRecords(recordsWithPercentChange);
      return recordsWithPercentChange;
    } catch (error) {
      console.error('Error fetching weight records:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [puppyId, dogId]);

  const addWeightRecord = async (record: Omit<WeightRecord, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('weight_records')
        .insert({
          ...record,
          puppy_id: puppyId,
          dog_id: dogId,
        })
        .select();

      if (error) throw error;

      await fetchWeightHistory();
      return data[0];
    } catch (error) {
      console.error('Error adding weight record:', error);
      throw error;
    }
  };

  const deleteWeightRecord = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      await fetchWeightHistory();
      return true;
    } catch (error) {
      console.error('Error deleting weight record:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchWeightHistory();
  }, [fetchWeightHistory]);

  return {
    weightRecords,
    isLoading,
    fetchWeightHistory,
    addWeightRecord,
    deleteWeightRecord,
  };
};
