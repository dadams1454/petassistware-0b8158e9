
import { supabase } from '@/integrations/supabase/client';
import { 
  HealthRecord, 
  WeightRecord, 
  HealthRecordTypeEnum,
  mapToHealthRecord,
  mapToWeightRecord,
  stringToHealthRecordType 
} from '@/types/health';
import { standardizeWeightUnit } from '@/types/common';

/**
 * Fetch health records for a specific dog
 */
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('visit_date', { ascending: false });
    
  if (error) {
    console.error('Error fetching health records:', error);
    throw error;
  }
  
  // Map the data to the HealthRecord type to ensure type safety
  return data.map(record => mapToHealthRecord(record));
};

/**
 * Fetch a specific health record by ID
 */
export const getHealthRecord = async (recordId: string): Promise<HealthRecord> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('id', recordId)
    .single();
    
  if (error) {
    console.error('Error fetching health record:', error);
    throw error;
  }
  
  return mapToHealthRecord(data);
};

/**
 * Add a new health record
 */
export const addHealthRecord = async (record: Omit<HealthRecord, 'id'>): Promise<HealthRecord> => {
  // Ensure record_type is a valid enum value
  const recordWithValidType = {
    ...record,
    record_type: stringToHealthRecordType(record.record_type.toString())
  };
  
  const { data, error } = await supabase
    .from('health_records')
    .insert(recordWithValidType)
    .select()
    .single();
    
  if (error) {
    console.error('Error adding health record:', error);
    throw error;
  }
  
  return mapToHealthRecord(data);
};

/**
 * Update an existing health record
 */
export const updateHealthRecord = async (id: string, record: Partial<HealthRecord>): Promise<HealthRecord> => {
  // If record_type is included, ensure it's a valid enum value
  const recordWithValidType = record.record_type
    ? { ...record, record_type: stringToHealthRecordType(record.record_type.toString()) }
    : record;
  
  const { data, error } = await supabase
    .from('health_records')
    .update(recordWithValidType)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating health record:', error);
    throw error;
  }
  
  return mapToHealthRecord(data);
};

/**
 * Delete a health record
 */
export const deleteHealthRecord = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('health_records')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting health record:', error);
    throw error;
  }
};

/**
 * Get weight records for a dog
 */
export const getWeightRecords = async (dogId: string): Promise<WeightRecord[]> => {
  const { data, error } = await supabase
    .from('weight_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('date', { ascending: false });
    
  if (error) {
    console.error('Error fetching weight records:', error);
    throw error;
  }
  
  // Map the data to ensure weight_unit is standardized
  return data.map(record => ({
    ...record,
    weight_unit: standardizeWeightUnit(record.weight_unit)
  }));
};

/**
 * Get the latest weight record for a dog
 */
export const getLatestWeightRecord = async (dogId: string): Promise<WeightRecord | null> => {
  const { data, error } = await supabase
    .from('weight_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('date', { ascending: false })
    .limit(1);
    
  if (error) {
    console.error('Error fetching latest weight record:', error);
    throw error;
  }
  
  if (data.length === 0) {
    return null;
  }
  
  // Map the data to ensure weight_unit is standardized
  return {
    ...data[0],
    weight: Number(data[0].weight),
    weight_unit: standardizeWeightUnit(data[0].weight_unit)
  };
};

/**
 * Add a weight record for a dog
 */
export const addWeightRecord = async (record: Omit<WeightRecord, 'id' | 'created_at'>): Promise<WeightRecord> => {
  // Ensure the weight unit is standardized
  const recordWithStandardUnit = {
    ...record,
    weight_unit: standardizeWeightUnit(record.weight_unit)
  };
  
  const { data, error } = await supabase
    .from('weight_records')
    .insert(recordWithStandardUnit)
    .select()
    .single();
    
  if (error) {
    console.error('Error adding weight record:', error);
    throw error;
  }
  
  return mapToWeightRecord(data);
};

/**
 * Update a weight record
 */
export const updateWeightRecord = async (id: string, record: Partial<WeightRecord>): Promise<WeightRecord> => {
  // If weight_unit is included, ensure it's standardized
  const recordWithStandardUnit = record.weight_unit
    ? { ...record, weight_unit: standardizeWeightUnit(record.weight_unit) }
    : record;
  
  const { data, error } = await supabase
    .from('weight_records')
    .update(recordWithStandardUnit)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating weight record:', error);
    throw error;
  }
  
  return mapToWeightRecord(data);
};

/**
 * Delete a weight record
 */
export const deleteWeightRecord = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('weight_records')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting weight record:', error);
    throw error;
  }
};
