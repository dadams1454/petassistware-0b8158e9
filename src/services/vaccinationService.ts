
import { supabase } from '@/integrations/supabase/client';

// Define types for vaccination schedules
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  dog_id?: string;
  vaccine_name: string;
  due_date: string;
  administered: boolean;
  administered_date?: string;
  notes?: string;
  created_at?: string;
  vaccination_type?: string; // For backward compatibility
  scheduled_date?: string; // For backward compatibility
}

/**
 * Retrieve vaccination schedules for a puppy
 */
export const getVaccinationSchedules = async (puppyId: string): Promise<VaccinationSchedule[]> => {
  try {
    const { data, error } = await supabase
      .from('puppy_vaccination_schedule')
      .select('*')
      .eq('puppy_id', puppyId)
      .order('due_date', { ascending: true });
      
    if (error) throw error;
    
    // Convert database fields to match VaccinationSchedule interface
    return (data || []).map(record => ({
      id: record.id,
      puppy_id: record.puppy_id,
      dog_id: record.dog_id,
      vaccine_name: record.vaccination_type,  // Map vaccination_type to vaccine_name
      vaccination_type: record.vaccination_type, // Keep for backward compatibility
      due_date: record.due_date,
      scheduled_date: record.due_date, // For backward compatibility
      administered: record.administered || false,
      administered_date: record.administered_date,
      notes: record.notes,
      created_at: record.created_at
    })) as VaccinationSchedule[];
  } catch (error) {
    console.error('Error fetching vaccination schedules:', error);
    throw new Error('Failed to fetch vaccination schedules');
  }
};

/**
 * Save a vaccination schedule
 */
export const saveVaccinationSchedule = async (data: Partial<VaccinationSchedule>): Promise<VaccinationSchedule> => {
  try {
    // Ensure required fields have default values
    const schedulingData = {
      puppy_id: data.puppy_id,
      dog_id: data.dog_id,
      vaccination_type: data.vaccine_name || data.vaccination_type, // Map vaccine_name to vaccination_type
      due_date: data.due_date || data.scheduled_date, // Use scheduled_date as fallback
      administered: data.administered !== undefined ? data.administered : false,
      administered_date: data.administered_date,
      notes: data.notes
    };
    
    const { data: savedData, error } = await supabase
      .from('puppy_vaccination_schedule')
      .insert(schedulingData)
      .select()
      .single();
      
    if (error) throw error;
    
    // Convert back to VaccinationSchedule interface
    return {
      id: savedData.id,
      puppy_id: savedData.puppy_id,
      dog_id: savedData.dog_id,
      vaccine_name: savedData.vaccination_type,
      vaccination_type: savedData.vaccination_type, // For backward compatibility
      due_date: savedData.due_date,
      scheduled_date: savedData.due_date, // For backward compatibility
      administered: savedData.administered || false,
      administered_date: savedData.administered_date,
      notes: savedData.notes,
      created_at: savedData.created_at
    } as VaccinationSchedule;
  } catch (error) {
    console.error('Error saving vaccination schedule:', error);
    throw new Error('Failed to save vaccination schedule');
  }
};

/**
 * Update a vaccination schedule
 */
export const updateVaccinationSchedule = async (id: string, data: Partial<VaccinationSchedule>): Promise<VaccinationSchedule> => {
  try {
    // Prepare data for database - map VaccinationSchedule fields to database fields
    const dbRecord: Record<string, any> = {};
    
    if (data.vaccine_name !== undefined) dbRecord.vaccination_type = data.vaccine_name;
    if (data.vaccination_type !== undefined) dbRecord.vaccination_type = data.vaccination_type;
    if (data.due_date !== undefined) dbRecord.due_date = data.due_date;
    if (data.scheduled_date !== undefined && !data.due_date) dbRecord.due_date = data.scheduled_date;
    if (data.administered !== undefined) dbRecord.administered = data.administered;
    if (data.administered_date !== undefined) dbRecord.administered_date = data.administered_date;
    if (data.notes !== undefined) dbRecord.notes = data.notes;
    if (data.dog_id !== undefined) dbRecord.dog_id = data.dog_id;
    
    const { data: updatedData, error } = await supabase
      .from('puppy_vaccination_schedule')
      .update(dbRecord)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Convert back to VaccinationSchedule interface
    return {
      id: updatedData.id,
      puppy_id: updatedData.puppy_id,
      dog_id: updatedData.dog_id,
      vaccine_name: updatedData.vaccination_type,
      vaccination_type: updatedData.vaccination_type, // For backward compatibility
      due_date: updatedData.due_date,
      scheduled_date: updatedData.due_date, // For backward compatibility
      administered: updatedData.administered || false,
      administered_date: updatedData.administered_date,
      notes: updatedData.notes,
      created_at: updatedData.created_at
    } as VaccinationSchedule;
  } catch (error) {
    console.error('Error updating vaccination schedule:', error);
    throw new Error('Failed to update vaccination schedule');
  }
};

/**
 * Delete a vaccination schedule
 */
export const deleteVaccinationSchedule = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('puppy_vaccination_schedule')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return;
  } catch (error) {
    console.error('Error deleting vaccination schedule:', error);
    throw new Error('Failed to delete vaccination schedule');
  }
};

/**
 * Log a completed vaccination
 */
export const logVaccination = async (data: {
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  lot_number?: string;
  administered_by?: string;
  notes?: string;
}): Promise<any> => {
  try {
    const { data: savedData, error } = await supabase
      .from('puppy_vaccinations')
      .insert(data)
      .select()
      .single();
      
    if (error) throw error;
    
    return savedData;
  } catch (error) {
    console.error('Error logging vaccination:', error);
    throw new Error('Failed to log vaccination');
  }
};

/**
 * Get all completed vaccinations for a puppy
 */
export const getPuppyVaccinations = async (puppyId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('puppy_vaccinations')
      .select('*')
      .eq('puppy_id', puppyId)
      .order('vaccination_date', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching puppy vaccinations:', error);
    throw new Error('Failed to fetch puppy vaccinations');
  }
};
