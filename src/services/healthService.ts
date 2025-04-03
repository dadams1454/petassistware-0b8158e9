
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '@/types/health';
import { standardizeWeightUnit } from '@/types/common';

/**
 * Fetch weight history for a dog
 */
export const getWeightHistory = async (dogId: string): Promise<WeightRecord[]> => {
  try {
    // First try the dog_weights table
    let { data: dogWeights, error } = await supabase
      .from('dog_weights')
      .select('*')
      .eq('dog_id', dogId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching from dog_weights:', error);
      
      // Fallback to weight_records table
      const { data: weightRecords, error: weightError } = await supabase
        .from('weight_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('date', { ascending: false });
      
      if (weightError) {
        console.error('Error fetching from weight_records:', weightError);
        return [];
      }
      
      return formatWeightRecords(weightRecords || []);
    }
    
    return formatWeightRecords(dogWeights || []);
  } catch (error) {
    console.error('Exception in getWeightHistory:', error);
    return [];
  }
};

/**
 * Add a weight record for a dog
 */
export const addWeightRecord = async (record: Partial<WeightRecord>): Promise<WeightRecord | null> => {
  try {
    // Ensure weight_unit is standardized
    const standardizedRecord = {
      ...record,
      weight_unit: standardizeWeightUnit(record.weight_unit || 'lb')
    };
    
    // Try to insert into dog_weights table first
    const { data, error } = await supabase
      .from('dog_weights')
      .insert({
        dog_id: standardizedRecord.dog_id,
        weight: standardizedRecord.weight,
        weight_unit: standardizedRecord.weight_unit,
        date: standardizedRecord.date,
        notes: standardizedRecord.notes
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding to dog_weights:', error);
      
      // Fallback to weight_records table
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('weight_records')
        .insert({
          dog_id: standardizedRecord.dog_id,
          weight: standardizedRecord.weight,
          weight_unit: standardizedRecord.weight_unit,
          date: standardizedRecord.date,
          notes: standardizedRecord.notes
        })
        .select()
        .single();
      
      if (fallbackError) {
        console.error('Error adding to weight_records:', fallbackError);
        return null;
      }
      
      return formatWeightRecord(fallbackData);
    }
    
    return formatWeightRecord(data);
  } catch (error) {
    console.error('Exception in addWeightRecord:', error);
    return null;
  }
};

/**
 * Delete a weight record
 */
export const deleteWeightRecord = async (id: string): Promise<boolean> => {
  try {
    // First try to delete from dog_weights
    const { error } = await supabase
      .from('dog_weights')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting from dog_weights:', error);
      
      // Fallback to weight_records
      const { error: fallbackError } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', id);
      
      if (fallbackError) {
        console.error('Error deleting from weight_records:', fallbackError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Exception in deleteWeightRecord:', error);
    return false;
  }
};

/**
 * Format weight records from the database
 */
const formatWeightRecords = (records: any[]): WeightRecord[] => {
  return records.map(formatWeightRecord);
};

/**
 * Format a single weight record from the database
 */
const formatWeightRecord = (record: any): WeightRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    weight: record.weight,
    weight_unit: standardizeWeightUnit(record.weight_unit),
    unit: standardizeWeightUnit(record.weight_unit), // For backward compatibility
    date: record.date,
    percent_change: record.percent_change,
    notes: record.notes,
    created_at: record.created_at
  };
};
