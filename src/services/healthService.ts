
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordTypeEnum, WeightRecord, WeightUnit } from '@/types/health';

// Health record functions
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

export const getHealthRecordsByType = async (dogId: string, recordType: HealthRecordTypeEnum): Promise<HealthRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('dog_id', dogId)
      .eq('record_type', recordType)
      .order('visit_date', { ascending: false });
      
    if (error) throw error;
    
    return data as HealthRecord[];
  } catch (error) {
    console.error(`Error fetching ${recordType} records:`, error);
    return [];
  }
};

// Function to get upcoming medications for a specific dog or all dogs
export const getUpcomingMedications = async (dogId?: string): Promise<HealthRecord[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    const thirtyDaysLaterStr = thirtyDaysLater.toISOString().split('T')[0];
    
    let query = supabase
      .from('health_records')
      .select('*')
      .eq('record_type', HealthRecordTypeEnum.Medication)
      .gte('next_due_date', today)
      .lte('next_due_date', thirtyDaysLaterStr)
      .order('next_due_date', { ascending: true });
      
    // If dogId is provided, filter by that dog
    if (dogId) {
      query = query.eq('dog_id', dogId);
    }
    
    const { data, error } = await query;
      
    if (error) throw error;
    
    return data as HealthRecord[];
  } catch (error) {
    console.error('Error fetching upcoming medications:', error);
    return [];
  }
};

// Function to get medications that are expiring soon
export const getExpiringMedications = async (dogId?: string): Promise<HealthRecord[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    const thirtyDaysLaterStr = thirtyDaysLater.toISOString().split('T')[0];
    
    let query = supabase
      .from('health_records')
      .select('*')
      .eq('record_type', HealthRecordTypeEnum.Medication)
      .not('expiration_date', 'is', null)
      .gte('expiration_date', today)
      .lte('expiration_date', thirtyDaysLaterStr)
      .order('expiration_date', { ascending: true });
      
    // If dogId is provided, filter by that dog
    if (dogId) {
      query = query.eq('dog_id', dogId);
    }
    
    const { data, error } = await query;
      
    if (error) throw error;
    
    return data as HealthRecord[];
  } catch (error) {
    console.error('Error fetching expiring medications:', error);
    return [];
  }
};

// Function to get upcoming vaccinations
export const getUpcomingVaccinations = async (dogId?: string): Promise<HealthRecord[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const ninetyDaysLater = new Date();
    ninetyDaysLater.setDate(ninetyDaysLater.getDate() + 90);
    const ninetyDaysLaterStr = ninetyDaysLater.toISOString().split('T')[0];
    
    let query = supabase
      .from('health_records')
      .select('*')
      .eq('record_type', HealthRecordTypeEnum.Vaccination)
      .gte('next_due_date', today)
      .lte('next_due_date', ninetyDaysLaterStr)
      .order('next_due_date', { ascending: true });
      
    // If dogId is provided, filter by that dog
    if (dogId) {
      query = query.eq('dog_id', dogId);
    }
    
    const { data, error } = await query;
      
    if (error) throw error;
    
    return data as HealthRecord[];
  } catch (error) {
    console.error('Error fetching upcoming vaccinations:', error);
    return [];
  }
};

export const addHealthRecord = async (record: Partial<HealthRecord>): Promise<HealthRecord> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .insert(record)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as HealthRecord;
  } catch (error) {
    console.error('Error adding health record:', error);
    throw new Error('Failed to add health record');
  }
};

export const updateHealthRecord = async (id: string, record: Partial<HealthRecord>): Promise<HealthRecord> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .update(record)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as HealthRecord;
  } catch (error) {
    console.error('Error updating health record:', error);
    throw new Error('Failed to update health record');
  }
};

export const deleteHealthRecord = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting health record:', error);
    throw new Error('Failed to delete health record');
  }
};

// Weight record functions
export const getWeightHistory = async (id: string, isPuppy: boolean = false): Promise<WeightRecord[]> => {
  try {
    const field = isPuppy ? 'puppy_id' : 'dog_id';
    
    const { data, error } = await supabase
      .from('weight_records')
      .select('*')
      .eq(field, id)
      .order('date', { ascending: false });
      
    if (error) throw error;
    
    return (data || []).map(record => ({
      ...record,
      unit: record.weight_unit // For compatibility
    })) as WeightRecord[];
  } catch (error) {
    console.error('Error fetching weight history:', error);
    return [];
  }
};

export const addWeightRecord = async (record: Omit<WeightRecord, 'id' | 'created_at'>): Promise<WeightRecord> => {
  try {
    // Make sure we have both weight_unit and unit fields for compatibility
    const recordToInsert = {
      ...record,
      weight_unit: record.weight_unit || record.unit,
      unit: record.unit || record.weight_unit
    };

    const { data, error } = await supabase
      .from('weight_records')
      .insert(recordToInsert)
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      unit: data.weight_unit // For compatibility
    } as WeightRecord;
  } catch (error) {
    console.error('Error adding weight record:', error);
    throw new Error('Failed to add weight record');
  }
};

export const updateWeightRecord = async (id: string, record: Partial<WeightRecord>): Promise<WeightRecord> => {
  try {
    // Make sure we have both weight_unit and unit fields for compatibility
    const recordToUpdate = { ...record };
    if (record.weight_unit && !record.unit) {
      recordToUpdate.unit = record.weight_unit;
    } else if (record.unit && !record.weight_unit) {
      recordToUpdate.weight_unit = record.unit;
    }

    const { data, error } = await supabase
      .from('weight_records')
      .update(recordToUpdate)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      unit: data.weight_unit // For compatibility
    } as WeightRecord;
  } catch (error) {
    console.error('Error updating weight record:', error);
    throw new Error('Failed to update weight record');
  }
};

export const deleteWeightRecord = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('weight_records')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting weight record:', error);
    throw new Error('Failed to delete weight record');
  }
};

// Helper function to convert weight between units
export const convertWeight = (weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
  if (fromUnit === toUnit) return weight;
  
  // Convert to grams first as a common unit
  let weightInGrams: number;
  
  switch (fromUnit) {
    case 'g':
      weightInGrams = weight;
      break;
    case 'kg':
      weightInGrams = weight * 1000;
      break;
    case 'oz':
      weightInGrams = weight * 28.3495;
      break;
    case 'lb':
    case 'lbs':
      weightInGrams = weight * 453.592;
      break;
    default:
      return weight;
  }
  
  // Convert from grams to target unit
  switch (toUnit) {
    case 'g':
      return weightInGrams;
    case 'kg':
      return weightInGrams / 1000;
    case 'oz':
      return weightInGrams / 28.3495;
    case 'lb':
    case 'lbs':
      return weightInGrams / 453.592;
    default:
      return weight;
  }
};
