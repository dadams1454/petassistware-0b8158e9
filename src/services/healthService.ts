
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordTypeEnum, healthRecordTypeToString, WeightRecord } from '@/types';

/**
 * Get a health record by ID
 */
export const getHealthRecord = async (recordId: string): Promise<HealthRecord> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('id', recordId)
    .single();

  if (error) throw error;
  return data as HealthRecord;
};

/**
 * Get health records for a dog
 */
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('visit_date', { ascending: false });

  if (error) throw error;
  return data as HealthRecord[];
};

/**
 * Get upcoming medication records for a dog
 */
export const getUpcomingMedications = async (dogId?: string): Promise<HealthRecord[]> => {
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthStr = nextMonth.toISOString().split('T')[0];

  let query = supabase
    .from('health_records')
    .select('*')
    .eq('record_type', healthRecordTypeToString(HealthRecordTypeEnum.Medication))
    .gte('next_due_date', today)
    .lte('next_due_date', nextMonthStr)
    .order('next_due_date', { ascending: true });

  if (dogId) {
    query = query.eq('dog_id', dogId);
  }

  const { data, error } = await query;
  if (error) throw error;
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
    .eq('record_type', healthRecordTypeToString(HealthRecordTypeEnum.Medication))
    .not('expiration_date', 'is', null)
    .gte('expiration_date', today)
    .lte('expiration_date', nextMonthStr)
    .order('expiration_date', { ascending: true });

  if (dogId) {
    query = query.eq('dog_id', dogId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as HealthRecord[];
};

/**
 * Get health records by type
 */
export const getHealthRecordsByType = async (dogId: string, recordType: HealthRecordTypeEnum): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .eq('record_type', healthRecordTypeToString(recordType))
    .order('visit_date', { ascending: false });

  if (error) throw error;
  return data as HealthRecord[];
};

/**
 * Create a new health record
 */
export const createHealthRecord = async (record: Omit<HealthRecord, 'id' | 'created_at'>): Promise<HealthRecord> => {
  const { data, error } = await supabase
    .from('health_records')
    .insert(record)
    .select()
    .single();

  if (error) throw error;
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

  if (error) throw error;
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

  if (error) throw error;
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

  if (error) throw error;
  
  // Convert the weight_unit to unit for compatibility
  return data.map(record => ({
    ...record,
    unit: record.weight_unit
  })) as WeightRecord[];
};

/**
 * Create a weight record
 */
export const createWeightRecord = async (record: Omit<WeightRecord, 'id' | 'created_at'>): Promise<WeightRecord> => {
  const { data, error } = await supabase
    .from('weight_records')
    .insert({
      ...record,
      unit: record.weight_unit // Ensure both fields are set
    })
    .select()
    .single();

  if (error) throw error;
  return data as WeightRecord;
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
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No records found
      return null;
    }
    throw error;
  }
  
  return {
    ...data,
    unit: data.weight_unit
  } as WeightRecord;
};
