
import { Json } from '@/integrations/supabase/generated-types';

export interface Dog {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  breed: string;
  birthdate?: string;
  color?: string;
  photo_url?: string;
  is_pregnant?: boolean;
  last_heat_date?: string;
  registration_number?: string;
  microchip_number?: string;
  weight?: number;
  notes?: string;
  owner_id?: string;
  created_at?: string;
}

export type HeatIntensity = 'light' | 'moderate' | 'heavy';

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_number?: number;
  cycle_length?: number;
  intensity: HeatIntensity;
  symptoms?: string[];
  fertility_indicators?: Json;
  notes?: string;
  recorded_by?: string;
  created_at: string;
  updated_at?: string;
}

export enum ReproductiveStatus {
  READY = 'READY',
  IN_HEAT = 'IN_HEAT',
  BREEDING = 'BREEDING',
  PREGNANT = 'PREGNANT',
  WHELPING = 'WHELPING',
  NURSING = 'NURSING',
  RECOVERY = 'RECOVERY',
  UNAVAILABLE = 'UNAVAILABLE'
}

export interface BreedingRecord {
  id: string;
  dam_id: string;
  sire_id: string;
  breeding_date: string;
  method: string;
  successful: boolean;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_id?: string;
  confirmation_date: string;
  confirmation_method: string;
  due_date: string;
  puppy_count_estimate?: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  date: string;
  notes?: string;
  created_at: string;
}

export interface BreedingChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  plannedDate: string;
  method: string;
  notes?: string;
}

export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  showHeatCycles: boolean;
  showBreedingRecords: boolean;
  showPregnancyRecords: boolean;
  showMilestones: boolean;
  currentStatus: ReproductiveStatus;
  currentStage: string;
  isInHeat: boolean;
  isPregnant: boolean;
  isBreeding: boolean;
  isPreHeat: boolean;
  estimatedNextHeat?: Date;
  estimatedDueDate?: Date;
}
