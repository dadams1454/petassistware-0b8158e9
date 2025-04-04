
import { Dog } from '@/types/dog';
import { Json } from '@/integrations/supabase/types';

// Reproductive status enum
export enum ReproductiveStatus {
  InHeat = 'InHeat',
  PreHeat = 'PreHeat',
  Pregnant = 'Pregnant',
  Whelping = 'Whelping',
  Nursing = 'Nursing',
  Recovery = 'Recovery',
  Intact = 'Intact',
  NotInHeat = 'NotInHeat',
  Altered = 'Altered',
  Spayed = 'Spayed',
  Neutered = 'Neutered'
}

// For backwards compatibility
export const ReproductiveStatusMapping = {
  IN_HEAT: ReproductiveStatus.InHeat,
  PRE_HEAT: ReproductiveStatus.PreHeat,
  PREGNANT: ReproductiveStatus.Pregnant,
  WHELPING: ReproductiveStatus.Whelping,
  NURSING: ReproductiveStatus.Nursing,
  RECOVERY: ReproductiveStatus.Recovery,
  INTACT: ReproductiveStatus.Intact,
  NOT_IN_HEAT: ReproductiveStatus.NotInHeat,
  ALTERED: ReproductiveStatus.Altered,
  SPAYED: ReproductiveStatus.Spayed,
  NEUTERED: ReproductiveStatus.Neutered
};

// Heat intensity options
export type HeatIntensity = 'Low' | 'Mild' | 'Moderate' | 'Medium' | 'High' | 'Strong' | 'Peak';

export const HeatIntensityValues: HeatIntensity[] = [
  'Low', 'Mild', 'Moderate', 'Medium', 'High', 'Strong', 'Peak'
];

// Heat stage definition
export interface HeatStage {
  name: string;
  fertility: 'none' | 'low' | 'medium' | 'high' | 'peak';
  day?: number; // Add day property that was missing
}

// Heat cycle record
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_number?: number;
  cycle_length?: number;
  intensity: HeatIntensity;
  symptoms?: string[];
  fertility_indicators?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
  recorded_by?: string;
}

// Breeding record
export interface BreedingRecord {
  id: string;
  dog_id: string;
  sire_id: string;
  breeding_date: string;
  tie_date?: string;
  method?: string;
  success?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  dam?: Dog;
  sire?: Dog;
  estimated_due_date?: string;
}

// Pregnancy record
export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id: string;
  status: string;
  confirmed_date?: string; // For compatibility with confirmation_date
  confirmation_date?: string; 
  expected_due_date?: string; // For compatibility with estimated_whelp_date
  estimated_whelp_date?: string;
  due_date?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  puppies_born?: number;
  puppies_alive?: number;
  outcome?: string;
}

// Reproductive milestone
export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Combined data for reproductive dashboard
export interface ReproductiveCycleData {
  dog: Dog;
  status?: ReproductiveStatus; // Added status property that was missing
  currentStatus?: ReproductiveStatus; // For backward compatibility
  heatCycles: HeatCycle[];
  heatCycleCount?: number;
  heatStages?: HeatStage[];
  currentHeatStage?: HeatStage;
  currentStage?: HeatStage; // For backward compatibility
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  lastHeatDate?: string;
  nextHeatDate?: string | Date | null;
  daysUntilNextHeat?: number | null;
  daysInHeat?: number;
  averageCycleLength?: number;
  pregnant?: boolean;
  gestationDays?: number;
  estimatedDueDate?: string | Date | null;
  fertilityWindow?: { start: Date; end: Date } | null;
}

// Export types using 'export type' for isolatedModules compatibility
export type { Dog } from '@/types/dog';
