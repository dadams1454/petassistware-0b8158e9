
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordTypeEnum, WeightRecord } from '@/types/health';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';
import { standardizeWeightUnit } from '@/types/common';

/**
 * Add a new health record for a dog
 */
export const addHealthRecord = async (healthRecord: Omit<HealthRecord, 'id' | 'created_at'>) => {
  try {
    // Format date for consistency
    const visitDate = healthRecord.visit_date ? formatDateToYYYYMMDD(healthRecord.visit_date) : formatDateToYYYYMMDD(new Date());
    const nextDueDate = healthRecord.next_due_date ? formatDateToYYYYMMDD(healthRecord.next_due_date) : null;
    
    // Set defaults for optional fields
    const recordData = {
      ...healthRecord,
      visit_date: visitDate,
      next_due_date: nextDueDate,
      document_url: healthRecord.document_url || '',
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('health_records')
      .insert(recordData)
      .select()
      .single();
      
    if (error) {
      console.error('Error adding health record:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addHealthRecord:', error);
    throw error;
  }
};

/**
 * Get health records for a specific dog
 */
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .order('visit_date', { ascending: false });
      
    if (error) {
      console.error('Error fetching health records:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getHealthRecords:', error);
    throw error;
  }
};

/**
 * Delete a health record
 */
export const deleteHealthRecord = async (recordId: string) => {
  try {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', recordId);
      
    if (error) {
      console.error('Error deleting health record:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteHealthRecord:', error);
    throw error;
  }
};

/**
 * Update a health record
 */
export const updateHealthRecord = async (recordId: string, updates: Partial<HealthRecord>) => {
  try {
    // Format dates if present
    if (updates.visit_date) {
      updates.visit_date = formatDateToYYYYMMDD(updates.visit_date);
    }
    
    if (updates.next_due_date) {
      updates.next_due_date = formatDateToYYYYMMDD(updates.next_due_date);
    }
    
    const { data, error } = await supabase
      .from('health_records')
      .update(updates)
      .eq('id', recordId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating health record:', error);
      throw error;
    }
    
    return data;
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
      
    if (error) {
      console.error('Error fetching weight records:', error);
      throw error;
    }
    
    // Convert legacy weight units
    return (data || []).map(record => ({
      ...record,
      weight_unit: standardizeWeightUnit(record.weight_unit),
    }));
  } catch (error) {
    console.error('Error in getWeightRecords:', error);
    throw error;
  }
};

/**
 * Add a new weight record
 */
export const addWeightRecord = async (weightData: Omit<WeightRecord, 'id' | 'created_at'>) => {
  try {
    // Format date and standardize weight unit
    const formattedDate = formatDateToYYYYMMDD(weightData.date);
    const standardizedUnit = standardizeWeightUnit(weightData.weight_unit);
    
    const { data, error } = await supabase
      .from('weight_records')
      .insert({
        ...weightData,
        date: formattedDate,
        weight_unit: standardizedUnit,
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error adding weight record:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addWeightRecord:', error);
    throw error;
  }
};

/**
 * Delete a weight record
 */
export const deleteWeightRecord = async (recordId: string) => {
  try {
    const { error } = await supabase
      .from('weight_records')
      .delete()
      .eq('id', recordId);
      
    if (error) {
      console.error('Error deleting weight record:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteWeightRecord:', error);
    throw error;
  }
};

/**
 * Utility to map from form data to weight record
 */
export const mapToWeightRecord = (formData: any, dogId: string): Omit<WeightRecord, 'id' | 'created_at'> => {
  return {
    dog_id: dogId,
    weight: parseFloat(formData.weight),
    weight_unit: formData.weight_unit,
    date: formData.date,
    notes: formData.notes || '',
  };
};
