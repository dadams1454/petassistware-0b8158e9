
import { Dog } from './dog';

// Heat cycle intensity type
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
  Pregnant = 'pregnant',
  Available = 'available',
  Resting = 'resting',
  Nursing = 'nursing',
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

// Breeding checklist item interface
export interface BreedingChecklistItem {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  completion_date?: string;
  due_date?: string;
}

// Breeding preparation form data
export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  breeding_method: string;
  estimated_due_date: string;
  notes: string;
}

// Reproductive cycle data
export interface ReproductiveCycleData {
  dog: Dog;
  currentStatus: ReproductiveStatus;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  lastHeatDate?: string;
  nextHeatDate?: string;
  lastBreedingDate?: string;
  currentHeatStage?: HeatStageType;
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
  dueDate?: string;
  isPregnant: boolean;
  pregnancyConfirmed: boolean;
  pregnancyLost: boolean;
  gestationDays: number;
}
