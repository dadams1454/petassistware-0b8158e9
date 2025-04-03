
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, WeightRecord, WeightUnit } from '@/types';
import { format, differenceInDays, parseISO } from 'date-fns';
import { standardizeWeightUnit } from '@/types/common';

/**
 * Get all health records for a dog
 */
export const getHealthRecords = async (dogId: string): Promise<HealthRecord[]> => {
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
};

/**
 * Get a specific health record by ID
 */
export const getHealthRecordById = async (recordId: string): Promise<HealthRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('id', recordId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching health record:', error);
    throw error;
  }
};

/**
 * Add a new health record
 */
export const addHealthRecord = async (record: Omit<HealthRecord, 'id'>): Promise<HealthRecord> => {
  try {
    // Ensure record has all required fields
    if (!record.dog_id) throw new Error('Dog ID is required');
    if (!record.record_type) throw new Error('Record type is required');
    if (!record.visit_date) throw new Error('Visit date is required');
    if (!record.vet_name) throw new Error('Vet name is required');
    
    const { data, error } = await supabase
      .from('health_records')
      .insert(record)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error adding health record:', error);
    throw error;
  }
};

/**
 * Update an existing health record
 */
export const updateHealthRecord = async (id: string, record: Partial<HealthRecord>): Promise<HealthRecord> => {
  try {
    const { data, error } = await supabase
      .from('health_records')
      .update(record)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating health record:', error);
    throw error;
  }
};

/**
 * Delete a health record
 */
export const deleteHealthRecord = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting health record:', error);
    throw error;
  }
};

/**
 * Get all weight records for a dog
 */
export const getWeightHistory = async (dogId: string): Promise<WeightRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('dog_weights')
      .select('*')
      .eq('dog_id', dogId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Ensure weight_unit is a valid WeightUnit type
    return (data || []).map(record => ({
      ...record,
      weight_unit: standardizeWeightUnit(record.weight_unit)
    }));
  } catch (error) {
    console.error('Error fetching weight records:', error);
    throw error;
  }
};

/**
 * Add a new weight record
 */
export const addWeightRecord = async (record: {
  dog_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
}): Promise<WeightRecord> => {
  try {
    // Calculate percent change based on previous weight
    let percentChange: number | undefined = undefined;
    
    // Get previous weight records
    const { data: prevRecords, error: prevError } = await supabase
      .from('dog_weights')
      .select('*')
      .eq('dog_id', record.dog_id)
      .order('date', { ascending: false })
      .limit(1);
    
    if (!prevError && prevRecords && prevRecords.length > 0) {
      const prevRecord = prevRecords[0];
      
      // Ensure weight_unit is standardized
      const standardizedPrevUnit = standardizeWeightUnit(prevRecord.weight_unit);
      const standardizedNewUnit = standardizeWeightUnit(record.weight_unit);
      
      // Calculate percent change only if units can be compared
      if (standardizedPrevUnit && standardizedNewUnit) {
        // Convert weights to same unit for comparison
        const prevWeightInNewUnit = convertWeight(
          prevRecord.weight,
          standardizedPrevUnit,
          standardizedNewUnit
        );
        
        // Calculate percentage change
        percentChange = ((record.weight - prevWeightInNewUnit) / prevWeightInNewUnit) * 100;
      }
    }
    
    // Insert the new weight record with calculated percent change
    const { data, error } = await supabase
      .from('dog_weights')
      .insert({
        ...record,
        percent_change: percentChange,
        weight_unit: standardizeWeightUnit(record.weight_unit)
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error adding weight record:', error);
    throw error;
  }
};

/**
 * Update an existing weight record
 */
export const updateWeightRecord = async (id: string, record: Partial<WeightRecord>): Promise<WeightRecord> => {
  try {
    // Ensure weight_unit is standardized if provided
    const updatedRecord = { 
      ...record,
      weight_unit: record.weight_unit ? standardizeWeightUnit(record.weight_unit) : undefined
    };
    
    const { data, error } = await supabase
      .from('dog_weights')
      .update(updatedRecord)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating weight record:', error);
    throw error;
  }
};

/**
 * Delete a weight record
 */
export const deleteWeightRecord = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('dog_weights')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting weight record:', error);
    throw error;
  }
};

/**
 * Helper function to convert weight between units
 */
export const convertWeight = (
  weight: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number => {
  if (fromUnit === toUnit) {
    return weight;
  }
  
  // Convert to grams first (base unit)
  let weightInGrams = 0;
  
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
      weightInGrams = weight * 453.59237;
      break;
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
      return weightInGrams / 453.59237;
    default:
      return weight;
  }
};
