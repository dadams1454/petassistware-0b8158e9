
import { WeightRecord } from '@/types/weight';
import { standardizeWeightUnit } from '@/types/weight-units';

/**
 * Maps a weight record from the database format to the application format
 */
export const mapWeightRecordFromDB = (record: any): WeightRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id || null,
    puppy_id: record.puppy_id || null,
    weight: Number(record.weight),
    weight_unit: standardizeWeightUnit(record.weight_unit),
    date: record.date,
    notes: record.notes || '',
    percent_change: record.percent_change || null,
    age_days: record.age_days || null,
    birth_date: record.birth_date || null,
    created_at: record.created_at
  };
};

/**
 * Maps a weight record from the application format to the database format
 */
export const mapWeightRecordToDB = (record: Partial<WeightRecord>): any => {
  const mapped: any = {
    ...record
  };

  // Handle the case where the weight record uses 'unit' instead of 'weight_unit'
  if (!mapped.weight_unit && record.unit) {
    mapped.weight_unit = standardizeWeightUnit(record.unit);
    delete mapped.unit;
  }

  return mapped;
};
