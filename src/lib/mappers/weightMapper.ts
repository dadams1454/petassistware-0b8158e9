
import { WeightRecord, WeightUnit } from '@/types/weight';

/**
 * Maps a weight record from Supabase DB format to frontend TypeScript format
 * @param record The database record to map
 * @returns A properly typed WeightRecord object
 */
export function mapWeightRecordFromDB(record: any): WeightRecord {
  // Validate record exists
  if (!record) return null as unknown as WeightRecord;

  // Handle properly typed weight unit
  const weightUnit = record.weight_unit || 'lb';
  const safeWeightUnit = ['oz', 'g', 'lb', 'kg'].includes(weightUnit) 
    ? weightUnit as WeightUnit 
    : 'lb' as WeightUnit;

  return {
    id: record.id || '',
    dog_id: record.dog_id || '',
    puppy_id: record.puppy_id || null,
    weight: typeof record.weight === 'number' ? record.weight : 0,
    weight_unit: safeWeightUnit,
    date: record.date || new Date().toISOString().split('T')[0],
    notes: record.notes || '',
    percent_change: record.percent_change || 0,
    created_at: record.created_at || new Date().toISOString(),
    // Optional fields
    age_days: record.age_days || undefined,
    birth_date: record.birth_date || undefined
  };
}

/**
 * Maps a frontend WeightRecord to Supabase DB format
 * @param record The frontend record to map to DB format
 * @returns An object formatted for Supabase insertion/update
 */
export function mapWeightRecordToDB(record: Partial<WeightRecord>): any {
  return {
    id: record.id,
    dog_id: record.dog_id,
    puppy_id: record.puppy_id,
    weight: record.weight,
    weight_unit: record.weight_unit,
    date: record.date,
    notes: record.notes,
    percent_change: record.percent_change,
    created_at: record.created_at,
    age_days: record.age_days,
    birth_date: record.birth_date
  };
}
