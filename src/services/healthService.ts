
import { supabase } from '@/integrations/supabase/client';
import { 
  HealthRecord, 
  HealthRecordTypeEnum, 
  stringToHealthRecordType,
  WeightRecord
} from '@/types/health';
import { Medication } from '@/types/health';

// Get health records for a dog
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .order('visit_date', { ascending: false });
    
    if (error) throw error;
    
    // Cast the records to ensure they have the correct type
    return (data || []).map(record => ({
      ...record,
      record_type: stringToHealthRecordType(record.record_type)
    })) as HealthRecord[];
  } catch (err) {
    console.error('Error fetching health records:', err);
    throw err;
  }
};

// Get a specific health record
export const getHealthRecord = async (recordId: string): Promise<HealthRecord> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('id', recordId)
      .single();
    
    if (error) throw error;
    
    // Cast the record to ensure it has the correct type
    return {
      ...data,
      record_type: stringToHealthRecordType(data.record_type)
    } as HealthRecord;
  } catch (err) {
    console.error('Error fetching health record:', err);
    throw err;
  }
};

// Add a new health record
export const addHealthRecord = async (record: Omit<HealthRecord, 'id'>): Promise<HealthRecord> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .insert(record)
      .select()
      .single();
    
    if (error) throw error;
    
    // Cast the record to ensure it has the correct type
    return {
      ...data,
      record_type: stringToHealthRecordType(data.record_type)
    } as HealthRecord;
  } catch (err) {
    console.error('Error adding health record:', err);
    throw err;
  }
};

// Update an existing health record
export const updateHealthRecord = async (
  recordId: string, 
  updates: Partial<HealthRecord>
): Promise<HealthRecord> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .update(updates)
      .eq('id', recordId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Cast the record to ensure it has the correct type
    return {
      ...data,
      record_type: stringToHealthRecordType(data.record_type)
    } as HealthRecord;
  } catch (err) {
    console.error('Error updating health record:', err);
    throw err;
  }
};

// Delete a health record
export const deleteHealthRecord = async (recordId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', recordId);
    
    if (error) throw error;
  } catch (err) {
    console.error('Error deleting health record:', err);
    throw err;
  }
};

// Get upcoming vaccinations
export const getUpcomingVaccinations = async (dogId: string): Promise<HealthRecord[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .eq('record_type', HealthRecordTypeEnum.Vaccination)
      .gt('next_due_date', today)
      .order('next_due_date', { ascending: true });
    
    if (error) throw error;
    
    // Cast the records to ensure they have the correct type
    return (data || []).map(record => ({
      ...record,
      record_type: stringToHealthRecordType(record.record_type)
    })) as HealthRecord[];
  } catch (err) {
    console.error('Error fetching upcoming vaccinations:', err);
    throw err;
  }
};

// Get upcoming/expiring medications
export const getUpcomingMedications = async (dogId: string): Promise<Medication[]> => {
  try {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('dog_id', dogId)
      .eq('is_active', true)
      .order('next_due_date', { ascending: true });
    
    if (error) throw error;
    
    return data as Medication[];
  } catch (err) {
    console.error('Error fetching upcoming medications:', err);
    throw err;
  }
};

// Get expiring medications
export const getExpiringMedications = async (dogId: string): Promise<Medication[]> => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('dog_id', dogId)
      .eq('is_active', true)
      .lt('end_date', thirtyDaysFromNow.toISOString().split('T')[0])
      .gt('end_date', today.toISOString().split('T')[0])
      .order('end_date', { ascending: true });
    
    if (error) throw error;
    
    return data as Medication[];
  } catch (err) {
    console.error('Error fetching expiring medications:', err);
    throw err;
  }
};

// Add a weight record for a dog
export const addWeightRecord = async (dogId: string, weightData: Omit<WeightRecord, 'id' | 'dog_id' | 'created_at'>): Promise<WeightRecord> => {
  try {
    const record = {
      dog_id: dogId,
      ...weightData
    };

    const { data, error } = await supabase
      .from('dog_weights')
      .insert(record)
      .select('*')
      .single();

    if (error) throw error;
    return data as WeightRecord;
  } catch (err) {
    console.error('Error adding weight record:', err);
    throw err;
  }
};

// Get weight records for a dog
export const getWeightRecords = async (dogId: string): Promise<WeightRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('dog_weights')
      .select('*')
      .eq('dog_id', dogId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data as WeightRecord[];
  } catch (err) {
    console.error('Error fetching weight records:', err);
    throw err;
  }
};

// Update a weight record
export const updateWeightRecord = async (recordId: string, updates: Partial<WeightRecord>): Promise<WeightRecord> => {
  try {
    const { data, error } = await supabase
      .from('dog_weights')
      .update(updates)
      .eq('id', recordId)
      .select('*')
      .single();

    if (error) throw error;
    return data as WeightRecord;
  } catch (err) {
    console.error('Error updating weight record:', err);
    throw err;
  }
};

// Delete a weight record
export const deleteWeightRecord = async (recordId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('dog_weights')
      .delete()
      .eq('id', recordId);

    if (error) throw error;
  } catch (err) {
    console.error('Error deleting weight record:', err);
    throw err;
  }
};
