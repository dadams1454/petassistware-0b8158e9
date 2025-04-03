
// Reproductive Status and Types

/**
 * Enum representing the reproductive status of a dog
 * @description Used to track heat cycles, pregnancy, and other reproductive states
 */
export enum ReproductiveStatus {
  InHeat = 'in_heat',
  NotInHeat = 'not_in_heat',
  Pregnant = 'pregnant',
  Nursing = 'nursing',
  Resting = 'resting',
  Cycling = 'cycling',
  Altered = 'altered',
  Unknown = 'unknown'
}

// Compatibility constants for older code
export const IN_HEAT = ReproductiveStatus.InHeat;
export const NOT_IN_HEAT = ReproductiveStatus.NotInHeat;
export const PREGNANT = ReproductiveStatus.Pregnant;
export const NURSING = ReproductiveStatus.Nursing;
export const RESTING = ReproductiveStatus.Resting;

/**
 * Interface for heat cycle data
 * @description Records the start, end, and details of a dog's heat cycle
 */
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string | null;
  cycle_length?: number | null;
  cycle_number?: number | null;
  intensity?: HeatIntensity | null;
  symptoms?: string[] | null;
  fertility_indicators?: any;
  notes?: string | null;
  recorded_by?: string | null;
  created_at: string;
  updated_at?: string | null;
}

/**
 * Type for heat intensity levels
 */
export type HeatIntensity = 'mild' | 'moderate' | 'strong';

/**
 * Interface for breeding record data
 * @description Records details of a breeding attempt
 */
export interface BreedingRecord {
  id: string;
  // Support both new and old schema
  dam_id: string;
  sire_id?: string | null;
  dog_id?: string | null; // For compatibility with DB
  breeding_date: string;
  tie_date?: string | null;
  method?: string | null;
  breeding_method?: string | null; // For compatibility
  success?: boolean | null;
  is_successful?: boolean | null; // For compatibility
  notes?: string | null;
  created_at: string;
  created_by?: string | null;
  // Additional fields
  heat_cycle_id?: string;
  expected_due_date?: string;
  estimated_due_date?: string;
  status?: string;
  sire?: any; // For relationship data
  dam?: any; // For relationship data
}

/**
 * Utility to normalize BreedingRecord between old and new schema
 */
export const normalizeBreedingRecord = (record: Partial<BreedingRecord>): BreedingRecord => {
  return {
    id: record.id || '',
    dam_id: record.dam_id || record.dog_id || '',
    sire_id: record.sire_id || null,
    breeding_date: record.breeding_date || new Date().toISOString().split('T')[0],
    tie_date: record.tie_date || null,
    method: record.method || record.breeding_method || null,
    breeding_method: record.breeding_method || record.method || null,
    success: record.success || record.is_successful || null,
    is_successful: record.is_successful || record.success || null,
    notes: record.notes || null,
    created_at: record.created_at || new Date().toISOString(),
    created_by: record.created_by || null,
    // Additional fields with defaults
    heat_cycle_id: record.heat_cycle_id || undefined,
    expected_due_date: record.expected_due_date || record.estimated_due_date || undefined,
    estimated_due_date: record.estimated_due_date || record.expected_due_date || undefined,
    status: record.status || undefined,
    sire: record.sire || undefined,
    dam: record.dam || undefined
  };
};

/**
 * Interface for pregnancy record data
 */
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string | null;
  status: string;
  confirmation_date?: string | null;
  confirmed_date?: string | null; // For compatibility
  due_date?: string | null;
  notes?: string | null;
  created_at: string;
  created_by?: string | null;
  // Add fields found in error messages
  estimated_whelp_date?: string;
  actual_whelp_date?: string;
  puppies_born?: number;
  puppies_alive?: number;
  outcome?: string;
}

/**
 * Interface for reproductive milestone data
 */
export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  date: string;
  milestone_date?: string; // For compatibility
  description?: string;
  notes?: string | null;
  created_at: string;
  created_by?: string | null;
}

/**
 * Interface for whelping log entries
 */
export interface WelpingLog {
  id: string;
  litter_id: string;
  event_type: string;
  timestamp: string;
  puppy_id?: string;
  notes?: string;
  puppy_details?: any;
  created_at: string;
}

/**
 * Interface for whelping observations
 */
export interface WelpingObservation {
  id: string;
  welping_record_id: string;
  observation_type: string;
  observation_time: string;
  puppy_id?: string;
  description: string;
  action_taken?: string;
  created_at: string;
}

// Export all types
export type {
  HeatCycle,
  HeatIntensity,
  BreedingRecord,
  PregnancyRecord,
  ReproductiveMilestone,
  WelpingLog,
  WelpingObservation
};
