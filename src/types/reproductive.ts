
import { Dog } from './dog';

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string | null;
  symptoms?: string[] | null;
  intensity?: string | null;
  cycle_number?: number | null;
  cycle_length?: number | null;
  notes?: string | null;
  fertility_indicators?: FertilityIndicators | null;
  created_at: string;
  updated_at: string;
}

export interface FertilityIndicators {
  vulva_swelling?: 'none' | 'mild' | 'moderate' | 'significant';
  discharge_color?: string;
  discharge_consistency?: string;
  behavioral_changes?: string[];
  fertile_window_start?: string;
  fertile_window_end?: string;
  standing_heat_date?: string;
}

export interface BreedingRecord {
  id: string;
  dog_id: string;
  sire_id?: string | null;
  heat_cycle_id?: string | null;
  tie_date: string;
  breeding_method?: string | null;
  is_successful?: boolean | null;
  estimated_due_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  sire?: Dog;
}

export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string | null;
  confirmation_date?: string | null;
  estimated_whelp_date?: string | null;
  actual_whelp_date?: string | null;
  complications?: string | null;
  outcome?: string | null;
  puppies_born?: number | null;
  puppies_alive?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string | null;
  created_at: string;
}

export enum ReproductiveStatus {
  NOT_IN_HEAT = 'not_in_heat',
  PRE_HEAT = 'pre_heat',
  IN_HEAT = 'in_heat',
  PREGNANT = 'pregnant',
  WHELPING = 'whelping',
  NURSING = 'nursing',
  RECOVERY = 'recovery'
}

export type HeatStage = {
  name: string;
  description: string;
  day: number;
  fertility: 'low' | 'medium' | 'high' | 'peak';
};

export type ReproductiveCycleData = {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  
  // Computed values
  status: ReproductiveStatus;
  nextHeatDate?: Date | null;
  daysUntilNextHeat?: number | null;
  averageCycleLength?: number | null;
  currentHeatCycle?: HeatCycle | null;
  currentHeatDay?: number | null;
  currentHeatStage?: HeatStage | null;
  fertilityWindow?: { start: Date; end: Date } | null;
  currentPregnancy?: PregnancyRecord | null;
  gestationDays?: number | null;
  estimatedDueDate?: Date | null;
};
