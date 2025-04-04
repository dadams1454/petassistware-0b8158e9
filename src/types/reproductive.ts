
import { Dog } from '@/types/dog';

export enum ReproductiveStatus {
  InHeat = 'in_heat',
  Pregnant = 'pregnant',
  Nursing = 'nursing',
  Available = 'available',
  Resting = 'resting',
  Planned = 'planned'
}

export enum HeatIntensity {
  Mild = 'mild',
  Moderate = 'moderate',
  Strong = 'strong'
}

export type HeatIntensityType = 'mild' | 'moderate' | 'strong';

export interface HeatStage {
  name: string;
  description: string;
  duration: [number, number];
  signs: string[];
  color: string;
  id: string;
  icon?: string;
}

export interface PregnancyStage {
  id: string;
  name: string;
  days: [number, number];
  description: string;
  milestones: string[];
  color: string;
}

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
  
  // Relations
  dam?: Dog;
  sire?: Dog;
}

export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_id?: string;
  confirmation_date: string;
  due_date: string;
  notes?: string;
  ultrasound_date?: string;
  confirmed_puppy_count?: number;
  created_at: string;
  created_by?: string;
  
  // Relations
  dog?: Dog;
}

export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export interface BreedingChecklistItem {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  due_date?: string;
  completion_date?: string;
}

export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  
  // Calculated properties
  averageCycleLength: number;
  currentStatus: ReproductiveStatus;
  currentHeatCycle?: HeatCycle;
  currentHeatStage?: HeatStage;
  lastHeatDate?: string;
  nextEstimatedHeatDate?: string;
  daysUntilNextHeat?: number;
  
  // Pregnancy data
  currentPregnancy?: PregnancyRecord;
  pregnancyDay?: number;
  currentPregnancyStage?: PregnancyStage;
  estimatedDueDate?: string;
  daysUntilDue?: number;
  gestationDays?: number;
  
  // Checklists
  breedingChecklist?: BreedingChecklistItem[];
  heatStages: HeatStage[];
}

export interface HeatCycleInput {
  dog_id: string;
  start_date: string;
  end_date?: string;
  intensity: HeatIntensityType;
  notes?: string;
}
