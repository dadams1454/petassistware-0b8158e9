import { WeightUnit } from './common';

// Basic gender types
export type DogGender = 'Male' | 'Female';

// Heat cycle intensity types
export enum HeatIntensity {
  Mild = 'mild',
  Moderate = 'moderate',
  Strong = 'strong',
  Unknown = 'unknown'
}

// Reproductive status of a dog
export enum ReproductiveStatus {
  Intact = 'Intact',
  InHeat = 'In Heat',
  PreHeat = 'Pre-Heat',
  Pregnant = 'Pregnant',
  Whelping = 'Whelping',
  Recovery = 'Recovery',
  Altered = 'Altered',
  Nursing = 'Nursing'
}

// Breeding record interface
export interface BreedingRecord {
  id: string;
  dam_id?: string;
  dog_id?: string; // For backward compatibility
  sire_id?: string;
  breeding_date: string;
  tie_date?: string;
  method?: string;
  breeding_method?: string; // For backward compatibility
  success?: boolean;
  is_successful?: boolean; // For backward compatibility
  notes?: string;
  created_at: string;
  created_by?: string;
  heat_cycle_id?: string;
  sire?: any; // Joined data from sire
}

// Function to normalize breeding records (handle both schemas)
export const normalizeBreedingRecord = (record: any): BreedingRecord => {
  return {
    id: record.id,
    dam_id: record.dam_id || record.dog_id,
    dog_id: record.dog_id,
    sire_id: record.sire_id,
    breeding_date: record.breeding_date,
    tie_date: record.tie_date,
    method: record.method || record.breeding_method,
    breeding_method: record.breeding_method,
    success: record.success !== undefined ? record.success : record.is_successful,
    is_successful: record.is_successful,
    notes: record.notes,
    created_at: record.created_at,
    created_by: record.created_by,
    sire: record.sire
  };
};

// Pregnancy record interface
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

// Heat cycle interface
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
  recorded_by?: string;
  created_at: string;
  updated_at?: string;
}

// Heat stage information
export interface HeatStage {
  name: string;
  description: string;
  duration: string;
  color: string;
  index: number;
  day?: number;
  fertility?: 'low' | 'medium' | 'high' | 'peak';
  id?: string; // For backward compatibility
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
  date?: string; // For backward compatibility
}

// Welping related interfaces
export interface WelpingLog {
  id: string;
  litter_id: string;
  event_type: string;
  timestamp: string;
  puppy_id?: string;
  notes?: string;
  puppy_details?: any;
  created_at: string;
}

export interface WelpingObservation {
  id: string;
  welping_record_id: string;
  observation_time: string;
  observation_type: string;
  description: string;
  puppy_id?: string;
  action_taken?: string;
  created_at: string;
}

export interface PostpartumCare {
  id: string;
  litter_id?: string;
  puppy_id?: string;
  date: string;
  dam_temperature?: number;
  dam_appetite?: string;
  dam_hydration?: string;
  dam_discharge?: string;
  dam_milk_production?: string;
  dam_behavior?: string;
  puppies_nursing?: boolean;
  all_puppies_nursing?: boolean;
  puppy_weights_recorded?: boolean;
  weight_concerns?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  care_type?: string;
  care_time?: string;
  performed_by?: string;
}

// Breeding preparation form data
export interface BreedingPrepFormData {
  dam_id: string;
  sire_id: string;
  tie_date: string;
  estimated_due_date: string;
  breeding_method: string;
  notes: string;
}

// Breeding checklist item
export interface BreedingChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  dueDate?: string;
}

// Reproductive cycle data
export interface ReproductiveCycleData {
  dog: Dog;
  status: ReproductiveStatus;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  nextHeatDate?: Date;
  daysUntilNextHeat?: number;
  averageCycleLength?: number;
  currentHeatStage?: HeatStage;
  fertilityWindow?: {
    start: Date;
    end: Date;
  };
  gestationDays?: number;
  estimatedDueDate?: Date;
}

// Basic Dog interface for reproductive cycle tracking
export interface Dog {
  id: string;
  name: string;
  breed?: string;
  color?: string;
  gender: DogGender;
  photo_url?: string;
  birthdate?: Date | string;
  registration_number?: string;
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
}
