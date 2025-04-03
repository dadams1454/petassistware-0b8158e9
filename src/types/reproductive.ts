
// Reproductive types and enums

// Heat cycle intensity enum
export enum HeatIntensity {
  Mild = 'mild',
  Moderate = 'moderate',
  Strong = 'strong',
  Unknown = 'unknown'
}

// Heat cycle interface
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_number?: number;
  cycle_length?: number;
  intensity: HeatIntensity;
  symptoms?: string[];
  fertility_indicators?: any;
  notes?: string;
  recorded_by?: string;
  created_at?: string;
  updated_at?: string;
}

// Reproductive status enum
export enum ReproductiveStatus {
  InHeat = 'in_heat',
  NotInHeat = 'not_in_heat',
  Pregnant = 'pregnant',
  Nursing = 'nursing',
  Resting = 'resting',
  Intact = 'intact'
}

// Legacy status constants for compatibility
export const IN_HEAT = ReproductiveStatus.InHeat;
export const NOT_IN_HEAT = ReproductiveStatus.NotInHeat;
export const PREGNANT = ReproductiveStatus.Pregnant;
export const NURSING = ReproductiveStatus.Nursing;
export const RESTING = ReproductiveStatus.Resting;

// Breeding record interface
export interface BreedingRecord {
  id: string;
  dog_id: string;
  sire_id?: string;
  breeding_date: string;
  method?: string;
  success?: boolean;
  notes?: string;
  created_by?: string;
  created_at?: string;
}

// Helper to normalize breeding record data from various sources
export const normalizeBreedingRecord = (data: any): BreedingRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id || data.dam_id,
    sire_id: data.sire_id,
    breeding_date: data.breeding_date || data.date,
    method: data.method || data.breeding_method,
    success: data.success || data.is_successful,
    notes: data.notes,
    created_by: data.created_by,
    created_at: data.created_at
  };
};

// Pregnancy record interface
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date?: string;
  due_date?: string;
  status: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
}

// Reproductive milestone interface
export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
}

// Whelping related interfaces
export interface WelpingLog {
  id: string;
  litter_id: string;
  puppy_id?: string;
  event_type: string;
  timestamp: string;
  notes?: string;
  puppy_details?: any;
  created_at?: string;
}

export interface WelpingObservation {
  id: string;
  welping_record_id: string;
  puppy_id?: string;
  observation_type: string;
  observation_time: string;
  description: string;
  action_taken?: string;
  created_at?: string;
}
