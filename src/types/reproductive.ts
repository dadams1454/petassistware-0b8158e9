
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
  cycle_length?: number; // Added for compatibility
  fertility_indicators?: any; // Added for compatibility
  recorded_by?: string; // Added for compatibility
  updated_at?: string; // Added for compatibility
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
  tie_date?: string; // Added for compatibility
  heat_cycle_id?: string; // Added for compatibility
  breeding_method?: string; // Added for compatibility
  estimated_due_date?: string; // Added for compatibility
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
  confirmation_date?: string; // Added for compatibility
  estimated_whelp_date?: string; // Added for compatibility
  actual_whelp_date?: string; // Added for compatibility
  puppies_born?: number; // Added for compatibility
  puppies_alive?: number; // Added for compatibility
  outcome?: string; // Added for compatibility
  breeding_record_id?: string; // Added for compatibility
}

export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  date: string;
  notes?: string;
  created_at?: string;
  milestone_date?: string; // Added for compatibility
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
  NOT_IN_HEAT = 'not-in-heat' // Added for compatibility
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

// Add missing types needed by the codebase
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
}
