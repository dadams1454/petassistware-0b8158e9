
import { Dog } from './dog';

// Type for heat intensity values
export type HeatIntensityType = 'light' | 'moderate' | 'heavy' | 'unknown';

// Heat intensity values
export const HeatIntensityValues: HeatIntensityType[] = ['light', 'moderate', 'heavy', 'unknown'];

// Heat intensity enum for backward compatibility
export enum HeatIntensity {
  LIGHT = 'light',
  MODERATE = 'moderate',
  HEAVY = 'heavy',
  UNKNOWN = 'unknown'
}

// Heat cycle interface
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  intensity?: HeatIntensityType;
  symptoms?: string[];
  notes?: string;
  cycle_number?: number;
  cycle_length?: number;
  fertility_indicators?: any;
  created_at: string;
  updated_at?: string;
  recorded_by?: string;
}

// Heat stage interface
export interface HeatStage {
  id: string;
  name: string;
  description: string;
  day: number;
  fertility: string;
  fertilityLevel: number;
  color: string;
  length: number;
}

// Reproductive status enum
export enum ReproductiveStatus {
  InHeat = 'in_heat',
  Pregnant = 'pregnant',
  Whelping = 'whelping',
  Nursing = 'nursing',
  Available = 'available',
  Resting = 'resting',
  TooYoung = 'too_young',
  TooOld = 'too_old',
  Spayed = 'spayed'
}

// Breeding record interface
export interface BreedingRecord {
  id: string;
  dam_id?: string;
  dog_id?: string;
  sire_id?: string;
  breeding_date: string;
  tie_date?: string;
  method?: string;
  breeding_method?: string;
  success?: boolean;
  is_successful?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  heat_cycle_id?: string;
  estimated_due_date?: string;
  dam?: Dog;
  sire?: Dog;
}

// Pregnancy record interface
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date?: string;
  due_date?: string;
  status: 'pending' | 'confirmed' | 'lost' | 'delivered';
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Reproductive milestone interface
export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Reproductive cycle data interface
export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  
  // Calculated statuses
  currentStatus: ReproductiveStatus;
  isInHeat: boolean;
  isPregnant: boolean;
  pregnancyConfirmed: boolean;
  pregnancyLost: boolean;
  
  // Heat cycle data
  lastHeatDate?: Date;
  nextHeatDate?: Date | null;
  currentHeatCycle?: HeatCycle | null;
  daysInHeat?: number | null;
  heatStages?: HeatStage[];
  currentHeatStage?: HeatStage | null;
  isInFertileWindow?: boolean;
  fertilePeriod?: { start: Date; end: Date } | null;
  
  // Pregnancy data
  currentPregnancy?: PregnancyRecord | null;
  gestationDays?: number | null;
  estimatedDueDate?: Date | null;
  weightBeforePregnancy?: number | null;
  currentBreedingRecord?: BreedingRecord | null;
  
  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: any;
}

// Breeding checklist item
export interface BreedingChecklistItem {
  id: string;
  title: string;
  task: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

// Breeding preparation form data
export interface BreedingPrepFormData {
  damId: string;
  sireId: string;
  breedingMethod: string;
  breedingDate: Date;
  notes: string;
}

// Helper function to normalize breeding record format
export const normalizeBreedingRecord = (record: any): BreedingRecord => {
  return {
    id: record.id,
    dam_id: record.dam_id || record.dog_id,
    dog_id: record.dog_id || record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date,
    tie_date: record.tie_date,
    method: record.method || record.breeding_method,
    breeding_method: record.breeding_method || record.method,
    success: record.success !== undefined ? record.success : record.is_successful,
    is_successful: record.is_successful !== undefined ? record.is_successful : record.success,
    notes: record.notes || '',
    created_at: record.created_at || new Date().toISOString(),
    created_by: record.created_by || null,
    heat_cycle_id: record.heat_cycle_id || null,
    estimated_due_date: record.estimated_due_date || null,
    dam: record.dam || null,
    sire: record.sire || null
  };
};
