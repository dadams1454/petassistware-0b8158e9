
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '@/types/weight';
import { mapWeightRecordFromDB, mapWeightRecordToDB } from '@/lib/mappers/weightMapper';

/**
 * Get weight records for a dog
 */
export const getWeightRecords = async (dogId: string): Promise<WeightRecord[]> => {
  if (!dogId) return [];

  const { data, error } = await supabase
    .from('weights')
    .select('*')
    .eq('dog_id', dogId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching weight records:', error);
    throw error;
  }

  return (data || []).map(record => mapWeightRecordFromDB(record));
};

/**
 * Get weight history for a dog
 */
export const getWeightHistory = async (dogId: string): Promise<WeightRecord[]> => {
  return getWeightRecords(dogId);
};

/**
 * Add a weight record
 */
export const addWeightRecord = async (record: Partial<WeightRecord>): Promise<WeightRecord> => {
  if (!record.dog_id && !record.puppy_id) {
    throw new Error('Either dog_id or puppy_id is required for weight record');
  }
  
  if (!record.date || record.weight === undefined) {
    throw new Error('Date and weight are required fields');
  }

  const dbRecord = mapWeightRecordToDB(record);

  const { data, error } = await supabase
    .from('weights')
    .insert(dbRecord)
    .select()
    .single();

  if (error) {
    console.error('Error adding weight record:', error);
    throw error;
  }

  return mapWeightRecordFromDB(data);
};

/**
 * Update a weight record
 */
export const updateWeightRecord = async (id: string, updates: Partial<WeightRecord>): Promise<WeightRecord> => {
  const dbUpdates = mapWeightRecordToDB(updates);

  const { data, error } = await supabase
    .from('weights')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating weight record:', error);
    throw error;
  }

  return mapWeightRecordFromDB(data);
};

/**
 * Delete a weight record
 */
export const deleteWeightRecord = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('weights')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting weight record:', error);
    throw error;
  }
};

/**
 * Get weight records for a puppy
 */
export const getPuppyWeightRecords = async (puppyId: string): Promise<WeightRecord[]> => {
  if (!puppyId) return [];

  const { data, error } = await supabase
    .from('weights')
    .select('*')
    .eq('puppy_id', puppyId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching puppy weight records:', error);
    throw error;
  }

  return (data || []).map(record => mapWeightRecordFromDB(record));
};

/**
 * Add a puppy weight record
 */
export const addPuppyWeightRecord = async (record: Partial<WeightRecord>): Promise<WeightRecord> => {
  if (!record.puppy_id) {
    throw new Error('puppy_id is required for puppy weight record');
  }
  
  return addWeightRecord(record);
};
