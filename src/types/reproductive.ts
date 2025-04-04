
import { Dog } from './dog';

export enum ReproductiveStatus {
  Intact = 'intact',
  InHeat = 'in_heat',
  Pregnant = 'pregnant',
  Nursing = 'nursing',
  Spayed = 'spayed',
  Neutered = 'neutered',
  PreHeat = 'pre_heat',
  Whelping = 'whelping',
  Recovery = 'recovery',
  NotInHeat = 'not_in_heat',
  Altered = 'altered'
}

export enum HeatIntensity {
  None = 'none',
  Low = 'low',
  Moderate = 'moderate',
  Medium = 'medium',
  High = 'high',
  Peak = 'peak',
  Unknown = 'unknown'
}

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_length?: number;
  intensity: HeatIntensity;
  cycle_number?: number;
  symptoms?: string[];
  notes?: string;
  fertility_indicators?: any;
  created_at?: string;
  updated_at?: string;
  recorded_by?: string;
}

export interface HeatStage {
  id: string;
  name: string;
  description: string;
  day: number;
  fertility: HeatIntensity;
  color: string;
  length: number;
  duration: number;
  index: number;
}

export interface BreedingRecord {
  id: string;
  dog_id: string;
  dam_id?: string;
  sire_id?: string;
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
  heat_cycle_id?: string;
  estimated_due_date?: string;
}

export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'terminated';
  confirmation_date?: string;
  due_date?: string;
  estimated_whelp_date?: string;
  actual_whelp_date?: string;
  puppies_born?: number;
  puppies_alive?: number;
  outcome?: string;
  notes?: string;
  created_at?: string;
  created_by?: string;
}

export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  date?: string; // For form handling
  notes?: string;
  created_at?: string;
  created_by?: string;
}

export interface ReproductiveCycleData {
  dog: Dog;
  status: ReproductiveStatus;
  heatCycles: HeatCycle[];
  currentHeatCycle?: HeatCycle;
  lastHeatCycle?: HeatCycle;
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  nextEstimatedHeatDate?: string;
  daysUntilNextHeat?: number;
  isInHeat: boolean;
  isPregnant: boolean;
  isNursing: boolean;
  gestationDays: number;
  dueDate?: string;
  currentHeatStage?: HeatStage;
  heatStages: HeatStage[];
  currentHeatDay?: number;
  isLactating: boolean;
  nextMilestone?: ReproductiveMilestone;
  timeInGestation?: string;
  nextHeatDate?: string;
  averageCycleLength?: number;
  fertilityWindow?: { start: string; end: string };
  estimatedDueDate?: string;
}

export type BreedingChecklistItem = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  category: string;
  task?: string;
};

export type BreedingPrepFormData = {
  dam_id: string;
  sire_id: string;
  planned_date?: string;
  notes?: string;
  method?: string;
};

export const normalizeBreedingRecord = (record: any): BreedingRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    dam_id: record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date,
    tie_date: record.tie_date,
    method: record.method || record.breeding_method,
    breeding_method: record.breeding_method || record.method,
    success: record.success || record.is_successful,
    is_successful: record.is_successful || record.success,
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by,
    sire: record.sire,
    heat_cycle_id: record.heat_cycle_id,
    estimated_due_date: record.estimated_due_date
  };
};
