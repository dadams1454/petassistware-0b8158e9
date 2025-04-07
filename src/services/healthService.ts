
import { supabase } from '@/integrations/supabase/client';
import { 
  HealthRecord, 
  WeightRecord
} from '@/types';
import { mapHealthRecordFromDB, mapHealthRecordToDB } from '@/lib/mappers/healthMapper';
import { mapWeightRecordFromDB, mapWeightRecordToDB } from '@/lib/mappers/weightMapper';

// Get health records for a dog
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  if (!dogId) return [];

  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('dog_id', dogId)
    .order('visit_date', { ascending: false });

  if (error) {
    console.error('Error fetching health records:', error);
    throw error;
  }

  return (data || []).map(record => mapHealthRecordFromDB(record));
};

// Add a health record
export const addHealthRecord = async (record: Partial<HealthRecord>): Promise<HealthRecord> => {
  if (!record.dog_id || !record.visit_date || !record.vet_name) {
    throw new Error('Missing required fields for health record');
  }

  const dbRecord = mapHealthRecordToDB(record);

  const { data, error } = await supabase
    .from('health_records')
    .insert(dbRecord)
    .select()
    .single();

  if (error) {
    console.error('Error adding health record:', error);
    throw error;
  }

  return mapHealthRecordFromDB(data);
};

// Update a health record
export const updateHealthRecord = async (id: string, updates: Partial<HealthRecord>): Promise<HealthRecord> => {
  const dbUpdates = mapHealthRecordToDB(updates);

  const { data, error } = await supabase
    .from('health_records')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating health record:', error);
    throw error;
  }

  return mapHealthRecordFromDB(data);
};

// Delete a health record
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
