import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordTypeEnum } from '@/types/health';

// Fix the issue with record type incompatibility
export const addHealthRecord = async (record: Omit<HealthRecord, 'id' | 'created_at'>) => {
  try {
    // Ensure record_type is a valid enum value
    const validatedRecord = {
      ...record,
      // Convert string record_type to enum if needed
      record_type: record.record_type ? record.record_type : HealthRecordTypeEnum.Other,
      // Set default values for required fields
      vet_name: record.vet_name || 'Unknown', // This addresses the required property issue
    };
    
    const { data, error } = await supabase
      .from('health_records')
      .insert(validatedRecord);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding health record:', error);
    throw error;
  }
};

// Fix bulk insert of health records
export const bulkAddHealthRecords = async (records: Omit<HealthRecord, 'id' | 'created_at'>[]) => {
  if (!records || records.length === 0) return [];
  
  try {
    // Ensure all records have required fields and valid types
    const validatedRecords = records.map(record => ({
      ...record,
      record_type: record.record_type || HealthRecordTypeEnum.Other,
      vet_name: record.vet_name || 'Unknown', // Required field
    }));
    
    // Handle one record at a time to avoid type issues
    const results = [];
    for (const record of validatedRecords) {
      const { data, error } = await supabase
        .from('health_records')
        .insert(record);
      
      if (error) throw error;
      results.push(data);
    }
    
    return results;
  } catch (error) {
    console.error('Error bulk adding health records:', error);
    throw error;
  }
};

export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId);
    
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

export const getHealthRecordsByType = async (dogId: string, recordType: HealthRecordTypeEnum): Promise<HealthRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .eq('record_type', recordType);
    
    if (error) {
      console.error(`Error fetching health records of type ${recordType}:`, error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error in getHealthRecordsByType for type ${recordType}:`, error);
    throw error;
  }
};

export const updateHealthRecord = async (id: string, updates: Partial<HealthRecord>) => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .update(updates)
      .eq('id', id)
      .select();
    
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

export const deleteHealthRecord = async (id: string) => {
  try {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting health record:', error);
      throw error;
    }
    
    return;
  } catch (error) {
    console.error('Error in deleteHealthRecord:', error);
    throw error;
  }
};

export const getUpcomingVaccinations = async (dogId: string, daysAhead: number = 30): Promise<HealthRecord[]> => {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);
    
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .eq('record_type', HealthRecordTypeEnum.Vaccination)
      .gte('next_due_date', today.toISOString())
      .lte('next_due_date', futureDate.toISOString());
    
    if (error) {
      console.error('Error fetching upcoming vaccinations:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUpcomingVaccinations:', error);
    throw error;
  }
};
