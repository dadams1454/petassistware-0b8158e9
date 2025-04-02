
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord } from '@/types/health';
import { format, addDays } from 'date-fns';

// Get all health records for a dog
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .order('visit_date', { ascending: false });

    if (error) {
      throw error;
    }

    return data as HealthRecord[];
  } catch (error) {
    console.error('Error fetching health records:', error);
    return [];
  }
};

// Get a specific health record
export const getHealthRecord = async (recordId: string): Promise<HealthRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('id', recordId)
      .single();

    if (error) {
      throw error;
    }

    return data as HealthRecord;
  } catch (error) {
    console.error('Error fetching health record:', error);
    return null;
  }
};

// Create a new health record
export const createHealthRecord = async (record: Partial<HealthRecord>): Promise<HealthRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .insert(record)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as HealthRecord;
  } catch (error) {
    console.error('Error creating health record:', error);
    return null;
  }
};

// Update an existing health record
export const updateHealthRecord = async (
  recordId: string,
  updates: Partial<HealthRecord>
): Promise<HealthRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .update(updates)
      .eq('id', recordId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as HealthRecord;
  } catch (error) {
    console.error('Error updating health record:', error);
    return null;
  }
};

// Delete a health record
export const deleteHealthRecord = async (recordId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', recordId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting health record:', error);
    return false;
  }
};

// Get upcoming medications (due within next 7 days)
export const getUpcomingMedications = async (dogId?: string): Promise<HealthRecord[]> => {
  try {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    
    // Start with the base query
    let query = supabase
      .from('health_records')
      .select('*')
      .gte('next_due_date', format(today, 'yyyy-MM-dd'))
      .lte('next_due_date', format(nextWeek, 'yyyy-MM-dd'))
      .is('reminder_sent', false)
      .in('record_type', ['medication', 'vaccination']);
    
    // Add dog filter if provided
    if (dogId) {
      query = query.eq('dog_id', dogId);
    }
    
    const { data, error } = await query.order('next_due_date', { ascending: true });

    if (error) {
      throw error;
    }

    return data as HealthRecord[];
  } catch (error) {
    console.error('Error fetching upcoming medications:', error);
    return [];
  }
};

// Get expiring medications (expiring within next 30 days)
export const getExpiringMedications = async (dogId?: string): Promise<HealthRecord[]> => {
  try {
    const today = new Date();
    const nextMonth = addDays(today, 30);
    
    // Start with the base query
    let query = supabase
      .from('health_records')
      .select('*')
      .gte('expiration_date', format(today, 'yyyy-MM-dd'))
      .lte('expiration_date', format(nextMonth, 'yyyy-MM-dd'))
      .in('record_type', ['medication']);
    
    // Add dog filter if provided
    if (dogId) {
      query = query.eq('dog_id', dogId);
    }
    
    const { data, error } = await query.order('expiration_date', { ascending: true });

    if (error) {
      throw error;
    }

    return data as HealthRecord[];
  } catch (error) {
    console.error('Error fetching expiring medications:', error);
    return [];
  }
};

// Get health indicators for a dog
export const getHealthIndicators = async (dogId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('health_indicators')
      .select('*')
      .eq('dog_id', dogId)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching health indicators:', error);
    return [];
  }
};

// Add a health indicator
export const addHealthIndicator = async (indicator: any): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('health_indicators')
      .insert(indicator)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding health indicator:', error);
    return null;
  }
};
