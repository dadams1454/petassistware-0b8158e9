
import { Dog } from './dog';

// Heat cycle intensity type with all needed values
export type HeatIntensityType = 'mild' | 'moderate' | 'strong' | 'medium' | 'low' | 'high' | 'peak' | 'unknown';

// Heat intensity enum values
export const HeatIntensityValues = {
  MILD: 'mild',
  MODERATE: 'moderate',
  STRONG: 'strong',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  PEAK: 'peak',
  UNKNOWN: 'unknown'
} as const;

// For backward compatibility
export type HeatIntensity = HeatIntensityType;

// Heat cycle interface
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_number?: number;
  cycle_length?: number;
  intensity?: HeatIntensityType;
  symptoms?: string[];
  fertility_indicators?: any;
  notes?: string;
  created_at: string;
  updated_at?: string;
  recorded_by?: string;
}

// Reproductive status types
export enum ReproductiveStatus {
  InHeat = 'in_heat',
  PreHeat = 'pre_heat',
  Pregnant = 'pregnant',
  Available = 'available',
  Resting = 'resting',
  Nursing = 'nursing',
  Recovery = 'recovery',
  Whelping = 'whelping',
  Intact = 'intact',
  NotInHeat = 'not_in_heat',
  Altered = 'altered',
  Spayed = 'spayed',
  Neutered = 'neutered',
  Unknown = 'unknown'
}

// Heat stage types
export type HeatStageType = 'proestrus' | 'estrus' | 'diestrus' | 'anestrus' | 'unknown';

// Heat stage enum values
export const HeatStageValues = {
  PROESTRUS: 'proestrus',
  ESTRUS: 'estrus',
  DIESTRUS: 'diestrus',
  ANESTRUS: 'anestrus',
  UNKNOWN: 'unknown'
} as const;

// Heat Stage interface
export interface HeatStage {
  name: string;
  day: number;
  fertility: 'low' | 'medium' | 'high' | 'peak';
}

// Breeding record interface
export interface BreedingRecord {
  id: string;
  dog_id?: string;
  dam_id?: string;
  sire_id: string;
  breeding_date: string;
  tie_date?: string;
  method?: string;
  breeding_method?: string;
  success?: boolean;
  is_successful?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  dam?: Dog;
  sire?: Dog;
  heat_cycle_id?: string;
  estimated_due_date?: string;
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
    method: record.method || record.breeding_method,
    breeding_method: record.method || record.breeding_method,
    success: record.success !== undefined ? record.success : record.is_successful,
    is_successful: record.success !== undefined ? record.success : record.is_successful,
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by,
    sire: record.sire,
    dam: record.dam,
    heat_cycle_id: record.heat_cycle_id,
    estimated_due_date: record.estimated_due_date
  };
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
  date?: string; // For backward compatibility
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Breeding checklist item interface
export interface BreedingChecklistItem {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  completion_date?: string;
  due_date?: string;
  task?: string; // Some components use task instead of title
}

// Breeding preparation form data
export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  damId?: string; // For backward compatibility
  sireId?: string; // For backward compatibility
  breeding_method: string;
  estimated_due_date: string;
  plannedTieDate?: string; // For backward compatibility
  plannedDate?: string; // For backward compatibility
  notes: string;
}

// Reproductive cycle data
export interface ReproductiveCycleData {
  dog: Dog;
  currentStatus: ReproductiveStatus;
  status?: ReproductiveStatus; // For backward compatibility
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  lastHeatDate?: string;
  nextHeatDate?: string;
  daysUntilNextHeat?: number;
  averageCycleLength?: number;
  lastBreedingDate?: string;
  currentHeatStage?: HeatStage;
  currentHeatCycle?: HeatCycle;
  currentStage?: HeatStage; // For backward compatibility
  heatStages?: {
    proestrus?: [Date, Date];
    estrus?: [Date, Date];
    diestrus?: [Date, Date];
    anestrus?: [Date, Date];
  };
  fertileDays?: {
    start: Date;
    end: Date;
  };
  fertilityWindow?: {
    start: Date;
    end: Date;
  };
  dueDate?: string;
  estimatedDueDate?: Date;
  isPregnant: boolean;
  pregnancyConfirmed: boolean;
  pregnancyLost: boolean;
  gestationDays: number;
}
