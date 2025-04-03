
// Define the types used for reproductive status tracking

// Reproductive status options
export enum ReproductiveStatus {
  InHeat = 'in_heat',
  NotInHeat = 'not_in_heat',
  Pregnant = 'pregnant',
  Nursing = 'nursing',
  Altered = 'altered',
  // Add missing enum values that are used
  Whelping = 'whelping',
  Recovery = 'recovery',
  PreHeat = 'pre_heat'
}

// Legacy constants for backward compatibility
export const IN_HEAT = ReproductiveStatus.InHeat;
export const NOT_IN_HEAT = ReproductiveStatus.NotInHeat;
export const PREGNANT = ReproductiveStatus.Pregnant;
export const NURSING = ReproductiveStatus.Nursing;
export const RESTING = 'resting'; // Maintained for legacy code

// Heat cycle intensity options
export type HeatIntensity = 'mild' | 'moderate' | 'strong';

// Heat cycle record
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string | null;
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

// Heat stage information
export interface HeatStage {
  id: string;
  day: number;
  name: string;
  description: string;
  fertility: string;
  color: string;
  length: number;
}

// Breeding record
export interface BreedingRecord {
  id: string;
  dog_id: string;
  sire_id?: string;
  breeding_date: string;
  tie_date?: string;
  method?: string;
  success?: boolean;
  notes?: string;
  created_at?: string;
  created_by?: string;
  heat_cycle_id?: string;
  sire?: Dog;
  breeding_method?: string;
  is_successful?: boolean;
  estimated_due_date?: string;
}

// Normalize breeding record for consistent use in the application
export const normalizeBreedingRecord = (record: any): BreedingRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id || record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date || record.tie_date,
    tie_date: record.tie_date,
    method: record.method || record.breeding_method,
    success: record.success !== undefined ? record.success : record.is_successful,
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by,
    heat_cycle_id: record.heat_cycle_id,
    breeding_method: record.breeding_method || record.method,
    is_successful: record.is_successful !== undefined ? record.is_successful : record.success,
    estimated_due_date: record.estimated_due_date
  };
};

// Pregnancy record
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date?: string;
  due_date?: string;
  status: string; // 'confirmed', 'suspected', 'completed', 'terminated'
  notes?: string;
  created_at?: string;
  created_by?: string;
  estimated_whelp_date?: string;
  actual_whelp_date?: string;
  puppies_born?: number;
  puppies_alive?: number;
  outcome?: string;
}

// Reproductive milestone
export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at?: string;
  created_by?: string;
}

// Welping log
export interface WelpingLog {
  id: string;
  litter_id: string;
  event_type: string;
  timestamp: string;
  notes?: string;
  puppy_id?: string;
  puppy_details?: any;
  created_at?: string;
}

// Welping observation
export interface WelpingObservation {
  id: string;
  welping_record_id: string;
  observation_type: string;
  observation_time: string;
  description: string;
  action_taken?: string;
  puppy_id?: string;
  created_at?: string;
}

// Dog type definition needed for breeding/reproductive functionality
export interface Dog {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  breed?: string;
  color?: string;
  birthdate?: string;
  registration_number?: string;
  microchip_number?: string;
  weight?: number;
  photo_url?: string;
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  created_at?: string;
  owner_id?: string;
  litter_number?: number;
}

// Data for reproductive cycle tracking
export interface ReproductiveCycleData {
  dogId: string;
  currentStatus: ReproductiveStatus | string;
  currentCycle?: HeatCycle;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  lastHeatDate?: string;
  nextHeatDate?: string;
  dueDate?: string;
  averageCycleLength: number;
  daysUntilNextHeat: number;
  daysPostHeat: number;
  gestationDays: number;
  estimatedDueDate?: string;
  fertilityWindow?: { start: number; end: number };
  currentStage?: HeatStage;
  dog?: Dog;
}
