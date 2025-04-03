
import { BreedingRecord } from './breeding';
import { Dog } from './dog';

// Heat intensity as string literal type
export type HeatIntensity = 'mild' | 'moderate' | 'strong' | 'unknown';

// Heat cycle data
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string | null;
  cycle_number?: number;
  cycle_length?: number;
  intensity?: HeatIntensity;
  symptoms?: string[];
  fertility_indicators?: any;
  notes?: string;
  recorded_by?: string;
  created_at: string;
  updated_at?: string;
}

// Heat stage information
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

// Reproductive status enum
export enum ReproductiveStatus {
  Default = 'default',
  InHeat = 'in_heat',
  Pregnant = 'pregnant',
  Breeding = 'breeding',
  Whelping = 'whelping',
  Lactating = 'lactating'
}

// Breeding event data
export interface BreedingEvent {
  id: string;
  dog_id?: string;
  dam_id?: string;
  sire_id: string;
  heat_cycle_id?: string;
  breeding_date: string;
  tie_date?: string;
  breeding_method: string;
  is_successful: boolean;
  notes?: string;
  created_at: string;
  updated_at?: string;
  estimated_due_date?: string;
  next_heat_date?: string;
}

// Pregnancy record
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date?: string;
  due_date?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'unsuccessful';
  created_by?: string;
  created_at: string;
}

// Data for reproductive cycle components
export interface ReproductiveCycleData {
  dog: Dog | null;
  status: ReproductiveStatus;
  heatCycles: HeatCycle[];
  currentHeatCycle: HeatCycle | null;
  currentHeatStage: HeatStage | null;
  averageCycleLength: number | null;
  nextHeatDate: string | null;
  breedingRecords: BreedingRecord[];
  currentBreedingRecord: BreedingRecord | null;
  pregnancyRecord: PregnancyRecord | null;
  dueDate: string | null;
  isLoading: boolean;
  error: Error | null;
}

// Reproductive milestone
export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

// Welping data types
export interface WelpingRecord {
  id: string;
  litter_id: string;
  birth_date: string;
  start_time: string;
  end_time?: string;
  status: 'in-progress' | 'completed';
  total_puppies: number;
  males: number;
  females: number;
  complications: boolean;
  complication_notes?: string;
  attended_by?: string;
  notes?: string;
  created_at: string;
}

export interface WelpingObservation {
  id: string;
  welping_record_id: string;
  observation_time: string;
  observation_type: string;
  description: string;
  puppy_id?: string;
  action_taken?: string;
  created_at: string;
}

export interface WelpingLog {
  id: string;
  litter_id: string;
  timestamp: string;
  event_type: string;
  puppy_id?: string;
  puppy_details?: any;
  notes?: string;
  created_at: string;
}

export interface PostpartumCare {
  id: string;
  puppy_id: string;
  care_type: string;
  care_time: string;
  notes: string;
  performed_by?: string;
  created_at: string;
}

// Breeding preparation
export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  planned_date: string;
  planned_tie_date: string;
  breeding_method: string;
  notes: string;
}

export interface BreedingChecklistItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  category: string;
  dueDate?: string;
  task?: string;
}
