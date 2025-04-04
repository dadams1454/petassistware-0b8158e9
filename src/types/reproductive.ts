
import { AuditFields } from './common';
import { Dog } from './dog';

// Heat intensity as enum
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

// Map to simplified string values for backwards compatibility
export const HeatIntensityValues = [
  'low', 'mild', 'medium', 'moderate', 'high', 'strong', 'peak', 'unknown'
] as const;

// Create a union type for string literals
export type HeatIntensityType = typeof HeatIntensityValues[number];

// Reproductive Status
export enum ReproductiveStatus {
  Unknown = 'unknown',
  Intact = 'intact',
  Spayed = 'spayed',
  Neutered = 'neutered',
  InHeat = 'in_heat',
  PreHeat = 'pre_heat',
  Pregnant = 'pregnant',
  Nursing = 'nursing',
  InDiestrus = 'in_diestrus',
  InAnestrus = 'in_anestrus',
  Recovery = 'recovery',
  Whelping = 'whelping',
  NotInHeat = 'not_in_heat',
  Altered = 'altered'
}

// Heat cycle interface
export interface HeatCycle extends AuditFields {
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
  recorded_by?: string;
}

// Breeding record interface
export interface BreedingRecord extends AuditFields {
  id: string;
  dog_id: string;
  sire_id?: string;
  breeding_date: string;
  method?: string;
  success?: boolean;
  notes?: string;
  dam?: Dog;
  sire?: Dog;
  // Add support for alternative field names for backwards compatibility
  tie_date?: string;
  breeding_method?: string;
  is_successful?: boolean;
  estimated_due_date?: string;
}

// Pregnancy record interface
export interface PregnancyRecord extends AuditFields {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date?: string;
  due_date?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'terminated';
  notes?: string;
  estimated_whelp_date?: string;
  actual_whelp_date?: string;
  puppies_born?: number;
  puppies_alive?: number;
  outcome?: string;
}

// Heat stage interface
export interface HeatStage {
  name: string;
  description: string;
  typical_days: string;
  fertility: string;
  signs: string[];
  actions: string[];
  day?: number;
  id?: string;
}

// Reproductive milestone interface
export interface ReproductiveMilestone extends AuditFields {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  date?: string; // For compatibility
}

// Reproductive cycle data
export interface ReproductiveCycleData {
  dog?: Dog;
  status?: ReproductiveStatus;
  currentHeatCycle?: HeatCycle;
  pastHeatCycles?: HeatCycle[];
  currentPregnancy?: PregnancyRecord;
  pastPregnancies?: PregnancyRecord[];
  breedingRecords?: BreedingRecord[];
  milestones?: ReproductiveMilestone[];
  heatStages?: HeatStage[];
  isPregnant?: boolean;
  isInHeat?: boolean;
  lastHeatDate?: string;
  nextHeatDate?: string | Date;
  dueDate?: string;
  averageCycleLength?: number;
  heatCycles?: HeatCycle[];
  pregnancyRecords?: PregnancyRecord[];
  currentStage?: HeatStage;
  fertilityWindow?: { start: Date; end: Date };
  gestationDays?: number;
  estimatedDueDate?: Date;
  daysUntilNextHeat?: number;
}

// Breeding checklist item
export interface BreedingChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
  task_name?: string; // For backward compatibility
  task?: string; // For backward compatibility
}

// Breeding preparation form data
export interface BreedingPrepFormData {
  damId: string;
  sireId: string;
  plannedDate: Date;
  plannedTieDate?: Date;
  estimatedDueDate?: Date;
  breedingMethod: string;
  notes?: string;
}

// Helper function to normalize breeding record data
export function normalizeBreedingRecord(record: any): BreedingRecord {
  return {
    id: record.id,
    dog_id: record.dog_id || record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date || record.tie_date,
    method: record.method || record.breeding_method,
    success: record.success || record.is_successful,
    notes: record.notes,
    created_at: record.created_at,
    updated_at: record.updated_at,
    created_by: record.created_by,
    updated_by: record.updated_by,
    tie_date: record.tie_date,
    breeding_method: record.breeding_method,
    is_successful: record.is_successful,
    estimated_due_date: record.estimated_due_date
  };
}
