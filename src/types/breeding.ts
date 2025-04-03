
import { Dog } from './dog';

// Core breeding record type
export interface BreedingRecord {
  id: string;
  dog_id?: string;
  dam_id?: string;
  sire_id: string;
  breeding_date: string;
  tie_date?: string;
  method?: string;
  breeding_method?: string;
  success?: boolean;
  is_successful?: boolean;
  notes?: string;
  created_at?: string;
  created_by?: string;
  sire?: Dog;
}

// Helper function to normalize breeding records
export function normalizeBreedingRecord(record: any): BreedingRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    dam_id: record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date,
    tie_date: record.tie_date,
    method: record.method,
    breeding_method: record.method, // For compatibility
    success: record.success,
    is_successful: record.success, // For compatibility
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by,
    sire: record.sire
  };
}
