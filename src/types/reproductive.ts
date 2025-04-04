
import { Dog } from './dog';

// Heat intensity types
export type HeatIntensityType = 'low' | 'mild' | 'medium' | 'moderate' | 'high' | 'strong' | 'peak' | 'unknown';

// Heat intensity enum (for backwards compatibility)
export enum HeatIntensity {
  Low = 'low',
  Mild = 'mild',
  Medium = 'medium',
  Moderate = 'moderate',
  High = 'high',
  Strong = 'strong',
  Peak = 'peak',
  Unknown = 'unknown'
}

// Heat intensity values - a convenient way to reference intensity values
export const HeatIntensityValues = {
  Low: 'low' as HeatIntensityType,
  Mild: 'mild' as HeatIntensityType,
  Medium: 'medium' as HeatIntensityType,
  Moderate: 'moderate' as HeatIntensityType,
  High: 'high' as HeatIntensityType,
  Strong: 'strong' as HeatIntensityType,
  Peak: 'peak' as HeatIntensityType,
  Unknown: 'unknown' as HeatIntensityType
};

// Heat cycle interface
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
  created_at?: string;
  updated_at?: string;
  recorded_by?: string;
}

// Reproductive status types
export type ReproductiveStatusType = 'available' | 'in_heat' | 'pregnant' | 'nursing' | 'inactive' | 'unknown';

// Reproductive status enum
export enum ReproductiveStatus {
  Available = 'available',
  InHeat = 'in_heat',
  Pregnant = 'pregnant', 
  Nursing = 'nursing',
  Inactive = 'inactive',
  Unknown = 'unknown'
}

// Heat stage interface
export interface HeatStage {
  id: string;
  name: string;
  day_start: number;
  day_end: number;
  description: string;
  color?: string;
}

// Breeding method types
export type BreedingMethodType = 'natural' | 'artificial_insemination' | 'surgical_implantation' | 'other';

// Breeding method enum
export enum BreedingMethod {
  Natural = 'natural',
  ArtificialInsemination = 'artificial_insemination',
  SurgicalImplantation = 'surgical_implantation',
  Other = 'other'
}

// Breeding record interface
export interface BreedingRecord {
  id: string;
  dog_id: string;
  dam_id?: string; // For newer schemas
  sire_id?: string;
  breeding_date: string;
  tie_date?: string;
  heat_cycle_id?: string;
  method?: string;
  breeding_method?: string; // For compatibility
  success?: boolean;
  is_successful?: boolean; // For compatibility
  notes?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  dam?: Dog;
  sire?: Dog;
}

// Reproductive milestone type
export type ReproductiveMilestoneType = 
  'heat_start' | 
  'heat_end' | 
  'breeding' | 
  'pregnancy_confirmed' | 
  'whelping_date' | 
  'weaning' | 
  'heat_expected';

// Reproductive milestone interface
export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: ReproductiveMilestoneType;
  milestone_date: string;
  date?: string; // For compatibility
  notes?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

// Breeding checklist item interface
export interface BreedingChecklistItem {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  is_completed: boolean;
  category?: string;
  completion_date?: string;
  notes?: string;
}

// Pregnancy record interface
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date?: string;
  due_date?: string;
  status: 'pending' | 'confirmed' | 'false' | 'whelping' | 'completed' | 'lost';
  notes?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

// Reproductive cycle data interface
export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  status: ReproductiveStatusType;
  nextHeatDate?: Date;
  lastHeatDate?: string;
  lastHeatCycle?: HeatCycle;
  currentHeatCycle?: HeatCycle;
  currentPregnancy?: PregnancyRecord;
  currentBreeding?: BreedingRecord;
  heatStages: HeatStage[];
  currentHeatStage?: HeatStage;
  heatStageDay?: number;
  isInHeat: boolean;
  isPregnant: boolean;
  pregnancyDay?: number;
  dueDate?: string;
  gestationDays: number;
  breedingChecklist: BreedingChecklistItem[];
}

// Normalize breeding record to ensure consistent structure
export function normalizeBreedingRecord(record: any): BreedingRecord {
  return {
    id: record.id,
    dog_id: record.dog_id || record.dam_id,
    dam_id: record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date,
    tie_date: record.tie_date,
    method: record.method || record.breeding_method,
    success: typeof record.success !== 'undefined' ? record.success : record.is_successful,
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by,
    updated_at: record.updated_at,
    updated_by: record.updated_by,
    sire: record.sire,
    dam: record.dam
  };
}
