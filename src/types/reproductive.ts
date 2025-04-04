
import { Dog } from './dog';

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  intensity: HeatIntensityType;
  symptoms?: string[];
  notes?: string;
  cycle_number?: number;
  cycle_length?: number; 
  fertility_indicators?: any;
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
  dam?: Dog;
  sire?: Dog;
}

export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date?: string;
  due_date?: string;
  status: 'pending' | 'confirmed' | 'lost' | 'delivered';
  notes?: string;
  created_at: string;
  created_by?: string;
}

export enum ReproductiveStatus {
  InHeat = 'in_heat',
  Pregnant = 'pregnant',
  Breeding = 'breeding',
  NotActive = 'not_active',
  InWhelp = 'in_whelp',
  Unknown = 'unknown'
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

export type HeatIntensityType = 'light' | 'moderate' | 'heavy';

export const HeatIntensity = {
  Light: 'light' as HeatIntensityType,
  Moderate: 'moderate' as HeatIntensityType,
  Heavy: 'heavy' as HeatIntensityType
};

export const HeatIntensityValues: HeatIntensityType[] = ['light', 'moderate', 'heavy'];

export interface HeatStage {
  name: string;
  length: number; // Duration in days
  description: string;
  fertilityLevel: 'none' | 'low' | 'moderate' | 'high';
}

export interface ReproductiveCycleData {
  dog: Dog;
  currentStatus: ReproductiveStatus;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  lastHeatCycle?: HeatCycle;
  nextHeatDate?: Date;
  isInHeat: boolean;
  lastHeatDate?: Date;
  isPregnant: boolean;
  pregnancyConfirmed: boolean;
  pregnancyLost: boolean;
  estimatedDueDate?: Date;
  heatCycle?: {
    isInHeat: boolean;
    lastHeatDate?: Date;
    nextHeatDate?: Date;
    fertileDays?: {
      start: Date;
      end: Date;
    };
    currentStage?: string;
    daysIntoHeat?: number;
    daysUntilHeat?: number;
  };
  fertility?: {
    isFertile: boolean;
    fertileStartDate?: Date;
    fertileEndDate?: Date;
    daysUntilFertile?: number;
    daysLeftInFertileWindow?: number;
  };
  pregnancy?: {
    confirmationDate?: Date;
    dueDate?: Date;
    daysPregnant?: number;
    daysUntilDue?: number;
    trimester?: number;
  };
  gestationDays: number;
}

export interface BreedingChecklistItem {
  id: string;
  task: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  priority: string;
}

export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  breeding_date: string;
  breeding_method: string;
  notes?: string;
}

export const normalizeBreedingRecord = (record: any): BreedingRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id || record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date,
    method: record.method || record.breeding_method,
    success: !!record.success || record.is_successful,
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by
  };
};
