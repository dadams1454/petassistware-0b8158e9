
import { supabase } from '@/integrations/supabase/client';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';
import { standardizeWeightUnit, WeightUnit } from '@/types/common';

// Type for weight records data
export interface PuppyWeightRecord {
  id?: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  age_days?: number;
  notes?: string;
  created_at?: string;
}

/**
 * Fetch weight records for a puppy
 */
export const fetchPuppyWeightRecords = async (puppyId: string) => {
  try {
    // Try the new puppy_weights table first
    let { data: puppyWeights, error } = await supabase
      .from('puppy_weights')
      .select('*')
      .eq('puppy_id', puppyId)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching puppy weights from puppy_weights table:', error);
      // Fall back to weight_records if needed
      const { data: weightRecords, error: weightError } = await supabase
        .from('weight_records')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('date', { ascending: true });

      if (weightError) {
        console.error('Error fetching from weight_records as fallback:', weightError);
        return [];
      }

      return weightRecords || [];
    }

    return puppyWeights || [];
  } catch (error) {
    console.error('Exception in fetchPuppyWeightRecords:', error);
    return [];
  }
};

/**
 * Add a new weight record for a puppy
 */
export const addPuppyWeightRecord = async (record: PuppyWeightRecord) => {
  try {
    // Make sure the weight_unit is standardized
    const standardizedRecord = {
      ...record,
      weight_unit: standardizeWeightUnit(record.weight_unit)
    };

    // Try to insert into the new puppy_weights table
    const { data, error } = await supabase
      .from('puppy_weights')
      .insert(standardizedRecord)
      .select()
      .single();

    if (error) {
      console.error('Error adding puppy weight to puppy_weights:', error);
      
      // Fall back to weight_records table
      const weightRecordData = {
        ...standardizedRecord,
        dog_id: record.puppy_id, // Required for weight_records table
        unit: standardizedRecord.weight_unit // For compatibility
      };
      
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('weight_records')
        .insert(weightRecordData)
        .select()
        .single();
        
      if (fallbackError) {
        console.error('Error adding to weight_records as fallback:', fallbackError);
        return null;
      }
      
      return fallbackData;
    }

    return data;
  } catch (error) {
    console.error('Exception in addPuppyWeightRecord:', error);
    return null;
  }
};

/**
 * Calculate age in days based on birth date
 */
export const calculateAgeDays = (birthDate: string, weightDate: string): number => {
  if (!birthDate || !weightDate) return 0;
  
  const birth = new Date(birthDate);
  const weightD = new Date(weightDate);
  
  // Calculate difference in milliseconds and convert to days
  const diffTime = Math.abs(weightD.getTime() - birth.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};
