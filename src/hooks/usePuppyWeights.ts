
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightData, WeightRecord } from '@/types/puppyTracking';
import { toast } from '@/components/ui/use-toast';

export const usePuppyWeights = (puppyId: string) => {
  const [weightData, setWeightData] = useState<WeightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchWeightData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First get the puppy record to get the birth date
      const { data: puppyData, error: puppyError } = await supabase
        .from('puppies')
        .select('birth_date, litter_id')
        .eq('id', puppyId)
        .single();
        
      if (puppyError) throw puppyError;
      
      // If puppy doesn't have birth date, try to get it from the litter
      let birthDate = puppyData.birth_date;
      if (!birthDate && puppyData.litter_id) {
        const { data: litterData, error: litterError } = await supabase
          .from('litters')
          .select('birth_date')
          .eq('id', puppyData.litter_id)
          .single();
          
        if (!litterError && litterData) {
          birthDate = litterData.birth_date;
        }
      }
      
      // Then get the weight records
      const { data: weightRecords, error: weightError } = await supabase
        .from('weight_records')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('date', { ascending: true });
        
      if (weightError) throw weightError;
      
      // Process and format the weight data
      const processedData = weightRecords.map((record: WeightRecord) => {
        // Calculate age in days if we have a birth date
        let ageInDays = 0;
        if (birthDate) {
          const birthDateTime = new Date(birthDate).getTime();
          const recordDateTime = new Date(record.date).getTime();
          ageInDays = Math.floor((recordDateTime - birthDateTime) / (1000 * 60 * 60 * 24));
        }
        
        return {
          id: record.id,
          dog_id: record.dog_id,
          puppy_id: record.puppy_id,
          weight: record.weight,
          weight_unit: record.weight_unit,
          unit: record.weight_unit, // For compatibility
          date: record.date,
          age: ageInDays,
          notes: record.notes,
          created_at: record.created_at,
          birth_date: birthDate
        };
      });
      
      setWeightData(processedData);
    } catch (err) {
      console.error('Error fetching puppy weight data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch weight data'));
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (puppyId) {
      fetchWeightData();
    }
  }, [puppyId]);
  
  // Function to add a new weight record
  const addWeightRecord = async (data: Omit<WeightData, 'id' | 'age'>) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .insert({
          puppy_id: puppyId,
          dog_id: data.dog_id || '00000000-0000-0000-0000-000000000000', // Required field, use placeholder if not provided
          weight: data.weight,
          weight_unit: data.weight_unit || data.unit,
          date: data.date,
          notes: data.notes,
        });
        
      if (error) throw error;
      
      toast({
        title: 'Weight Added',
        description: 'Weight record has been added successfully',
      });
      
      await fetchWeightData();
      return true;
    } catch (err) {
      console.error('Error adding weight record:', err);
      toast({
        title: 'Error',
        description: 'Failed to add weight record',
        variant: 'destructive',
      });
      throw err;
    }
  };
  
  // Function to update an existing weight record
  const updateWeightRecord = async (id: string, data: Partial<WeightData>) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .update({
          weight: data.weight,
          weight_unit: data.weight_unit || data.unit,
          date: data.date,
          notes: data.notes,
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Weight Updated',
        description: 'Weight record has been updated successfully',
      });
      
      await fetchWeightData();
      return true;
    } catch (err) {
      console.error('Error updating weight record:', err);
      toast({
        title: 'Error',
        description: 'Failed to update weight record',
        variant: 'destructive',
      });
      throw err;
    }
  };
  
  // Function to delete a weight record
  const deleteWeightRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Weight Deleted',
        description: 'Weight record has been deleted',
      });
      
      await fetchWeightData();
      return true;
    } catch (err) {
      console.error('Error deleting weight record:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete weight record',
        variant: 'destructive',
      });
      throw err;
    }
  };
  
  return {
    weightData,
    isLoading,
    error,
    refresh: fetchWeightData,
    addWeightRecord,
    updateWeightRecord,
    deleteWeightRecord
  };
};
