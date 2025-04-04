
import { Dog } from './dog';

// Heat cycle interface
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  intensity?: HeatIntensityType;
  symptoms?: string[];
  notes?: string;
  created_at: string;
  updated_at?: string;
  cycle_number?: number;
  cycle_length?: number;
  fertility_indicators?: any;
  recorded_by?: string;
}

// Heat intensity type and enum
export type HeatIntensityType = 'mild' | 'moderate' | 'strong' | 'unknown' | 'medium' | 'high' | 'low' | 'peak';

export enum HeatIntensity {
  Mild = 'mild',
  Moderate = 'moderate',
  Strong = 'strong',
  Unknown = 'unknown',
  Medium = 'medium',
  High = 'high',
  Low = 'low',
  Peak = 'peak'
}

// Heat intensity values for compatibility
export const HeatIntensityValues = {
  mild: 'mild' as HeatIntensityType,
  moderate: 'moderate' as HeatIntensityType,
  strong: 'strong' as HeatIntensityType,
  unknown: 'unknown' as HeatIntensityType,
  low: 'low' as HeatIntensityType,
  medium: 'medium' as HeatIntensityType,
  high: 'high' as HeatIntensityType,
  peak: 'peak' as HeatIntensityType,
  // Also include uppercase versions for backward compatibility
  MILD: 'mild' as HeatIntensityType,
  MODERATE: 'moderate' as HeatIntensityType,
  STRONG: 'strong' as HeatIntensityType,
  UNKNOWN: 'unknown' as HeatIntensityType,
  LOW: 'low' as HeatIntensityType,
  MEDIUM: 'medium' as HeatIntensityType,
  HIGH: 'high' as HeatIntensityType,
  PEAK: 'peak' as HeatIntensityType
};

// Breeding record interface
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
  sire?: Dog;
  dam?: Dog;
  
  // For compatibility
  tie_date?: string;
  breeding_method?: string;
  is_successful?: boolean;
  estimated_due_date?: string;
  heat_cycle_id?: string;
}

// Helper to normalize breeding record
export const normalizeBreedingRecord = (record: any): BreedingRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id || record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date || record.tie_date,
    method: record.method || record.breeding_method,
    success: record.success || record.is_successful,
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by,
    tie_date: record.tie_date,
    breeding_method: record.breeding_method,
    is_successful: record.is_successful,
    estimated_due_date: record.estimated_due_date,
    heat_cycle_id: record.heat_cycle_id
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
  created_at: string;
  created_by?: string;
  
  // For compatibility
  estimated_whelp_date?: string;
  actual_whelp_date?: string;
  puppies_born?: number;
  puppies_alive?: number;
  outcome?: string;
}

// Reproductive status enum
export enum ReproductiveStatus {
  Intact = 'intact',
  Spayed = 'spayed',
  Neutered = 'neutered',
  InHeat = 'in_heat',
  PreHeat = 'pre_heat',
  Pregnant = 'pregnant',
  Breeding = 'breeding',
  NotBreeding = 'not_breeding',
  Whelping = 'whelping',
  Nursing = 'nursing',
  Recovery = 'recovery',
  NotInHeat = 'not_in_heat',
  Altered = 'altered'
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
  
  // For compatibility
  date?: string;
}

// Heat stage interface
export interface HeatStage {
  id: string;
  name: string;
  description: string;
  start_day: number;
  end_day: number;
  fertility_level: 'none' | 'low' | 'medium' | 'high' | 'peak';
  color?: string; // Added for compatibility
  
  // For compatibility
  day?: number;
  fertility?: string;
}

// Reproductive cycle data interface
export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  isInHeat: boolean;
  currentHeatCycle?: HeatCycle;
  lastHeatCycle?: HeatCycle;
  nextHeatDate?: Date;
  lastBreedingRecord?: BreedingRecord;
  currentPregnancy?: PregnancyRecord;
  isPregnant: boolean;
  estimatedDueDate?: Date;
  gestationDays: number;
  currentStatus: string;
  heatCycle?: {
    isInHeat: boolean;
    lastHeatDate?: Date;
    nextHeatDate?: Date;
    currentHeatCycle?: HeatCycle;
    currentHeatStage?: HeatStage;
    dayOfHeat?: number;
    fertileDays?: {
      start: Date;
      end: Date;
    };
  };
  pregnancyConfirmed: boolean;
  pregnancyLost: boolean;
  
  // For compatibility with components
  status?: string;
  daysUntilNextHeat?: number;
  averageCycleLength?: number;
  currentStage?: HeatStage;
  fertilityWindow?: {
    start: Date;
    end: Date;
  };
}

// Breeding checklist item interface
export interface BreedingChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  timeframe?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string; // Added for compatibility
  
  // For compatibility
  task?: string;
}

// Breeding prep form data interface
export interface BreedingPrepFormData {
  damId: string;
  sireId?: string;
  breedingMethod: string;
  plannedBreedingDate?: Date;
  notes?: string;
  
  // For compatibility
  plannedTieDate?: Date;
  plannedDate?: Date;
}
