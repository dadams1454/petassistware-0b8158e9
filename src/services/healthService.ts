
import { supabase } from '@/integrations/supabase/client';
import { formatDateForDisplay } from '@/utils/dateUtils';

/**
 * Fetch all health records for a dog
 */
export async function fetchDogHealthRecords(dogId: string) {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .order('visit_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching health records:', error);
    throw error;
  }
}

/**
 * Fetch all vaccinations for a dog
 */
export async function fetchDogVaccinations(dogId: string) {
  try {
    const { data, error } = await supabase
      .from('dog_vaccinations')
      .select('*')
      .eq('dog_id', dogId)
      .order('vaccination_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching vaccinations:', error);
    throw error;
  }
}

/**
 * Add a new health record
 */
export async function addHealthRecord(record: any) {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .insert(record);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding health record:', error);
    throw error;
  }
}

/**
 * Update an existing health record
 */
export async function updateHealthRecord(id: string, record: any) {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .update(record)
      .eq('id', id);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating health record:', error);
    throw error;
  }
}

/**
 * Delete a health record
 */
export async function deleteHealthRecord(id: string) {
  try {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting health record:', error);
    throw error;
  }
}
