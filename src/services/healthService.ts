
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordType, WeightRecord } from '@/types/health';

// Get all health records for a dog
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
  
  // Return data as HealthRecord type
  return data || [];
};

// Get health records by type
export const getHealthRecordsByType = async (
  dogId: string, 
  recordType: HealthRecordType
): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .eq('record_type', recordType)
    .order('visit_date', { ascending: false });
    
  if (error) {
    console.error(`Error fetching ${recordType} records:`, error);
    throw error;
  }
  
  return data || [];
};

// Add a new health record
export const addHealthRecord = async (record: Omit<HealthRecord, 'id' | 'created_at'>): Promise<HealthRecord> => {
  // We don't need to transform data as our interface now matches the database
  const { data, error } = await supabase
    .from('health_records')
    .insert(record)
    .select();
    
  if (error) {
    console.error('Error adding health record:', error);
    throw error;
  }
  
  return data![0];
};

// Update a health record
export const updateHealthRecord = async (id: string, updates: Partial<Omit<HealthRecord, 'id' | 'created_at'>>): Promise<HealthRecord> => {
  const { data, error } = await supabase
    .from('health_records')
    .update(updates)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating health record:', error);
    throw error;
  }
  
  return data![0];
};

// Delete a health record
export const deleteHealthRecord = async (id: string): Promise<string> => {
  const { error } = await supabase
    .from('health_records')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting health record:', error);
    throw error;
  }
  
  return id;
};

// Get upcoming due vaccinations
export const getUpcomingVaccinations = async (dogId: string, daysAhead = 30): Promise<HealthRecord[]> => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .eq('record_type', HealthRecordType.Vaccination)
    .lte('next_due_date', futureDate.toISOString().split('T')[0])
    .gte('next_due_date', new Date().toISOString().split('T')[0])
    .order('next_due_date', { ascending: true });
    
  if (error) {
    console.error('Error fetching upcoming vaccinations:', error);
    throw error;
  }
  
  return data || [];
};

// Weight record functions
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
  
  return data || [];
};

export const addWeightRecord = async (
  record: Omit<WeightRecord, 'id' | 'created_at'>
): Promise<WeightRecord> => {
  const { data, error } = await supabase
    .from('weight_records')
    .insert({
      dog_id: record.dog_id,
      date: record.date,
      weight: record.weight,
      weight_unit: record.weight_unit,
      notes: record.notes
    })
    .select();
    
  if (error) {
    console.error('Error adding weight record:', error);
    throw error;
  }
  
  return data![0];
};

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

// Helper for converting date fields between UI and database
export const formatDateForDatabase = (date: Date | string | null | undefined): string | undefined => {
  if (!date) return undefined;
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0];
};

// Helper for converting database dates to Date objects for UI
export const parseDatabaseDate = (dateString: string | null | undefined): Date | undefined => {
  if (!dateString) return undefined;
  return new Date(dateString);
};
