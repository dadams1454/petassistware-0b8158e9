
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '@/types/health';

// Define the PuppyWeightRecord interface 
export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  age_days?: number;
  notes?: string;
  created_at: string;
}

/**
 * Fetch all weight records for a puppy
 */
export const getPuppyWeightRecords = async (puppyId: string): Promise<PuppyWeightRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('puppy_weights')
      .select('*')
      .eq('puppy_id', puppyId)
      .order('date', { ascending: false });
      
    if (error) throw error;
    
    return data as PuppyWeightRecord[];
  } catch (error) {
    console.error('Error in getPuppyWeightRecords:', error);
    return [];
  }
};

/**
 * Add a new weight record for a puppy
 */
export const addPuppyWeightRecord = async (recordData: Partial<PuppyWeightRecord>): Promise<PuppyWeightRecord | null> => {
  try {
    // Ensure required fields are present
    if (!recordData.puppy_id) throw new Error('Puppy ID is required');
    if (!recordData.weight) throw new Error('Weight is required');
    if (!recordData.weight_unit) throw new Error('Weight unit is required');
    if (!recordData.date) throw new Error('Date is required');
    
    const { data, error } = await supabase
      .from('puppy_weights')
      .insert(recordData)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as PuppyWeightRecord;
  } catch (error) {
    console.error('Error in addPuppyWeightRecord:', error);
    return null;
  }
};

/**
 * Update a puppy weight record
 */
export const updatePuppyWeightRecord = async (id: string, recordData: Partial<PuppyWeightRecord>): Promise<PuppyWeightRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('puppy_weights')
      .update(recordData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as PuppyWeightRecord;
  } catch (error) {
    console.error('Error in updatePuppyWeightRecord:', error);
    return null;
  }
};

/**
 * Delete a puppy weight record
 */
export const deletePuppyWeightRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('puppy_weights')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error in deletePuppyWeightRecord:', error);
    return false;
  }
};

// For backward compatibility
export const fetchPuppyWeightRecords = getPuppyWeightRecords;
