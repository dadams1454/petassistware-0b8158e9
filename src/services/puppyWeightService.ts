
import { supabase } from '@/integrations/supabase/client';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';
import { standardizeWeightUnit, WeightUnit } from '@/types/common';

/**
 * Interface for puppy weight record 
 */
export interface PuppyWeightRecord {
  id?: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  age_days?: number;
  created_at?: string;
}

/**
 * Get weight records for a specific puppy
 */
export const getPuppyWeightRecords = async (puppyId: string): Promise<PuppyWeightRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('weight_records')
      .select('*')
      .eq('puppy_id', puppyId)
      .order('date', { ascending: false });
      
    if (error) {
      console.error('Error fetching puppy weight records:', error);
      throw error;
    }
    
    // Convert legacy weight units
    return (data || []).map(record => ({
      ...record,
      weight_unit: standardizeWeightUnit(record.weight_unit),
    })) as PuppyWeightRecord[];
  } catch (error) {
    console.error('Error in getPuppyWeightRecords:', error);
    throw error;
  }
};

/**
 * Add a new weight record for a puppy
 */
export const addPuppyWeightRecord = async (
  puppyId: string, 
  weight: number, 
  weightUnit: WeightUnit, 
  date: string | Date,
  notes: string = ''
) => {
  try {
    // Format date
    const formattedDate = formatDateToYYYYMMDD(date);
    const standardizedUnit = standardizeWeightUnit(weightUnit);
    
    // We need to get the dog_id from the puppy record
    const { data: puppyData, error: puppyError } = await supabase
      .from('puppies')
      .select('litter_id')
      .eq('id', puppyId)
      .single();
      
    if (puppyError) {
      console.error('Error fetching puppy details for weight record:', puppyError);
      throw puppyError;
    }
    
    // Get the litter's dam_id to use as the dog_id (may need to adjust based on your schema)
    const { data: litterData, error: litterError } = await supabase
      .from('litters')
      .select('dam_id')
      .eq('id', puppyData.litter_id)
      .single();
      
    if (litterError) {
      console.error('Error fetching litter details for weight record:', litterError);
      throw litterError;
    }
    
    const { data, error } = await supabase
      .from('weight_records')
      .insert({
        puppy_id: puppyId,
        dog_id: litterData.dam_id, // Use the dam's ID as the required dog_id
        weight: weight,
        weight_unit: standardizedUnit,
        date: formattedDate,
        notes: notes,
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error adding puppy weight record:', error);
      throw error;
    }
    
    return data as PuppyWeightRecord;
  } catch (error) {
    console.error('Error in addPuppyWeightRecord:', error);
    throw error;
  }
};

/**
 * Update a puppy weight record
 */
export const updatePuppyWeightRecord = async (
  recordId: string, 
  updates: Partial<PuppyWeightRecord>
) => {
  try {
    // Format date if present
    if (updates.date) {
      updates.date = formatDateToYYYYMMDD(updates.date);
    }
    
    // Standardize weight unit if present
    if (updates.weight_unit) {
      updates.weight_unit = standardizeWeightUnit(updates.weight_unit);
    }
    
    const { data, error } = await supabase
      .from('weight_records')
      .update(updates)
      .eq('id', recordId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating puppy weight record:', error);
      throw error;
    }
    
    return data as PuppyWeightRecord;
  } catch (error) {
    console.error('Error in updatePuppyWeightRecord:', error);
    throw error;
  }
};

/**
 * Delete a puppy weight record
 */
export const deletePuppyWeightRecord = async (recordId: string) => {
  try {
    const { error } = await supabase
      .from('weight_records')
      .delete()
      .eq('id', recordId);
      
    if (error) {
      console.error('Error deleting puppy weight record:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deletePuppyWeightRecord:', error);
    throw error;
  }
};
