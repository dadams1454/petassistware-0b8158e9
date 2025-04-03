
// Types for reproductive tracking, breeding, and whelping

import { Dog } from './dogs';

// Heat intensity levels
export enum HeatIntensity {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

// Reproductive status enum
export enum ReproductiveStatus {
  Intact = 'intact',
  InHeat = 'in_heat',
  Pregnant = 'pregnant',
  Whelping = 'whelping',
  Recovery = 'recovery',
  Spayed = 'spayed',
  Neutered = 'neutered'
}

// Heat cycle stages
export enum HeatStage {
  Proestrus = 'proestrus',
  Estrus = 'estrus',
  Diestrus = 'diestrus',
  Anestrus = 'anestrus'
}

// Heat cycle record
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date: string | null;
  cycle_number?: number;
  cycle_length?: number;
  intensity?: HeatIntensity;
  symptoms?: string[];
  fertility_indicators?: any;
  notes?: string | null;
  recorded_by?: string;
  created_at: string;
  updated_at?: string;
}

// Breeding record
export interface BreedingRecord {
  id: string;
  dog_id: string; // Dam
  sire_id: string;
  breeding_date: string;
  tie_date?: string;
  method?: string;
  success?: boolean;
  notes?: string;
  created_at?: string;
  created_by?: string;
  heat_cycle_id?: string;
}

// Pregnancy record
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date?: string;
  due_date?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'terminated';
  notes?: string;
  created_at?: string;
  created_by?: string;
}

// Reproductive milestone record
export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at?: string;
  created_by?: string;
}

// Welping log entry
export interface WelpingLog {
  id: string;
  litter_id: string;
  puppy_id?: string;
  timestamp: string;
  event_type: 'birth' | 'note' | 'complication' | 'feeding' | 'medical';
  notes?: string;
  puppy_details?: any;
  created_at: string;
}

// Welping observation
export interface WelpingObservation {
  id: string;
  welping_record_id: string;
  puppy_id?: string;
  observation_time: string;
  observation_type: string;
  description: string;
  action_taken?: string;
  created_at?: string;
}

// Added to support breeding timing optimizer component
export interface BreedingTimingData {
  isInHeat: boolean;
  daysIntoCurrentHeat: number;
  fertileDays?: {
    start: Date;
    end: Date;
  };
  recommendedBreedingDays?: {
    start: Date;
    end: Date;
  };
}

// Reproductive cycle data for dashboard and tracking
export interface ReproductiveCycleData {
  dogId: string;
  currentStatus: ReproductiveStatus;
  lastHeatDate?: string;
  nextHeatDate?: string;
  currentCycle?: HeatCycle;
  heatHistory?: HeatCycle[];
  pregnancyHistory?: PregnancyRecord[];
  breedingHistory?: BreedingRecord[];
}
