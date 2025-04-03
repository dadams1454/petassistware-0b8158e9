
// Reproductive Status and Types

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

// Heat Cycle interface
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string | null;
  cycle_length?: number | null;
  cycle_number?: number | null;
  intensity?: string | null;
  symptoms?: string[] | null;
  fertility_indicators?: any;
  notes?: string | null;
  recorded_by?: string | null;
  created_at: string;
  updated_at?: string | null;
}

// Heat intensity type
export type HeatIntensity = 'mild' | 'moderate' | 'strong';

// Breeding Record interface
export interface BreedingRecord {
  id: string;
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

// Pregnancy Record interface
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
}

// Reproductive Milestone interface
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

// Whelping log
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

// Whelping observation
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
