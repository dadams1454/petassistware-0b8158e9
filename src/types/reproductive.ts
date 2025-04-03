
export enum HeatIntensity {
  Light = 'light',
  Moderate = 'moderate',
  Heavy = 'heavy'
}

export enum ReproductiveStatus {
  Intact = 'intact',
  Pregnant = 'pregnant',
  InHeat = 'in-heat',
  PostHeat = 'post-heat',
  Spayed = 'spayed',
  Neutered = 'neutered'
}

export interface HeatStage {
  id: string;
  name: string;
  description: string;
  color: string;
  day?: number;
  length: number;
  fertility?: string;
}

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_length?: number;
  cycle_number?: number;
  intensity: string | HeatIntensity;
  notes?: string;
  symptoms?: string[];
  fertility_indicators?: any;
  recorded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BreedingRecord {
  id: string;
  dam_id: string;
  sire_id?: string;
  sire?: Dog;
  breeding_date: string;
  expected_due_date?: string;
  notes?: string;
  created_at: string;
  status?: string;
}

export interface PregnancyRecord {
  id: string;
  breeding_record_id?: string;
  dog_id: string;
  confirmed_date: string;
  due_date: string;
  notes?: string;
  status: string;
  created_at: string;
}

export interface ReproductiveMilestone {
  id: string;
  dog_id: string;
  milestone_type: string;
  date: string;
  description?: string;
  created_at: string;
}

export interface Dog {
  id: string;
  name: string;
  photoUrl?: string;
  gender: string;
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  breed?: string;
  color?: string;
  created_at: string;
}

export interface ReproductiveCycleData {
  dog: Dog;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  pregnancyRecords: PregnancyRecord[];
  milestones: ReproductiveMilestone[];
  status: ReproductiveStatus | string;
  lastHeatDate?: Date;
  nextHeatDate?: Date;
  daysUntilNextHeat?: number;
  currentStage?: HeatStage;
  isInHeat: boolean;
  isPreHeat: boolean;
  isPregnant: boolean;
  estimatedDueDate?: Date;
  showHeatCycles: boolean;
  showBreedingRecords: boolean;
  showPregnancyRecords: boolean;
  showMilestones: boolean;
  isLoading: boolean;
  isError: boolean;
  error: any;
}

export interface BreedingChecklistItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  completed: boolean;
  icon?: string;
}

export interface VerticalBreedingTimelineProps {
  dog: Dog;
  reproStatus?: ReproductiveCycleData;
}
