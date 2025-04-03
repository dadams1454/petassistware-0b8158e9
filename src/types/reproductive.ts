
import { Dog } from './dog';

// Heat cycle intensity enum
export type HeatIntensity = 'mild' | 'moderate' | 'strong' | 'unknown';

// Heat cycle interface
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_length?: number;
  intensity?: HeatIntensity;
  notes?: string;
  created_at: string;
  cycle_number?: number;
  symptoms?: string[];
  fertility_indicators?: any;
  recorded_by?: string;
  updated_at?: string;
}

// Heat stage interface
export interface HeatStage {
  id: string;
  name: string;
  description: string;
  day: number;
  fertility: 'low' | 'medium' | 'high' | 'peak';
  color: string;
  length: number;
  duration: number;
  index: number;
}

// Reproductive status enum - expanded to include all needed statuses
export enum ReproductiveStatus {
  PreHeat = 'pre-heat',
  InHeat = 'in-heat',
  Pregnant = 'pregnant',
  Inactive = 'inactive',
  Nursing = 'nursing',
  Recovery = 'recovery',
  Whelping = 'whelping',
  Altered = 'altered',
  NotInHeat = 'not-in-heat'
}

// Breeding record
export interface BreedingRecord {
  id: string;
  dog_id: string;
  sire_id: string;
  breeding_date: string;
  method?: string;
  success?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  // Additional properties that are used in the codebase
  tie_date?: string;
  breeding_method?: string;
  is_successful?: boolean;
  estimated_due_date?: string;
  heat_cycle_id?: string;
}

// Pregnancy record
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  confirmation_date?: string;
  due_date?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  // Additional fields used in the codebase
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
  created_at: string;
  created_by?: string;
}

// Reproductive cycle data
export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  status: ReproductiveStatus;
  lastHeatCycle?: HeatCycle;
  nextHeatDate?: string;
  daysUntilNextHeat?: number;
  daysInCurrentCycle?: number;
  currentHeatStage?: HeatStage;
  averageCycleLength: number;
  heatStages: HeatStage[];
  heatStageDay?: number;
  isInHeat: boolean;
  isPregnant: boolean;
  currentBreedingRecord?: BreedingRecord;
  pregnancyRecord?: PregnancyRecord;
  gestationDays: number;
  dueDate?: string;
  // Additional properties used in the codebase
  currentHeatCycle?: HeatCycle;
  fertilityWindow?: { start: string; end: string };
  estimatedDueDate?: string;
}

// Breeding checklist item
export interface BreedingChecklistItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueBeforeBreeding: boolean;
  category: string;
  // Additional property used in the codebase
  task?: string;
}

// Breeding preparation form data
export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  planned_date: string;
  planned_tie_date: string;
  health_tests_completed: boolean;
  genetic_tests_reviewed: boolean;
  method: string;
  notes: string;
  // Legacy property names used in code
  damId?: string;
  sireId?: string;
  plannedDate?: string;
  plannedTieDate?: string;
}

// Normalize breeding record function
export const normalizeBreedingRecord = (record: any): BreedingRecord => {
  return {
    id: record.id || '',
    dog_id: record.dog_id || '',
    sire_id: record.sire_id || '',
    breeding_date: record.breeding_date || '',
    method: record.method || '',
    success: record.success || false,
    notes: record.notes || '',
    created_at: record.created_at || '',
    created_by: record.created_by || ''
  };
};
