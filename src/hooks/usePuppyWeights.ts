
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord, WeightUnit } from '@/types/puppyTracking';
import { toast } from 'sonner';

interface AddWeightRecordParams {
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
}

export const usePuppyWeights = (puppyId: string) => {
  const [weights, setWeights] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWeights = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      setWeights(data as WeightRecord[]);
    } catch (err) {
      console.error('Error fetching weight records:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching weight records'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (puppyId) {
      fetchWeights();
    }
  }, [puppyId]);
  
  const addWeightRecord = async (recordData: AddWeightRecordParams) => {
    try {
      const newRecord = {
        puppy_id: puppyId,
        weight: recordData.weight,
        weight_unit: recordData.weight_unit,
        date: recordData.date,
        notes: recordData.notes,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('weight_records')
        .insert(newRecord)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setWeights(prev => [data as WeightRecord, ...prev]);
      
      toast.success('Weight record added successfully');
      return data;
    } catch (err) {
      console.error('Error adding weight record:', err);
      toast.error('Failed to add weight record');
      throw err;
    }
  };
  
  const deleteWeightRecord = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', recordId);
      
      if (error) throw error;
      
      // Update local state
      setWeights(prev => prev.filter(record => record.id !== recordId));
      
      toast.success('Weight record deleted successfully');
    } catch (err) {
      console.error('Error deleting weight record:', err);
      toast.error('Failed to delete weight record');
      throw err;
    }
  };

  return { weights, isLoading, error, addWeightRecord, deleteWeightRecord };
};
