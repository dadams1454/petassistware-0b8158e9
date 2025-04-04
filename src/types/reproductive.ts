import { Dog } from './dog';

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  intensity: HeatIntensityType;
  symptoms?: string[];
  notes?: string;
  cycle_number?: number;
  cycle_length?: number; 
  fertility_indicators?: any;
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
  dam?: Dog;
  sire?: Dog;
  tie_date?: string;
  breeding_method?: string;
  is_successful?: boolean;
  estimated_due_date?: string;
}

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
  estimated_whelp_date?: string;
  actual_whelp_date?: string;
  puppies_born?: number;
  puppies_alive?: number;
  outcome?: string;
}

export enum ReproductiveStatus {
  InHeat = 'in_heat',
  PreHeat = 'pre_heat',
  Pregnant = 'pregnant',
  Breeding = 'breeding',
  NotActive = 'not_active',
  Whelping = 'whelping',
  Nursing = 'nursing',
  Recovery = 'recovery',
  Intact = 'intact',
  NotInHeat = 'not_in_heat',
  Altered = 'altered',
  Spayed = 'spayed',
  Neutered = 'neutered',
  InWhelp = 'in_whelp',
  Unknown = 'unknown'
}

export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  date?: string;
}

export type HeatIntensityType = 
  | 'light' 
  | 'moderate' 
  | 'heavy' 
  | 'mild' 
  | 'medium' 
  | 'strong' 
  | 'peak' 
  | 'high' 
  | 'low';

export const HeatIntensity = {
  Light: 'light' as HeatIntensityType,
  Moderate: 'moderate' as HeatIntensityType,
  Heavy: 'heavy' as HeatIntensityType,
  Mild: 'mild' as HeatIntensityType,
  Medium: 'medium' as HeatIntensityType,
  Strong: 'strong' as HeatIntensityType,
  High: 'high' as HeatIntensityType,
  Low: 'low' as HeatIntensityType,
  Peak: 'peak' as HeatIntensityType
};

// Export HeatIntensityValues as individual values, not as array for compatibility
export const HeatIntensityValues = {
  light: 'light' as HeatIntensityType,
  moderate: 'moderate' as HeatIntensityType,
  heavy: 'heavy' as HeatIntensityType,
  mild: 'mild' as HeatIntensityType,
  medium: 'medium' as HeatIntensityType,
  strong: 'strong' as HeatIntensityType,
  high: 'high' as HeatIntensityType,
  low: 'low' as HeatIntensityType,
  peak: 'peak' as HeatIntensityType
};

export interface HeatStage {
  name: string;
  length: number; // Duration in days
  description: string;
  fertilityLevel: 'none' | 'low' | 'moderate' | 'high';
  day?: number;
  id?: string;
  fertility?: string;
}

export interface ReproductiveCycleData {
  dog: Dog;
  currentStatus: ReproductiveStatus;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  lastHeatCycle?: HeatCycle;
  nextHeatDate?: Date;
  isInHeat: boolean;
  lastHeatDate?: Date;
  isPregnant: boolean;
  pregnancyConfirmed: boolean;
  pregnancyLost: boolean;
  estimatedDueDate?: Date;
  heatCycle?: {
    isInHeat: boolean;
    lastHeatDate?: Date;
    nextHeatDate?: Date;
    fertileDays?: {
      start: Date;
      end: Date;
    };
    currentStage?: string;
    daysIntoHeat?: number;
    daysUntilHeat?: number;
  };
  fertility?: {
    isFertile: boolean;
    fertileStartDate?: Date;
    fertileEndDate?: Date;
    daysUntilFertile?: number;
    daysLeftInFertileWindow?: number;
  };
  pregnancy?: {
    confirmationDate?: Date;
    dueDate?: Date;
    daysPregnant?: number;
    daysUntilDue?: number;
    trimester?: number;
  };
  gestationDays: number;
  status?: ReproductiveStatus;
  daysUntilNextHeat?: number;
  averageCycleLength?: number;
  currentStage?: HeatStage;
  fertilityWindow?: { start: Date; end: Date };
  currentHeatCycle?: HeatCycle;
}

export interface BreedingChecklistItem {
  id: string;
  task: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  priority: string;
}

export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  breeding_date: string;
  breeding_method: string;
  notes?: string;
  plannedTieDate?: string;
  plannedDate?: string;
  damId?: string;
  sireId?: string;
}

export const normalizeBreedingRecord = (record: any): BreedingRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id || record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date,
    method: record.method || record.breeding_method,
    success: !!record.success || record.is_successful,
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by,
    tie_date: record.tie_date,
    is_successful: record.is_successful,
    breeding_method: record.breeding_method,
    estimated_due_date: record.estimated_due_date
  };
};
