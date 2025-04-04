
// Reproductive cycle-related types

import { Dog } from './dog';

// Heat Cycle Types
export type HeatIntensity = 'mild' | 'moderate' | 'strong';

export const HeatIntensityValues: HeatIntensity[] = ['mild', 'moderate', 'strong'];

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
  created_at: string;
  updated_at?: string;
  recorded_by?: string;
}

// Reproductive status enum
export enum ReproductiveStatus {
  InHeat = 'in_heat',
  Pregnant = 'pregnant',
  Nursing = 'nursing',
  Available = 'available',
  Resting = 'resting',
  TooYoung = 'too_young',
  Retired = 'retired',
  Unknown = 'unknown'
}

// Breeding record types
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
  heat_cycle_id?: string;
}

// Normalize breeding record for display
export const normalizeBreedingRecord = (record: any): BreedingRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id || record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date || record.date,
    method: record.method || record.breeding_method,
    success: record.success ?? record.is_successful ?? false,
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by,
    heat_cycle_id: record.heat_cycle_id
  };
};

// Pregnancy record types
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date?: string;
  due_date?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Heat stage type
export interface HeatStage {
  name: string;
  days: number;
  description: string;
  color: string;
  startDay: number;
  endDay: number;
}

// Reproductive milestone
export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Breeding checklist item
export interface BreedingChecklistItem {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  category: string;
  importance: 'high' | 'medium' | 'low';
}

// Breeding preparation form data
export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  planned_date: string;
  method: string;
  notes?: string;
}

// Combined reproductive cycle data
export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  currentStatus: ReproductiveStatus;
  lastHeatCycle?: HeatCycle;
  lastHeatDate?: string;
  nextHeatPrediction?: string;
  daysUntilNextHeat?: number;
  isInHeat: boolean;
  daysIntoCurrentHeat?: number;
  currentHeatStage?: HeatStage;
  currentPregnancy?: PregnancyRecord;
  lastBreedingRecord?: BreedingRecord;
  daysPregnant?: number;
  gestationDays: number;
}
