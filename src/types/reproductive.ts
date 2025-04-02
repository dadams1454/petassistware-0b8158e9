
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
}

export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  date: string;
  notes?: string;
  created_at?: string;
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
  NEUTERED = 'neutered'
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
