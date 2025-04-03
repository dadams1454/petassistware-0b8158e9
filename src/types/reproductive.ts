
export interface Dog {
  id: string;
  name: string;
  color?: string;
  birthdate?: string;
  breed?: string;
  gender?: string;
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  reproductive_status?: ReproductiveStatus;
}

export enum ReproductiveStatus {
  Intact = 'intact',
  InHeat = 'in_heat',
  Pregnant = 'pregnant',
  Nursing = 'nursing',
  Spayed = 'spayed',
  Neutered = 'neutered'
}

export enum HeatIntensity {
  Light = 'light',
  Moderate = 'moderate',
  Heavy = 'heavy'
}

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_length?: number;
  intensity?: HeatIntensity | string;
  notes?: string;
  created_at?: string;
  cycle_number?: number;
  symptoms?: string[];
  fertility_indicators?: any;
  recorded_by?: string;
  updated_at?: string;
}

export interface BreedingRecord {
  id: string;
  dog_id: string;
  sire_id?: string;
  breeding_date: string;
  method?: string;
  success?: boolean;
  notes?: string;
  created_at?: string;
  created_by?: string;
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

export interface HeatStage {
  id: string;
  name: string;
  description: string;
  day: number;
  length: number;
  fertility: 'low' | 'medium' | 'high' | 'peak';
  color: string;
  duration: number;
  index: number;
}

export interface BreedingChecklistItem {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  category: string;
}

export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  currentHeatCycle?: HeatCycle;
  currentPregnancy?: PregnancyRecord;
  isInHeat: boolean;
  isPregnant: boolean;
  nextHeatDate?: string;
  daysUntilNextHeat?: number;
  lastHeatDate?: string;
  daysSinceLastHeat?: number;
  daysInHeat?: number;
  currentHeatStage?: HeatStage;
  dueDate?: string;
  daysUntilDue?: number;
  gestationDays?: number;
  heatStages: HeatStage[];
}
