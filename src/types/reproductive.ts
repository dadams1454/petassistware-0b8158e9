
export enum HeatIntensity {
  Light = 'light',
  Moderate = 'moderate',
  Heavy = 'heavy'
}

export enum ReproductiveStatus {
  Intact = 'intact',
  Pregnant = 'pregnant',
  InHeat = 'in-heat',
  PreHeat = 'pre-heat',
  PostHeat = 'post-heat',
  Spayed = 'spayed',
  Neutered = 'neutered',
  Whelping = 'whelping',
  Nursing = 'nursing',
  Recovery = 'recovery'
}

// For backward compatibility with string constants
export const ReproductiveStatusConstants = {
  NOT_IN_HEAT: ReproductiveStatus.Intact,
  IN_HEAT: ReproductiveStatus.InHeat,
  PRE_HEAT: ReproductiveStatus.PreHeat,
  PREGNANT: ReproductiveStatus.Pregnant,
  WHELPING: ReproductiveStatus.Whelping,
  NURSING: ReproductiveStatus.Nursing,
  RECOVERY: ReproductiveStatus.Recovery
};

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
  
  // Additional fields to fix errors
  tie_date?: string;
  breeding_method?: string;
  is_successful?: boolean;
  heat_cycle_id?: string;
  estimated_due_date?: string;
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
  
  // Additional fields to fix errors
  confirmation_date?: string;
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
  date: string;
  description?: string;
  created_at: string;
  
  // Additional fields to fix errors
  milestone_date?: string;
  notes?: string;
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
  
  // Additional properties needed
  currentHeatCycle?: HeatCycle;
  averageCycleLength?: number;
  fertilityWindow?: { start: Date; end: Date };
  gestationDays?: number;
}

export interface BreedingChecklistItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  completed: boolean;
  icon?: string;
  task?: string; // Added for compatibility
}

export interface VerticalBreedingTimelineProps {
  dog: Dog;
  reproStatus?: ReproductiveCycleData;
}

export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  breeding_method: string;
  planned_date: string;
  notes: string;
}
