
import { Dog } from './dog';

// Type for heat intensity values
export type HeatIntensityType = 'light' | 'moderate' | 'heavy' | 'mild' | 'medium' | 'low' | 'high' | 'peak' | 'strong' | 'unknown';

// Heat intensity values
export const HeatIntensityValues: HeatIntensityType[] = ['light', 'moderate', 'heavy', 'mild', 'medium', 'low', 'high', 'peak', 'strong', 'unknown'];

// Heat intensity enum for backward compatibility
export enum HeatIntensity {
  LIGHT = 'light',
  MODERATE = 'moderate',
  HEAVY = 'heavy',
  MILD = 'mild',
  MEDIUM = 'medium',
  LOW = 'low',
  HIGH = 'high',
  PEAK = 'peak',
  STRONG = 'strong',
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
  PreHeat = 'pre_heat',
  Pregnant = 'pregnant',
  Whelping = 'whelping',
  Nursing = 'nursing',
  Available = 'available',
  Resting = 'resting',
  TooYoung = 'too_young',
  TooOld = 'too_old',
  Spayed = 'spayed',
  Recovery = 'recovery',
  Intact = 'intact',
  NotInHeat = 'not_in_heat',
  Altered = 'altered',
  Neutered = 'neutered'
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
  estimated_whelp_date?: string;
  actual_whelp_date?: string;
  puppies_born?: number;
  puppies_alive?: number;
  outcome?: string;
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
  lastHeatCycle?: HeatCycle | null;
  currentHeatCycle?: HeatCycle | null;
  currentHeatStage?: HeatStage | null;
  currentPregnancy?: PregnancyRecord | null;
  isInHeat: boolean;
  isPregnant: boolean;
  nextHeatDate?: string | null;
  daysUntilNextHeat?: number | null;
  daysSinceLastHeat?: number | null;
  averageCycleLength?: number | null;
  heatStages: HeatStage[];
  currentStatus: ReproductiveStatus;
  dueDate?: string | null;
  daysUntilDue?: number | null;
  gestationDays?: number | null;
  pregnancyConfirmed: boolean;
  pregnancyLost: boolean;
}

// Breeding checklist item interface
export interface BreedingChecklistItem {
  id: string;
  task: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  priority: string;
}

// Breeding preparation form data interface
export interface BreedingPrepFormData {
  dog_id: string;
  sire_id: string;
  tie_date: string;
  estimated_due_date: string;
  breeding_method: string;
  notes: string;
}

// Helper function to normalize breeding records
export function normalizeBreedingRecord(record: any): BreedingRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    dam_id: record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date,
    tie_date: record.tie_date,
    method: record.method,
    breeding_method: record.method, // For compatibility
    success: record.success,
    is_successful: record.success, // For compatibility
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by,
    sire: record.sire
  };
}
