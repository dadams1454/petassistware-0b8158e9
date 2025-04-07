
/**
 * @deprecated - Please import from '@/modules/health' instead.
 * This service will be removed in a future version.
 */

import { supabase } from '@/integrations/supabase/client';
import { HealthRecord } from '@/types/health';
import { mapHealthRecordFromDB, mapHealthRecordToDB } from '@/lib/mappers/healthMapper';

// Get health records for a dog
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  console.warn(
    'Warning: You are using a deprecated version of getHealthRecords. ' +
    'Please update your import to use "@/modules/health" instead.'
  );

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
  console.warn(
    'Warning: You are using a deprecated version of addHealthRecord. ' +
    'Please update your import to use "@/modules/health" instead.'
  );

  if (!record.dog_id && !record.puppy_id) {
    throw new Error('Either dog_id or puppy_id is required');
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
  console.warn(
    'Warning: You are using a deprecated version of updateHealthRecord. ' +
    'Please update your import to use "@/modules/health" instead.'
  );

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
  console.warn(
    'Warning: You are using a deprecated version of deleteHealthRecord. ' +
    'Please update your import to use "@/modules/health" instead.'
  );

  const { error } = await supabase
    .from('health_records')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting health record:', error);
    throw error;
  }
};
