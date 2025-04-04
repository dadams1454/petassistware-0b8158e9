
import { Dog } from './dog';

// Heat intensity values
export type HeatIntensity = 'mild' | 'moderate' | 'strong' | 'unknown';
export const HeatIntensityValues: HeatIntensity[] = ['mild', 'moderate', 'strong', 'unknown'];

// Reproductive status
export enum ReproductiveStatus {
  InHeat = 'in_heat',
  Pregnant = 'pregnant',
  Resting = 'resting',
  Spayed = 'spayed',
  Neutered = 'neutered',
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
  created_at?: string;
  updated_at?: string;
  recorded_by?: string;
}

// Breeding record interface
export interface BreedingRecord {
  id: string;
  dog_id?: string;
  dam_id?: string; // For backward compatibility
  sire_id?: string;
  breeding_date: string;
  tie_date?: string;
  heat_cycle_id?: string;
  method?: string;
  breeding_method?: string; // For backward compatibility
  success?: boolean;
  is_successful?: boolean; // For backward compatibility
  notes?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  
  // Relationships
  dam?: Dog;
  sire?: Dog;
}

// Normalize breeding record keys
export const normalizeBreedingRecord = (record: any): BreedingRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id || record.dam_id,
    dam_id: record.dam_id || record.dog_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date,
    tie_date: record.tie_date,
    heat_cycle_id: record.heat_cycle_id,
    method: record.method || record.breeding_method,
    breeding_method: record.breeding_method || record.method,
    success: record.success ?? record.is_successful,
    is_successful: record.is_successful ?? record.success,
    notes: record.notes,
    created_at: record.created_at,
    updated_at: record.updated_at,
    created_by: record.created_by,
    dam: record.dam,
    sire: record.sire
  };
};

// Pregnancy record interface
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmed_date: string;
  expected_due_date: string;
  ultrasound_date?: string;
  puppy_count_estimate?: number;
  notes?: string;
  status: 'active' | 'completed' | 'terminated';
  actual_whelp_date?: string;
  actual_puppy_count?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

// Reproductive milestone
export interface ReproductiveMilestone {
  id?: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  date?: string; // For backward compatibility
  notes?: string;
  created_at?: string;
  created_by?: string;
}

// Heat stages
export interface HeatStage {
  id: string;
  name: string;
  description: string;
  typical_duration: string;
  signs: string[];
  fertility?: 'none' | 'low' | 'medium' | 'high' | 'peak';
  color: string;
}

// Interface for checklist items
export interface BreedingChecklistItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  category: string;
  dueDate?: string;
  order: number;
}

// Interface for form data
export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  estimated_heat_date: string;
  estimated_heat_end: string;
  estimated_breeding_date: string;
  estimated_due_date: string;
  is_artificial: boolean;
  notes: string;
}

// Comprehensive reproductive cycle data
export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  currentStatus: string;
  isInHeat: boolean;
  isPregnant: boolean;
  lastHeatDate?: string;
  nextHeatDate?: string;
  averageCycleLength: number;
  heatCycleCount: number;
  heatStages: HeatStage[];
  currentHeatStage?: HeatStage;
  currentHeatDay?: number;
  currentHeatCycle?: HeatCycle;
  currentPregnancy?: PregnancyRecord;
  dueDate?: string;
  breedingDate?: string;
  sire?: Dog;
  fertility?: string;
  gestationDays?: number;
}

// Re-export Dog for convenience
export { Dog };
