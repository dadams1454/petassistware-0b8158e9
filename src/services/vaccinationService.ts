
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
    
    return data as VaccinationSchedule[];
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
    const { data: savedData, error } = await supabase
      .from('puppy_vaccination_schedule')
      .insert(data)
      .select()
      .single();
      
    if (error) throw error;
    
    return savedData as VaccinationSchedule;
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
    const { data: updatedData, error } = await supabase
      .from('puppy_vaccination_schedule')
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return updatedData as VaccinationSchedule;
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
