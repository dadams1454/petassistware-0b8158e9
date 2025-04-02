
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightData } from '@/types/puppyTracking';
import { useToast } from '@/hooks/use-toast';

export const usePuppyWeights = (puppyId: string) => {
  const [weights, setWeights] = useState<WeightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchWeights = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('date', { ascending: true });
        
      if (error) throw error;
      
      // Get puppy birth date for calculating age
      const { data: puppyData, error: puppyError } = await supabase
        .from('puppies')
        .select('birth_date, litter_id')
        .eq('id', puppyId)
        .single();
        
      if (puppyError) throw puppyError;
      
      let birthDate = puppyData?.birth_date;
      
      // If puppy doesn't have a birth date, try to get it from the litter
      if (!birthDate && puppyData?.litter_id) {
        const { data: litterData, error: litterError } = await supabase
          .from('litters')
          .select('birth_date')
          .eq('id', puppyData.litter_id)
          .single();
          
        if (!litterError && litterData) {
          birthDate = litterData.birth_date;
        }
      }
      
      // Calculate age for each weight record
      const weightData = data?.map(record => {
        let age = 0;
        
        if (birthDate) {
          const recordDate = new Date(record.date);
          const puppyBirthDate = new Date(birthDate);
          const ageInDays = Math.floor((recordDate.getTime() - puppyBirthDate.getTime()) / (1000 * 60 * 60 * 24));
          age = ageInDays;
        }
        
        return {
          id: record.id,
          weight: record.weight,
          date: record.date,
          age,
          weight_unit: record.weight_unit
        } as WeightData;
      }) || [];
      
      setWeights(weightData);
    } catch (err) {
      console.error('Error fetching weight records:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch weight records'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const addWeightRecord = async (weightData: Omit<WeightData, 'id' | 'age'>) => {
    try {
      // Make sure we include the puppy_id in the records
      const newRecord = {
        puppy_id: puppyId,
        dog_id: weightData.dog_id || '00000000-0000-0000-0000-000000000000', // Adding dog_id since it's required
        weight: weightData.weight,
        weight_unit: weightData.weight_unit,
        date: weightData.date,
        notes: weightData.notes || '',
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('weight_records')
        .insert(newRecord)
        .select()
        .single();
        
      if (error) throw error;
      
      // Calculate age for the new record
      const { data: puppyData } = await supabase
        .from('puppies')
        .select('birth_date')
        .eq('id', puppyId)
        .single();
        
      let age = 0;
      if (puppyData?.birth_date) {
        const recordDate = new Date(data.date);
        const puppyBirthDate = new Date(puppyData.birth_date);
        age = Math.floor((recordDate.getTime() - puppyBirthDate.getTime()) / (1000 * 60 * 60 * 24));
      }
      
      const newWeightData: WeightData = {
        id: data.id,
        weight: data.weight,
        date: data.date,
        age,
        weight_unit: data.weight_unit
      };
      
      setWeights([...weights, newWeightData]);
      
      toast({
        title: 'Weight Recorded',
        description: `Successfully recorded weight of ${data.weight} ${data.weight_unit}.`,
      });
      
      return data;
    } catch (err) {
      console.error('Error adding weight record:', err);
      toast({
        title: 'Error',
        description: 'Failed to add weight record.',
        variant: 'destructive'
      });
      return null;
    }
  };
  
  const deleteWeightRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setWeights(weights.filter(w => w.id !== id));
      
      toast({
        title: 'Weight Record Deleted',
        description: 'Successfully deleted weight record.',
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting weight record:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete weight record.',
        variant: 'destructive'
      });
      return false;
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
    refresh: fetchWeights,
    addWeightRecord,
    deleteWeightRecord
  };
};
