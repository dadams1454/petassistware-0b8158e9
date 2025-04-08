
import { Dog } from './dog';
import { WeightUnit } from './weight-units';

/**
 * Interface for daily care log
 */
export interface DailyCarelog {
  id: string;
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
  created_at: string;
  created_by: string;
  medication_metadata?: any;
}

/**
 * Interface for care log form data
 */
export interface CareLogFormData {
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
  flags?: DogFlag[];
}

/**
 * Interface for care task preset
 */
export interface CareTaskPreset {
  id: string;
  category: string;
  task_name: string;
  is_default: boolean;
  created_at: string;
  created_by: string;
  breeder_id?: string;
}

/**
 * Interface for dog care status
 */
export interface DogCareStatus {
  dog_id: string;
  dog_name?: string;
  breed?: string;
  sex?: string;
  color?: string;
  dog_photo?: string;
  birthdate?: string;
  last_meal_time?: string;
  last_potty_time?: string;
  last_exercise_time?: string;
  last_medication_time?: string;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  is_in_heat?: boolean;
  heat_start_date?: string;
  special_notes?: string;
  created_at: string;
  updated_at: string;
  last_feeding?: {
    timestamp: string;
    food_type?: string;
    amount?: string;
    notes?: string;
  };
  last_potty_break?: {
    timestamp: string;
    type?: string;
    notes?: string;
  };
  last_exercise?: {
    timestamp: string;
    type?: string;
    duration?: number;
    notes?: string;
  };
  requires_special_handling?: boolean;
  flags?: DogFlag[];
}

/**
 * Interface for Dog Flag (special handling or warnings)
 */
export interface DogFlag {
  id?: string;
  dog_id?: string;
  type: string;
  value?: string;
  notes?: string;
  created_at?: string;
  incompatible_with?: string;
  active?: boolean;
}

/**
 * Interface for Dog Care Observation
 */
export interface DogCareObservation {
  id: string;
  dog_id: string;
  observation_type: string;
  observation_date: string;
  description: string;
  created_by: string;
  created_at: string;
  flags?: DogFlag[];
}

/**
 * Interface for Care Schedule Item
 */
export interface CareScheduleItem {
  id: string;
  dog_id: string;
  care_type: string;
  scheduled_time: string;
  frequency: string;
  status: 'pending' | 'completed' | 'missed';
  created_at: string;
  completed_at?: string;
  completed_by?: string;
  notes?: string;
}
