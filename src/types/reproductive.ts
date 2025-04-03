
export enum ReproductiveStatus {
  InHeat = 'in-heat',
  Pregnant = 'pregnant',
  Lactating = 'lactating',
  Available = 'available',
  Breeding = 'breeding',
  Unavailable = 'unavailable',
  Spayed = 'spayed',
  Neutered = 'neutered'
}

export type HeatIntensity = 'mild' | 'moderate' | 'strong' | 'unknown';

export interface HeatStage {
  id: string;
  name: string;
  description: string;
  day: number;
  fertility: 'high' | 'low' | 'medium' | 'peak';
  color: string;
  length: number;
  duration: number;
  index: number;
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
}

export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date?: string;
  due_date?: string;
  status: string;
  notes?: string;
  created_at: string;
  created_by?: string;
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

export interface ReproductiveCycleData {
  dog: any; // Dog profile
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  isInHeat: boolean;
  isPregnant: boolean;
  isLactating: boolean;
  lastHeatDate: string | null;
  nextHeatDate: string | null;
  lastHeatCycle: any | null;
  currentHeatCycle: any | null;
  currentHeatStage: HeatStage | null;
  heatStages: HeatStage[];
  lastBreedingRecord: BreedingRecord | null;
  lastPregnancyRecord: PregnancyRecord | null;
  dueDate: string | null;
  reproductiveStatus: ReproductiveStatus;
  gestationDays: number;
  heatCycleHistory: {
    date: string;
    event: string;
    details: string;
  }[];
}

export interface BreedingChecklistItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  due_date?: string;
  category: string;
}

export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  planned_date: string;
  method: string;
  notes: string;
}

// Helper function to normalize a breeding record from API
export function normalizeBreedingRecord(record: any): BreedingRecord {
  return {
    id: record.id,
    dog_id: record.dog_id || record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date,
    method: record.method || record.breeding_method,
    success: record.success || record.is_successful,
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by
  };
}
