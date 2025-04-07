
import { WeightRecord } from '@/types';
import { WeightUnit } from '@/types/weight-units';

/**
 * Maps a weight record from Supabase DB format to frontend TypeScript format
 */
export function mapWeightRecordFromDB(record: any): WeightRecord {
  if (!record) return null as unknown as WeightRecord;

  // Ensure weight unit is a valid WeightUnit value
  let weightUnit: WeightUnit = record.weight_unit as WeightUnit;
  if (!['g', 'kg', 'oz', 'lb'].includes(weightUnit)) {
    weightUnit = 'g'; // Default to grams if invalid
  }

  return {
    id: record.id || '',
    dog_id: record.dog_id || '',
    puppy_id: record.puppy_id || '',
    weight: Number(record.weight) || 0,
    weight_unit: weightUnit,
    date: record.date || new Date().toISOString().split('T')[0],
    notes: record.notes || '',
    percent_change: record.percent_change !== null ? Number(record.percent_change) : undefined,
    created_at: record.created_at || new Date().toISOString(),
    age_days: record.age_days ? Number(record.age_days) : undefined,
    birth_date: record.birth_date || undefined
  };
}

/**
 * Maps a weight record from frontend TypeScript format to Supabase DB format
 */
export function mapWeightRecordToDB(record: Partial<WeightRecord>): any {
  const dbRecord: any = { ...record };
  
  // Remove any fields that shouldn't be sent to the database
  if (dbRecord.id === '') {
    delete dbRecord.id;
  }
  
  if (dbRecord.created_at === '') {
    delete dbRecord.created_at;
  }
  
  return dbRecord;
}
