
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '@/types/puppyTracking';

export const usePuppyWeights = (puppyId: string) => {
  const [weights, setWeights] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchWeights = async () => {
    if (!puppyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('weight_records')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('date', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      // Calculate percent change
      const sortedRecords = [...(data || [])].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      const recordsWithChange = sortedRecords.map((record, index) => {
        if (index === 0) {
          return { ...record, percent_change: null };
        }
        
        const prevRecord = sortedRecords[index - 1];
        const currentWeightInGrams = convertToGrams(record.weight, record.weight_unit);
        const prevWeightInGrams = convertToGrams(prevRecord.weight, prevRecord.weight_unit);
        
        const percentChange = ((currentWeightInGrams - prevWeightInGrams) / prevWeightInGrams) * 100;
        
        return {
          ...record,
          percent_change: Number(percentChange.toFixed(1))
        };
      });
      
      setWeights(recordsWithChange);
    } catch (err) {
      console.error('Error fetching weight records:', err);
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const addWeight = async (data: Partial<WeightRecord>) => {
    try {
      const { error: insertError } = await supabase
        .from('weight_records')
        .insert(data);
      
      if (insertError) throw insertError;
      
      await fetchWeights();
    } catch (err) {
      console.error('Error adding weight record:', err);
      throw err;
    }
  };
  
  const deleteWeight = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      
      await fetchWeights();
    } catch (err) {
      console.error('Error deleting weight record:', err);
      throw err;
    }
  };
  
  // Helper function to convert weight to grams for consistent comparison
  const convertToGrams = (weight: number, unit: string): number => {
    switch (unit) {
      case 'oz': return weight * 28.35;
      case 'lbs': return weight * 453.59;
      case 'kg': return weight * 1000;
      case 'g': return weight;
      default: return weight;
    }
  };
  
  useEffect(() => {
    if (puppyId) {
      fetchWeights();
    }
  }, [puppyId]);
  
  return {
    weights,
    isLoading,
    error,
    fetchWeights,
    addWeight,
    deleteWeight
  };
};
