
import { Dog } from '@/types/dog';

export enum ReproductiveStatus {
  InHeat = 'in_heat',
  Pregnant = 'pregnant',
  Nursing = 'nursing',
  Available = 'available',
  Resting = 'resting',
  Planned = 'planned',
  // Additional status values
  PreHeat = 'pre_heat',
  Whelping = 'whelping',
  Recovery = 'recovery',
  Intact = 'intact',
  NotInHeat = 'not_in_heat',
  Altered = 'altered',
  Spayed = 'spayed',
  Neutered = 'neutered'
}

export enum HeatIntensity {
  Mild = 'mild',
  Moderate = 'moderate',
  Strong = 'strong'
}

export type HeatIntensityType = 'mild' | 'moderate' | 'strong';

// For backward compatibility
export const HeatIntensityValues = {
  MILD: 'mild',
  MODERATE: 'moderate',
  STRONG: 'strong'
};

export interface HeatStage {
  name: string;
  description: string;
  duration: [number, number];
  signs: string[];
  color: string;
  id: string;
  icon?: string;
  day?: number;
  fertility?: boolean;
}

export interface PregnancyStage {
  id: string;
  name: string;
  days: [number, number];
  description: string;
  milestones: string[];
  color: string;
}

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_number?: number;
  cycle_length?: number;
  intensity: HeatIntensityType;
  symptoms?: string[];
  fertility_indicators?: any;
  notes?: string;
  created_at: string;
  updated_at?: string;
  recorded_by?: string;
}

export interface BreedingRecord {
  id: string;
  dog_id: string;
  sire_id?: string;
  breeding_date: string;
  method?: string;
  success?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  
  // Additional fields
  tie_date?: string;
  breeding_method?: string;
  is_successful?: boolean;
  estimated_due_date?: string;
  heat_cycle_id?: string;
  
  // Relations
  dam?: Dog;
  sire?: Dog;
}

export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_id?: string;
  confirmation_date: string;
  due_date: string;
  notes?: string;
  ultrasound_date?: string;
  confirmed_puppy_count?: number;
  created_at: string;
  created_by?: string;
  
  // Additional fields
  estimated_whelp_date?: string;
  actual_whelp_date?: string;
  puppies_born?: number;
  puppies_alive?: number;
  status?: string;
  outcome?: string;
  breeding_record_id?: string;
  
  // Relations
  dog?: Dog;
}

export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export interface BreedingChecklistItem {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  due_date?: string;
  completion_date?: string;
  task?: string;
}

export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  
  // Calculated properties
  averageCycleLength: number;
  currentStatus: ReproductiveStatus;
  currentHeatCycle?: HeatCycle;
  currentHeatStage?: HeatStage;
  lastHeatDate?: string;
  nextEstimatedHeatDate?: string;
  daysUntilNextHeat?: number;
  
  // Pregnancy data
  currentPregnancy?: PregnancyRecord;
  pregnancyDay?: number;
  currentPregnancyStage?: PregnancyStage;
  estimatedDueDate?: string;
  daysUntilDue?: number;
  gestationDays?: number;
  
  // Checklists
  breedingChecklist?: BreedingChecklistItem[];
  heatStages: HeatStage[];
  
  // Additional fields for compatibility
  status?: ReproductiveStatus;
  nextHeatDate?: string;
  fertilityWindow?: [Date, Date];
}

export interface HeatCycleInput {
  dog_id: string;
  start_date: string;
  end_date?: string;
  intensity: HeatIntensityType;
  notes?: string;
}

export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  breeding_date: string;
  tie_date?: string;
  breeding_method?: string;
  is_successful?: boolean;
  notes?: string;
}

// Utility to normalize breeding records for consistent use across the app
export const normalizeBreedingRecord = (record: any): BreedingRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id || record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date || record.date,
    method: record.method || record.breeding_method,
    success: record.success !== undefined ? record.success : record.is_successful,
    notes: record.notes,
    created_at: record.created_at || new Date().toISOString(),
    created_by: record.created_by,
    tie_date: record.tie_date,
    breeding_method: record.breeding_method,
    is_successful: record.is_successful !== undefined ? record.is_successful : record.success,
    estimated_due_date: record.estimated_due_date,
    heat_cycle_id: record.heat_cycle_id,
    dam: record.dam,
    sire: record.sire
  };
};
