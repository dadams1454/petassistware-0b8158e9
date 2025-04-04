
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordTypeEnum, WeightRecord, MedicationStatusEnum } from '@/types/health';
import { addDays, differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';

/**
 * Fetch all health records for a dog
 */
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .order('visit_date', { ascending: false });
      
    if (error) throw error;
    
    // Convert to fully typed health records
    return (data || []).map(record => ({
      ...record,
      date: record.visit_date, // Ensure date field is set
      record_type: record.record_type as HealthRecordTypeEnum
    })) as HealthRecord[];
  } catch (error) {
    console.error('Error in getHealthRecords:', error);
    throw error;
  }
};

/**
 * Add a new health record
 */
export const addHealthRecord = async (recordData: Partial<HealthRecord>): Promise<HealthRecord> => {
  try {
    // Ensure required fields are present
    if (!recordData.dog_id) throw new Error('Dog ID is required');
    if (!recordData.visit_date) throw new Error('Visit date is required');
    
    const { data, error } = await supabase
      .from('health_records')
      .insert({
        ...recordData,
        date: recordData.visit_date, // Keep both for compatibility
        vet_name: recordData.vet_name || 'Unknown'
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      date: data.visit_date,
      record_type: data.record_type as HealthRecordTypeEnum
    } as HealthRecord;
  } catch (error) {
    console.error('Error in addHealthRecord:', error);
    throw error;
  }
};

/**
 * Update a health record
 */
export const updateHealthRecord = async (id: string, recordData: Partial<HealthRecord>): Promise<HealthRecord> => {
  try {
    // If visit_date is being updated, also update date field
    const updateData = { ...recordData };
    if (updateData.visit_date) {
      updateData.date = updateData.visit_date;
    }
    
    const { data, error } = await supabase
      .from('health_records')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      date: data.visit_date,
      record_type: data.record_type as HealthRecordTypeEnum
    } as HealthRecord;
  } catch (error) {
    console.error('Error in updateHealthRecord:', error);
    throw error;
  }
};

/**
 * Get weight records for a dog
 */
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
    console.error('Error in getWeightRecords:', error);
    throw error;
  }
};

/**
 * Add a weight record for a dog
 */
export const addWeightRecord = async (recordData: Partial<WeightRecord>): Promise<WeightRecord> => {
  try {
    // Ensure required fields are present
    if (!recordData.dog_id) throw new Error('Dog ID is required');
    if (!recordData.weight) throw new Error('Weight is required');
    if (!recordData.weight_unit) throw new Error('Weight unit is required');
    if (!recordData.date) throw new Error('Date is required');
    
    const { data, error } = await supabase
      .from('weight_records')
      .insert(recordData)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as WeightRecord;
  } catch (error) {
    console.error('Error in addWeightRecord:', error);
    throw error;
  }
};

/**
 * Delete a weight record
 */
export const deleteWeightRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('weight_records')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error in deleteWeightRecord:', error);
    return false;
  }
};

/**
 * Get weight history for a dog
 */
export const getWeightHistory = async (dogId: string): Promise<WeightRecord[]> => {
  return getWeightRecords(dogId);
};

/**
 * Get medications due soon or overdue
 */
export const getExpiringMedications = async (
  dogId: string, 
  daysThreshold = 14
): Promise<HealthRecord[]> => {
  try {
    const today = new Date();
    const futureDate = addDays(today, daysThreshold);
    
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .eq('record_type', HealthRecordTypeEnum.Medication)
      .not('next_due_date', 'is', null);
      
    if (error) throw error;
    
    // Filter medications that are due within the threshold or overdue
    const dueOrExpiring = (data || []).filter(medication => {
      if (!medication.next_due_date) return false;
      
      const dueDate = parseISO(medication.next_due_date);
      return (
        // Due within threshold
        (isAfter(dueDate, today) && isBefore(dueDate, futureDate)) ||
        // Overdue
        isBefore(dueDate, today)
      );
    });
    
    return dueOrExpiring.map(record => ({
      ...record,
      date: record.visit_date, // Ensure date field is set
      record_type: record.record_type as HealthRecordTypeEnum
    })) as HealthRecord[];
  } catch (error) {
    console.error('Error in getExpiringMedications:', error);
    throw error;
  }
};

/**
 * Get upcoming medications (due in the future)
 */
export const getUpcomingMedications = async (
  dogId: string
): Promise<HealthRecord[]> => {
  try {
    const today = new Date();
    
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .eq('record_type', HealthRecordTypeEnum.Medication)
      .not('next_due_date', 'is', null);
      
    if (error) throw error;
    
    // Filter medications that are due in the future
    const upcoming = (data || []).filter(medication => {
      if (!medication.next_due_date) return false;
      
      const dueDate = parseISO(medication.next_due_date);
      return isAfter(dueDate, today);
    });
    
    return upcoming.map(record => ({
      ...record,
      date: record.visit_date, // Ensure date field is set
      record_type: record.record_type as HealthRecordTypeEnum
    })) as HealthRecord[];
  } catch (error) {
    console.error('Error in getUpcomingMedications:', error);
    throw error;
  }
};
