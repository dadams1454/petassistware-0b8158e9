// Reproductive cycle related types

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
export enum HeatIntensity {
  Low = 'Low',
  Mild = 'Mild',
  Moderate = 'Moderate',
  Medium = 'Medium',
  High = 'High',
  Strong = 'Strong',
  Peak = 'Peak'
}

export const HeatIntensityValues: HeatIntensity[] = [
  HeatIntensity.Low, 
  HeatIntensity.Mild, 
  HeatIntensity.Moderate, 
  HeatIntensity.Medium, 
  HeatIntensity.High, 
  HeatIntensity.Strong, 
  HeatIntensity.Peak
];

// Heat stage definition
export interface HeatStage {
  name: string;
  fertility: 'none' | 'low' | 'medium' | 'high' | 'peak';
  day?: number; // Add day property that was missing
  description?: string;
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
  breeding_method?: string; // For backward compatibility
  success?: boolean;
  is_successful?: boolean; // For backward compatibility
  notes?: string;
  created_at: string;
  created_by?: string;
  dam?: Dog;
  sire?: Dog;
  estimated_due_date?: string;
  dam_id?: string; // For compatibility with newer schema
  heat_cycle_id?: string;
}

// Helper function to normalize breeding record from different schema versions
export function normalizeBreedingRecord(record: any): BreedingRecord {
  return {
    id: record.id,
    dog_id: record.dog_id || record.dam_id,
    dam_id: record.dam_id || record.dog_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date,
    tie_date: record.tie_date,
    method: record.method || record.breeding_method,
    breeding_method: record.breeding_method || record.method,
    success: record.success || record.is_successful,
    is_successful: record.is_successful || record.success,
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by,
    dam: record.dam,
    sire: record.sire,
    estimated_due_date: record.estimated_due_date
  };
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
  actual_whelp_date?: string;
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
  currentHeatCycle?: HeatCycle;
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  lastHeatDate?: string | Date;
  nextHeatDate?: string | Date | null;
  daysUntilNextHeat?: number | null;
  daysInHeat?: number;
  averageCycleLength?: number;
  pregnant?: boolean;
  gestationDays?: number;
  estimatedDueDate?: string | Date | null;
  fertilityWindow?: { start: Date; end: Date } | null;
}

// Breeding preparation data
export interface BreedingPrepFormData {
  damId: string;
  sireId: string;
  plannedDate?: Date;
  tieDate?: string;
  notes?: string;
  plannedMethod?: string;
}

// Breeding checklist item
export interface BreedingChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  required: boolean;
  category: string;
  due_date?: string;
}

// Export types using 'export type' for isolatedModules compatibility
export type { Dog } from '@/types/dog';
