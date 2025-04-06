
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '@/types/weight';
import { differenceInDays } from 'date-fns';
import { mapWeightRecordFromDB, mapWeightRecordToDB } from '@/lib/mappers/weightMapper';

// Get weight records for a puppy
export const getPuppyWeightRecords = async (puppyId: string): Promise<WeightRecord[]> => {
  if (!puppyId) return [];

  const { data, error } = await supabase
    .from('weight_records')
    .select('*')
    .eq('puppy_id', puppyId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching puppy weight records:', error);
    throw error;
  }

  return (data || []).map(record => mapWeightRecordFromDB(record));
};

// Add a weight record for a puppy
export const addPuppyWeightRecord = async (
  puppyId: string,
  weight: number,
  weightUnit: string,
  date: string,
  notes?: string,
  birthDate?: string
): Promise<WeightRecord> => {
  // Calculate age in days if birth date is provided
  let ageDays: number | undefined;
  if (birthDate) {
    ageDays = differenceInDays(new Date(date), new Date(birthDate));
  }

  const record: Partial<WeightRecord> = {
    puppy_id: puppyId,
    weight: weight,
    weight_unit: weightUnit as any,
    date: date,
    notes: notes || '',
    age_days: ageDays,
    birth_date: birthDate
  };

  const dbRecord = mapWeightRecordToDB(record);

  const { data, error } = await supabase
    .from('weight_records')
    .insert(dbRecord)
    .select()
    .single();

  if (error) {
    console.error('Error adding puppy weight record:', error);
    throw error;
  }

  // Also update the current_weight field on the puppy
  try {
    await supabase
      .from('puppies')
      .update({
        current_weight: weight.toString(),
        weight_unit: weightUnit
      })
      .eq('id', puppyId);
  } catch (updateError) {
    console.warn('Failed to update puppy current weight:', updateError);
    // Don't throw, as the weight record was already added successfully
  }

  return mapWeightRecordFromDB(data);
};

// Update a weight record
export const updatePuppyWeightRecord = async (
  id: string,
  updates: Partial<WeightRecord>
): Promise<WeightRecord> => {
  const dbUpdates = mapWeightRecordToDB(updates);

  const { data, error } = await supabase
    .from('weight_records')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating puppy weight record:', error);
    throw error;
  }

  // If this is the most recent weight, update the puppy's current_weight
  if (updates.puppy_id && updates.weight) {
    try {
      // Get all weights for this puppy
      const { data: allWeights } = await supabase
        .from('weight_records')
        .select('*')
        .eq('puppy_id', updates.puppy_id)
        .order('date', { ascending: false });
      
      // If this is the most recent weight, update the puppy record
      if (allWeights && allWeights.length > 0 && allWeights[0].id === id) {
        await supabase
          .from('puppies')
          .update({
            current_weight: updates.weight.toString(),
            weight_unit: updates.weight_unit
          })
          .eq('id', updates.puppy_id);
      }
    } catch (updateError) {
      console.warn('Failed to update puppy current weight:', updateError);
      // Don't throw, as the weight record was already updated successfully
    }
  }

  return mapWeightRecordFromDB(data);
};

// Delete a weight record
export const deletePuppyWeightRecord = async (id: string): Promise<void> => {
  // First get the record to know which puppy it belongs to
  const { data: record, error: fetchError } = await supabase
    .from('weight_records')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching weight record for deletion:', fetchError);
    throw fetchError;
  }

  // Delete the record
  const { error } = await supabase
    .from('weight_records')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting weight record:', error);
    throw error;
  }

  // If this was the most recent weight, update the puppy's current_weight to the next most recent weight
  if (record.puppy_id) {
    try {
      // Get all remaining weights for this puppy
      const { data: remainingWeights } = await supabase
        .from('weight_records')
        .select('*')
        .eq('puppy_id', record.puppy_id)
        .order('date', { ascending: false });
      
      if (remainingWeights && remainingWeights.length > 0) {
        // Update to the most recent weight
        await supabase
          .from('puppies')
          .update({
            current_weight: remainingWeights[0].weight.toString(),
            weight_unit: remainingWeights[0].weight_unit
          })
          .eq('id', record.puppy_id);
      } else {
        // No weights left, clear the current_weight
        await supabase
          .from('puppies')
          .update({
            current_weight: null,
            weight_unit: null
          })
          .eq('id', record.puppy_id);
      }
    } catch (updateError) {
      console.warn('Failed to update puppy current weight after deletion:', updateError);
      // Don't throw, as the weight record was already deleted successfully
    }
  }
};

// Calculate growth rate between two weights
export const calculateGrowthRate = (
  oldWeight: number,
  newWeight: number
): { absoluteChange: number; percentageChange: number } => {
  const absoluteChange = newWeight - oldWeight;
  const percentageChange = oldWeight > 0 ? (absoluteChange / oldWeight) * 100 : 0;
  
  return {
    absoluteChange: parseFloat(absoluteChange.toFixed(2)),
    percentageChange: parseFloat(percentageChange.toFixed(2))
  };
};

// Convert weight from one unit to another
export const convertWeight = (weight: number, fromUnit: string, toUnit: string): number => {
  // Convert to grams first
  let weightInGrams = weight;
  
  if (fromUnit === 'oz') {
    weightInGrams = weight * 28.35;
  } else if (fromUnit === 'lb') {
    weightInGrams = weight * 453.59;
  } else if (fromUnit === 'kg') {
    weightInGrams = weight * 1000;
  }
  
  // Convert from grams to target unit
  if (toUnit === 'g') {
    return parseFloat(weightInGrams.toFixed(2));
  } else if (toUnit === 'oz') {
    return parseFloat((weightInGrams / 28.35).toFixed(2));
  } else if (toUnit === 'lb') {
    return parseFloat((weightInGrams / 453.59).toFixed(2));
  } else if (toUnit === 'kg') {
    return parseFloat((weightInGrams / 1000).toFixed(2));
  }
  
  // Default case, return original weight
  return weight;
};
