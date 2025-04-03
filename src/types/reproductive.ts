
import { Dog } from './litter';

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_number: number;
  intensity?: 'light' | 'moderate' | 'heavy';
  notes?: string;
  symptoms?: string[];
  created_at?: string;
  cycle_length?: number;
  fertility_indicators?: any;
  recorded_by?: string;
  updated_at?: string;
}

export interface DogWithCycles extends Dog {
  heat_cycles?: HeatCycle[];
  next_heat_date?: string;
  average_cycle_length?: number;
}

export interface BreedingRecord {
  id: string;
  dam_id: string;
  sire_id: string;
  breeding_date: string;
  successful: boolean;
  method: 'natural' | 'ai' | 'surgical-ai';
  notes?: string;
  created_at?: string;
  dam?: Dog;
  sire?: Dog;
  tie_date?: string;
  heat_cycle_id?: string;
  breeding_method?: string;
  estimated_due_date?: string;
}

export interface PregnancyRecord {
  id: string;
  dog_id: string;
  due_date: string;
  confirmed_date?: string;
  litter_id?: string;
  notes?: string;
  status: 'suspected' | 'confirmed' | 'completed' | 'lost';
  created_at?: string;
  dog?: Dog;
  confirmation_date?: string;
  estimated_whelp_date?: string;
  actual_whelp_date?: string;
  puppies_born?: number;
  puppies_alive?: number;
  outcome?: string;
  breeding_record_id?: string;
}

export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  date: string;
  notes?: string;
  created_at?: string;
  milestone_date?: string;
}

export enum ReproductiveStatus {
  NORMAL = 'normal',
  PRE_HEAT = 'pre-heat',
  IN_HEAT = 'in-heat',
  PREGNANT = 'pregnant',
  WHELPING = 'whelping',
  NURSING = 'nursing',
  RECOVERY = 'recovery',
  SPAYED = 'spayed',
  NEUTERED = 'neutered',
  NOT_IN_HEAT = 'not-in-heat'
}

export interface ReproductiveStatusRecord {
  id: string;
  dog_id: string;
  status: ReproductiveStatus;
  start_date: string;
  end_date?: string;
  notes?: string;
  created_at?: string;
}

export interface HeatStage {
  day: number;
  name: string;
  description: string;
  fertility: 'none' | 'low' | 'moderate' | 'high' | 'peak';
}

export interface ReproductiveCycleData {
  isInHeat: boolean;
  isPreHeat: boolean;
  nextHeatDate?: Date;
  daysUntilNextHeat?: number;
  currentStage?: HeatStage;
  fertileDays?: {
    start: Date;
    end: Date;
  };
  // Additional properties for backward compatibility
  dog?: any;
  heatCycles?: HeatCycle[];
  breedingRecords?: BreedingRecord[];
  pregnancyRecords?: PregnancyRecord[];
  milestones?: ReproductiveMilestone[];
  status?: string;
  currentHeatCycle?: HeatCycle;
  fertilityWindow?: any;
  gestationDays?: number;
  estimatedDueDate?: Date;
  averageCycleLength?: number;
}

export interface BreedingPrepFormData {
  damId: string;
  sireId: string;
  method: string;
  plannedDate: string;
  notes: string;
}

export interface BreedingChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  task?: string; // Added for backward compatibility
}

// Define WelpingLog with correct types
export interface WelpingLog {
  id: string;
  litter_id: string;
  timestamp: string;
  event_type: 'start' | 'contraction' | 'puppy_born' | 'note' | 'end';
  puppy_id?: string;
  notes?: string;
  puppy_details?: {
    gender?: string;
    color?: string;
    weight?: number;
    weight_unit?: string;
    birth_order?: number;
  };
  created_at?: string;
}

export interface WelpingSession {
  id: string;
  litter_id: string;
  start_time: string;
  end_time?: string;
  status: 'in-progress' | 'completed' | 'interrupted';
  total_puppies: number;
  males: number;
  females: number;
  complications: boolean;
  complication_notes?: string;
  attended_by?: string;
  notes?: string;
  logs?: WelpingLog[];
  created_at?: string;
}

export interface WelpingStats {
  pregnantCount: number;
  activeWelpingsCount: number;
  totalPuppiesCount: number;
  upcomingWelpingsCount?: number;
}

export interface WelpingObservation {
  id: string;
  welping_id: string;
  observation_time: string;
  notes: string;
  created_at?: string;
}
