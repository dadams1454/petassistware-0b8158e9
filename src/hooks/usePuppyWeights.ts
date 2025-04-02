
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightData, WeightRecord, WeightUnit } from '@/types/health';
import { useToast } from '@/components/ui/use-toast';

export const usePuppyWeights = (puppyId: string): {
  weightData: WeightData;
  refresh: () => Promise<void>;
  addWeightRecord: (data: Omit<WeightRecord, 'id' | 'created_at'>) => Promise<boolean>;
  updateWeightRecord: (id: string, data: Partial<WeightRecord>) => Promise<boolean>;
  deleteWeightRecord: (id: string) => Promise<boolean>;
} => {
  const [weightData, setWeightData] = useState<WeightData>({
    weights: [],
    isLoading: true,
    error: null
  });
  const { toast } = useToast();
  
  const fetchWeightData = async () => {
    setWeightData(prev => ({ ...prev, isLoading: true, error: null }));
    
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
      const processedWeights: WeightRecord[] = weightRecords.map((record: any) => {
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
          weight_unit: record.weight_unit as WeightUnit,
          date: record.date,
          notes: record.notes,
          created_at: record.created_at,
          birth_date: birthDate,
          age_days: ageInDays,
          formatted_date: new Date(record.date).toLocaleDateString()
        };
      });
      
      setWeightData({
        weights: processedWeights,
        isLoading: false,
        error: null
      });
    } catch (err) {
      console.error('Error fetching puppy weight data:', err);
      setWeightData({
        weights: [],
        isLoading: false,
        error: err instanceof Error ? err : new Error('Failed to fetch weight data')
      });
    }
  };
  
  useEffect(() => {
    if (puppyId) {
      fetchWeightData();
    }
  }, [puppyId]);
  
  // Function to add a new weight record
  const addWeightRecord = async (data: Omit<WeightRecord, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      const recordData = {
        puppy_id: puppyId,
        dog_id: data.dog_id || null,
        weight: data.weight,
        weight_unit: data.weight_unit,
        date: data.date,
        notes: data.notes,
      };
        
      const { error } = await supabase
        .from('weight_records')
        .insert(recordData);
        
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
  const updateWeightRecord = async (id: string, data: Partial<WeightRecord>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .update({
          weight: data.weight,
          weight_unit: data.weight_unit,
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
  const deleteWeightRecord = async (id: string): Promise<boolean> => {
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
    refresh: fetchWeightData,
    addWeightRecord,
    updateWeightRecord,
    deleteWeightRecord
  };
};
