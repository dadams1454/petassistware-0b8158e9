
import { supabase } from '@/integrations/supabase/client';
import { 
  HealthRecord, 
  HealthRecordTypeEnum, 
  HealthRecordType,
  WeightRecord,
  adaptHealthRecord,
  adaptWeightRecord
} from '@/types/health';

// Health Records
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('visit_date', { ascending: false });

  if (error) throw error;
  
  // Map the database records to our interface
  return (data || []).map(record => adaptHealthRecord(record));
};

export const getHealthRecordsByType = async (dogId: string, type: HealthRecordType): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .eq('record_type', type)
    .order('visit_date', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(record => adaptHealthRecord(record));
};

export const addHealthRecord = async (record: Omit<HealthRecord, 'id' | 'created_at'>): Promise<HealthRecord> => {
  const { data, error } = await supabase
    .from('health_records')
    .insert([
      {
        dog_id: record.dog_id,
        record_type: record.record_type,
        title: record.title,
        description: record.description,
        visit_date: record.date || record.visit_date,
        performed_by: record.performed_by,
        next_due_date: record.next_due_date,
        // Include any other relevant fields
        ...record
      }
    ])
    .select()
    .single();

  if (error) throw error;
  
  return adaptHealthRecord(data);
};

export const updateHealthRecord = async (id: string, updates: Partial<HealthRecord>): Promise<HealthRecord> => {
  const { data, error } = await supabase
    .from('health_records')
    .update({
      record_type: updates.record_type,
      title: updates.title,
      description: updates.description,
      visit_date: updates.date || updates.visit_date,
      performed_by: updates.performed_by,
      next_due_date: updates.next_due_date,
      // Include any other relevant fields
      ...updates
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  return adaptHealthRecord(data);
};

export const deleteHealthRecord = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('health_records')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getUpcomingVaccinations = async (dogId: string, daysAhead = 30): Promise<HealthRecord[]> => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);
  
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .eq('record_type', HealthRecordTypeEnum.Vaccination)
    .gte('next_due_date', today.toISOString().split('T')[0])
    .lte('next_due_date', futureDate.toISOString().split('T')[0])
    .order('next_due_date', { ascending: true });

  if (error) throw error;
  
  return (data || []).map(record => adaptHealthRecord(record));
};

// Weight Records
export const getWeightHistory = async (dogId: string): Promise<WeightRecord[]> => {
  const { data, error } = await supabase
    .from('weight_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('date', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(record => adaptWeightRecord(record));
};

export const addWeightRecord = async (record: Omit<WeightRecord, 'id' | 'created_at'>): Promise<WeightRecord> => {
  const { data, error } = await supabase
    .from('weight_records')
    .insert([
      {
        dog_id: record.dog_id,
        weight: record.weight,
        weight_unit: record.unit || record.weight_unit, // Use unit if provided, otherwise use weight_unit
        date: record.date,
        notes: record.notes
      }
    ])
    .select()
    .single();

  if (error) throw error;
  
  return adaptWeightRecord(data);
};

export const deleteWeightRecord = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('weight_records')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
