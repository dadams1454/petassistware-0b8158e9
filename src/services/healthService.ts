
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordTypeEnum, WeightRecord } from '@/types';

/**
 * Get health records for a dog
 */
export const getHealthRecords = async (dogId?: string, recordType?: HealthRecordTypeEnum): Promise<HealthRecord[]> => {
  if (!dogId) return [];
  
  let query = supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('visit_date', { ascending: false });
    
  if (recordType) {
    query = query.eq('record_type', recordType);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching health records:', error);
    throw error;
  }
  
  return data as HealthRecord[];
};

/**
 * Get a specific health record
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
  
  return data as HealthRecord;
};

/**
 * Add a new health record
 */
export const addHealthRecord = async (record: Partial<HealthRecord>): Promise<HealthRecord> => {
  const { data, error } = await supabase
    .from('health_records')
    .insert(record)
    .select()
    .single();
    
  if (error) {
    console.error('Error adding health record:', error);
    throw error;
  }
  
  return data as HealthRecord;
};

/**
 * Update a health record
 */
export const updateHealthRecord = async (recordId: string, updates: Partial<HealthRecord>): Promise<HealthRecord> => {
  const { data, error } = await supabase
    .from('health_records')
    .update(updates)
    .eq('id', recordId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating health record:', error);
    throw error;
  }
  
  return data as HealthRecord;
};

/**
 * Delete a health record
 */
export const deleteHealthRecord = async (recordId: string): Promise<void> => {
  const { error } = await supabase
    .from('health_records')
    .delete()
    .eq('id', recordId);
    
  if (error) {
    console.error('Error deleting health record:', error);
    throw error;
  }
};

/**
 * Get upcoming due vaccinations
 */
export const getUpcomingVaccinations = async (dogId?: string): Promise<HealthRecord[]> => {
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthStr = nextMonth.toISOString().split('T')[0];
  
  let query = supabase
    .from('health_records')
    .select('*')
    .eq('record_type', HealthRecordTypeEnum.Vaccination)
    .gte('next_due_date', today)
    .lte('next_due_date', nextMonthStr);
    
  if (dogId) {
    query = query.eq('dog_id', dogId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching upcoming vaccinations:', error);
    throw error;
  }
  
  return data as HealthRecord[];
};

/**
 * Get upcoming medications
 */
export const getUpcomingMedications = async (dogId?: string): Promise<HealthRecord[]> => {
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthStr = nextMonth.toISOString().split('T')[0];
  
  let query = supabase
    .from('health_records')
    .select('*')
    .eq('record_type', HealthRecordTypeEnum.Medication)
    .gte('next_due_date', today)
    .lte('next_due_date', nextMonthStr);
    
  if (dogId) {
    query = query.eq('dog_id', dogId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching upcoming medications:', error);
    throw error;
  }
  
  return data as HealthRecord[];
};

/**
 * Get expiring medications
 */
export const getExpiringMedications = async (dogId?: string): Promise<HealthRecord[]> => {
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthStr = nextMonth.toISOString().split('T')[0];
  
  let query = supabase
    .from('health_records')
    .select('*')
    .eq('record_type', HealthRecordTypeEnum.Medication)
    .gte('expiration_date', today)
    .lte('expiration_date', nextMonthStr);
    
  if (dogId) {
    query = query.eq('dog_id', dogId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching expiring medications:', error);
    throw error;
  }
  
  return data as HealthRecord[];
};

/**
 * Get weight history for a dog
 */
export const getWeightHistory = async (dogId: string): Promise<WeightRecord[]> => {
  const { data, error } = await supabase
    .from('weight_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('date', { ascending: false });
    
  if (error) {
    console.error('Error fetching weight history:', error);
    throw error;
  }
  
  return data as WeightRecord[];
};

/**
 * Add a weight record
 */
export const addWeightRecord = async (record: Partial<WeightRecord>): Promise<WeightRecord> => {
  const { data, error } = await supabase
    .from('weight_records')
    .insert(record)
    .select()
    .single();
    
  if (error) {
    console.error('Error adding weight record:', error);
    throw error;
  }
  
  return data as WeightRecord;
};

/**
 * Delete a weight record
 */
export const deleteWeightRecord = async (recordId: string): Promise<void> => {
  const { error } = await supabase
    .from('weight_records')
    .delete()
    .eq('id', recordId);
    
  if (error) {
    console.error('Error deleting weight record:', error);
    throw error;
  }
};

/**
 * Get all weight records
 */
export const getWeightRecords = async (dogId?: string, puppyId?: string): Promise<WeightRecord[]> => {
  let query = supabase
    .from('weight_records')
    .select('*')
    .order('date', { ascending: false });
    
  if (dogId) {
    query = query.eq('dog_id', dogId);
  }
  
  if (puppyId) {
    query = query.eq('puppy_id', puppyId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching weight records:', error);
    throw error;
  }
  
  return data as WeightRecord[];
};
