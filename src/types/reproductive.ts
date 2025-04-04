
export enum ReproductiveStatus {
  InHeat = 'in-heat',
  Pregnant = 'pregnant',
  Lactating = 'lactating',
  Available = 'available',
  Breeding = 'breeding',
  Unavailable = 'unavailable',
  Spayed = 'spayed',
  Neutered = 'neutered',
  // Additional statuses needed by components
  PreHeat = 'pre-heat',
  NotInHeat = 'not-in-heat',
  Whelping = 'whelping',
  Nursing = 'nursing',
  Recovery = 'recovery',
  Altered = 'altered'
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

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string | null;
  cycle_length?: number | null;
  notes?: string | null;
  symptoms?: string[] | null;
  intensity?: HeatIntensity;
  cycle_number?: number;
}

export interface BreedingRecord {
  id: string;
  dog_id: string;
  dam_id?: string;
  sire_id?: string;
  breeding_date: string;
  tie_date?: string;
  method?: string;
  breeding_method?: string;
  success?: boolean;
  is_successful?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  estimated_due_date?: string;
  sire?: Dog;
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
  estimated_whelp_date?: string;
  actual_whelp_date?: string;
  puppies_born?: number;
  puppies_alive?: number;
  outcome?: string;
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
  status?: ReproductiveStatus;
  fertilityWindow?: { start: Date; end: Date } | null;
  estimatedDueDate?: string | null;
  daysUntilNextHeat?: number | null;
  averageCycleLength?: number | null;
}

export interface BreedingChecklistItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  due_date?: string;
  category: string;
  task?: string;
}

export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  planned_date: string;
  method: string;
  notes: string;
}

export interface Dog {
  id: string;
  name: string;
  breed?: string;
  color?: string;
  gender?: 'Male' | 'Female';
  photo_url?: string;
  birthdate?: Date | string;
  registration_number?: string;
  last_heat_date?: string;
}

// Helper function to normalize a breeding record from API
export function normalizeBreedingRecord(record: any): BreedingRecord {
  return {
    id: record.id,
    dog_id: record.dog_id || record.dam_id,
    dam_id: record.dam_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date,
    tie_date: record.tie_date,
    method: record.method || record.breeding_method,
    breeding_method: record.breeding_method,
    success: record.success || record.is_successful,
    is_successful: record.is_successful,
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by,
    estimated_due_date: record.estimated_due_date,
    sire: record.sire
  };
}
