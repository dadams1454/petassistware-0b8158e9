
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, WeightRecord } from '@/types/health';

// Get health records for a specific dog
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('visit_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get a single health record by ID
export const getHealthRecord = async (recordId: string): Promise<HealthRecord | null> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('id', recordId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Get health records by type (e.g., 'vaccination', 'examination', 'medication')
export const getHealthRecordsByType = async (dogId: string, recordType: string): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .eq('record_type', recordType)
    .order('visit_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Add a new health record
export const addHealthRecord = async (record: Omit<HealthRecord, 'id' | 'created_at'>): Promise<HealthRecord> => {
  const { data, error } = await supabase
    .from('health_records')
    .insert(record)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update an existing health record
export const updateHealthRecord = async (recordId: string, updates: Partial<HealthRecord>): Promise<HealthRecord> => {
  const { data, error } = await supabase
    .from('health_records')
    .update(updates)
    .eq('id', recordId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a health record
export const deleteHealthRecord = async (recordId: string): Promise<void> => {
  const { error } = await supabase
    .from('health_records')
    .delete()
    .eq('id', recordId);

  if (error) throw error;
};

// Get upcoming vaccinations that are due in the next 30 days
export const getUpcomingVaccinations = async (dogId?: string): Promise<HealthRecord[]> => {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  let query = supabase
    .from('health_records')
    .select('*')
    .eq('record_type', 'vaccination')
    .lte('next_due_date', thirtyDaysFromNow.toISOString().split('T')[0])
    .gte('next_due_date', new Date().toISOString().split('T')[0])
    .order('next_due_date', { ascending: true });
  
  if (dogId) {
    query = query.eq('dog_id', dogId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
};

// Get medications that will expire in the next 30 days
export const getExpiringMedications = async (dogId?: string): Promise<HealthRecord[]> => {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  let query = supabase
    .from('health_records')
    .select('*')
    .eq('record_type', 'medication')
    .lte('expiration_date', thirtyDaysFromNow.toISOString().split('T')[0])
    .gte('expiration_date', new Date().toISOString().split('T')[0])
    .order('expiration_date', { ascending: true });
  
  if (dogId) {
    query = query.eq('dog_id', dogId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
};

// Get upcoming medications that need to be administered in the next 7 days
export const getUpcomingMedications = async (dogId?: string): Promise<HealthRecord[]> => {
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  let query = supabase
    .from('health_records')
    .select('*')
    .eq('record_type', 'medication')
    .lte('next_due_date', sevenDaysFromNow.toISOString().split('T')[0])
    .gte('next_due_date', new Date().toISOString().split('T')[0])
    .order('next_due_date', { ascending: true });
  
  if (dogId) {
    query = query.eq('dog_id', dogId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
};

// Weight tracking functions
export const getWeightHistory = async (dogId: string): Promise<WeightRecord[]> => {
  const { data, error } = await supabase
    .from('weight_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addWeightRecord = async (record: Omit<WeightRecord, 'id' | 'created_at'>): Promise<WeightRecord> => {
  const { data, error } = await supabase
    .from('weight_records')
    .insert(record)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteWeightRecord = async (recordId: string): Promise<void> => {
  const { error } = await supabase
    .from('weight_records')
    .delete()
    .eq('id', recordId);

  if (error) throw error;
};
