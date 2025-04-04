
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, WeightRecord, MedicationStatusEnum } from '@/types/health';
import { calculateMedicationStatus } from '@/utils/medicationUtils';

// Get all health records for a dog
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .order('visit_date', { ascending: false });
      
    if (error) throw error;
    
    return data as HealthRecord[];
  } catch (error) {
    console.error('Error fetching health records:', error);
    return [];
  }
};

// Get weight records for a dog
export const getWeightRecords = async (dogId: string): Promise<WeightRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('weight_records')
      .select('*')
      .eq('dog_id', dogId)
      .order('date', { ascending: false });
      
    if (error) throw error;
    
    return data as WeightRecord[];
  } catch (error) {
    console.error('Error fetching weight records:', error);
    return [];
  }
};

// Add a health record
export const addHealthRecord = async (record: Partial<HealthRecord>): Promise<HealthRecord | null> => {
  try {
    // Set the visit_date field to match the date field for consistency
    if (record.date && !record.visit_date) {
      record.visit_date = record.date;
    }
    
    const { data, error } = await supabase
      .from('health_records')
      .insert(record)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as HealthRecord;
  } catch (error) {
    console.error('Error adding health record:', error);
    return null;
  }
};

// Update a health record
export const updateHealthRecord = async (id: string, updates: Partial<HealthRecord>): Promise<HealthRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as HealthRecord;
  } catch (error) {
    console.error('Error updating health record:', error);
    return null;
  }
};

// Delete a health record
export const deleteHealthRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting health record:', error);
    return false;
  }
};

// Add a weight record
export const addWeightRecord = async (record: Partial<WeightRecord>): Promise<WeightRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('weight_records')
      .insert(record)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as WeightRecord;
  } catch (error) {
    console.error('Error adding weight record:', error);
    return null;
  }
};

// Update a weight record
export const updateWeightRecord = async (id: string, updates: Partial<WeightRecord>): Promise<WeightRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('weight_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as WeightRecord;
  } catch (error) {
    console.error('Error updating weight record:', error);
    return null;
  }
};

// Delete a weight record
export const deleteWeightRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('weight_records')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting weight record:', error);
    return false;
  }
};

// Get upcoming medications due within the next X days
export const getUpcomingMedications = async (dogId?: string, days: number = 30): Promise<HealthRecord[]> => {
  try {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    const query = supabase
      .from('health_records')
      .select('*')
      .eq('record_type', 'medication')
      .lte('next_due_date', endDate.toISOString().split('T')[0])
      .gt('next_due_date', new Date().toISOString().split('T')[0])
      .order('next_due_date', { ascending: true });
    
    if (dogId) {
      query.eq('dog_id', dogId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as HealthRecord[];
  } catch (error) {
    console.error('Error fetching upcoming medications:', error);
    return [];
  }
};

// Get expiring medications within the next X days
export const getExpiringMedications = async (dogId?: string, days: number = 30): Promise<HealthRecord[]> => {
  try {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    const query = supabase
      .from('health_records')
      .select('*')
      .eq('record_type', 'medication')
      .lte('expiration_date', endDate.toISOString().split('T')[0])
      .gt('expiration_date', new Date().toISOString().split('T')[0])
      .order('expiration_date', { ascending: true });
    
    if (dogId) {
      query.eq('dog_id', dogId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as HealthRecord[];
  } catch (error) {
    console.error('Error fetching expiring medications:', error);
    return [];
  }
};

// Get medications with no end date (ongoing)
export const getOngoingMedications = async (dogId: string): Promise<HealthRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .eq('record_type', 'medication')
      .is('end_date', null)
      .order('start_date', { ascending: false });
      
    if (error) throw error;
    
    // Calculate active status for each medication
    return data.map(med => ({
      ...med,
      status: calculateMedicationStatus(med.start_date, med.end_date)
    })) as HealthRecord[];
  } catch (error) {
    console.error('Error fetching ongoing medications:', error);
    return [];
  }
};
