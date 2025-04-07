
import { WeightRecord } from '@/types/weight';
import { standardizeWeightUnit } from '@/types/weight-units';

/**
 * Maps a weight record from the database format to the application format
 */
export const mapWeightRecordFromDB = (record: any): WeightRecord => {
  if (!record) return null;
  
  return {
    id: record.id,
    dog_id: record.dog_id || null,
    puppy_id: record.puppy_id || null,
    weight: Number(record.weight),
    weight_unit: standardizeWeightUnit(record.weight_unit),
    date: record.date,
    notes: record.notes || '',
    percent_change: record.percent_change !== null ? Number(record.percent_change) : null,
    age_days: record.age_days !== null ? Number(record.age_days) : null,
    birth_date: record.birth_date || null,
    created_at: record.created_at
  };
};

/**
 * Maps a weight record from the application format to the database format
 */
export const mapWeightRecordToDB = (record: Partial<WeightRecord>): any => {
  const mapped: any = { ...record };

  // Ensure weight_unit is set correctly
  // Handle the case where the weight record uses 'unit' instead of 'weight_unit'
  if (!mapped.weight_unit && mapped.unit) {
    mapped.weight_unit = standardizeWeightUnit(mapped.unit);
    delete mapped.unit;
  }
  
  // Make sure we have weight_unit standardized
  if (mapped.weight_unit) {
    mapped.weight_unit = standardizeWeightUnit(mapped.weight_unit);
  }

  // Convert percent_change to a number if it's a string
  if (mapped.percent_change !== undefined && mapped.percent_change !== null) {
    mapped.percent_change = Number(mapped.percent_change);
  }

  // Convert age_days to a number if it's a string
  if (mapped.age_days !== undefined && mapped.age_days !== null) {
    mapped.age_days = Number(mapped.age_days);
  }

  return mapped;
};
