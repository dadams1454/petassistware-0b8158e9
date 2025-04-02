export interface Dog {
  id: string;
  name: string;
  photoUrl?: string;
  gender: 'Male' | 'Female';
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  breed?: string;
  color?: string;
  created_at?: string;
}

export interface Breeding {
  id: string;
  dam_id: string;
  sire_id: string;
  date: string;
  notes?: string;
  status: 'Planned' | 'Completed' | 'Failed';
}

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  cycle_length?: number;
  cycle_number?: number;
  intensity?: string;
  symptoms?: string[];
  fertility_indicators?: any;
}

export enum ReproductiveStatus {
  IN_HEAT = 'in_heat',
  PRE_HEAT = 'pre_heat',
  PREGNANT = 'pregnant',
  NOT_IN_HEAT = 'not_in_heat',
  WHELPING = 'whelping',
  NURSING = 'nursing',
  RECOVERY = 'recovery'
}

export interface HeatStage {
  name: string;
  description: string;
  day: number;
  fertility?: 'low' | 'medium' | 'high' | 'peak';
}

export interface BreedingRecord {
  id: string;
  dog_id: string;
  sire_id: string;
  heat_cycle_id?: string;
  tie_date: string;
  breeding_method?: string;
  is_successful?: boolean;
  notes?: string;
  estimated_due_date?: string;
  sire?: Dog;
}

export interface PregnancyRecord {
  id: string;
  dog_id: string;
  breeding_record_id?: string;
  confirmation_date: string;
  estimated_whelp_date?: string;
  actual_whelp_date?: string;
  puppies_born?: number;
  puppies_alive?: number;
  complications?: string;
  outcome?: string;
  notes?: string;
}

export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
}

export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  status: ReproductiveStatus;
  nextHeatDate: Date | null;
  daysUntilNextHeat: number | null;
  averageCycleLength: number | null;
  currentHeatCycle: HeatCycle | null;
  currentHeatDay: number | null;
  currentHeatStage: HeatStage | null;
  fertilityWindow: { start: Date; end: Date } | null;
  currentPregnancy: PregnancyRecord | null;
  gestationDays: number | null;
  estimatedDueDate: Date | null;
}

export interface BreedingChecklistItem {
  id: string;
  task: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
  notes?: string;
  category: string;
}

export interface BreedingPrepFormData {
  damId: string;
  sireId: string;
  plannedDate: string;
  plannedTieDate?: Date; // Added this field to match the form usage
  notes?: string;
}
