
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord } from '@/types/dog';

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
  
  // Map to the HealthRecord type
  return (data || []).map(record => ({
    id: record.id,
    dog_id: record.dog_id,
    date: record.visit_date,
    record_type: record.record_type || 'examination',
    title: record.title || `${record.vet_name} Visit`,
    description: record.record_notes || '',
    performed_by: record.performed_by || record.vet_name,
    next_due_date: record.next_due_date,
    created_at: record.created_at
  })) as HealthRecord[];
};

// Add a new health record
export const addHealthRecord = async (record: Omit<HealthRecord, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('health_records')
    .insert({
      dog_id: record.dog_id,
      visit_date: record.date,
      record_type: record.record_type,
      title: record.title,
      record_notes: record.description,
      performed_by: record.performed_by,
      vet_name: record.performed_by,
      next_due_date: record.next_due_date,
    })
    .select();
    
  if (error) {
    console.error('Error adding health record:', error);
    throw error;
  }
  
  return data![0];
};

// Update a health record
export const updateHealthRecord = async (id: string, updates: Partial<Omit<HealthRecord, 'id' | 'created_at'>>) => {
  const { data, error } = await supabase
    .from('health_records')
    .update({
      visit_date: updates.date,
      record_type: updates.record_type,
      title: updates.title,
      record_notes: updates.description,
      performed_by: updates.performed_by,
      vet_name: updates.performed_by,
      next_due_date: updates.next_due_date,
    })
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating health record:', error);
    throw error;
  }
  
  return data![0];
};

// Delete a health record
export const deleteHealthRecord = async (id: string) => {
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
