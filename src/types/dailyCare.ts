// Define flag types for dogs in care dashboard
export interface DogFlag {
  id: string;
  name: string;
  color?: string;
  type?: 'in_heat' | 'special_attention' | 'incompatible' | 'other';
  value?: string;
  description?: string;
  incompatible_with?: string[];
}

// Care status interface for a dog
export interface DogCareStatus {
  dog_id: string;
  id?: string; // Adding for compatibility
  name?: string; // Adding for compatibility
  dog_name?: string; // Existing field
  status?: string; // Adding for compatibility
  last_updated?: string; // Adding for compatibility
  breed?: string;
  color?: string;
  sex?: string;
  dog_photo?: string;
  photo_url?: string;
  dog_weight?: number;
  weight?: number;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  requires_special_handling?: boolean;
  flags?: DogFlag[];
  
  // Activity timestamps
  last_potty_time?: string | null;
  last_feeding_time?: string | null;
  last_medication_time?: string | null;
  last_grooming_time?: string | null;
  last_exercise_time?: string | null;
  last_wellness_time?: string | null;
  last_training_time?: string | null;
  
  // Activity arrays for today
  feeding_times_today?: any[];
  potty_times_today?: any[];
  medication_times_today?: any[];
  exercise_times_today?: any[];
  grooming_times_today?: any[];
  wellness_times_today?: any[];
  training_times_today?: any[];
  
  // Most recent care info
  last_care?: {
    category: string;
    task_name: string;
    timestamp: string;
  } | null;
}

// Daily care log entry
export interface DailyCarelog {
  id: string;
  dog_id: string;
  category: string;
  task_name: string; // Making this required to match CareLog
  timestamp: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

// Interface used by useCareLogForm
export interface CareLogFormData {
  dog_id: string;
  category: string;
  task: string; // Use task or task_name consistently
  task_name?: string;
  timestamp: string | Date;
  notes?: string;
  flags?: string[] | DogFlag[];
  metadata?: any;
}

// Interface for care task presets
export interface CareTaskPreset {
  id: string;
  category: string;
  task_name: string;
  created_by: string;
  created_at: string;
  tenant_id?: string;
}

// Interface for simplified care logs in DogTimeTable
export interface CareLog {
  id: string;
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
}

// Export FlagType separately for type checking
export type FlagType = 'in_heat' | 'special_attention' | 'incompatible' | 'other';

// Export DogCareObservation interface
export interface DogCareObservation {
  id: string;
  dog_id: string;
  time_slot: string;
  category: string;
  observation_type: string;
  notes?: string;
  timestamp: Date | string;
}

// Export CareScheduleItem interface
export interface CareScheduleItem {
  id: string;
  dog_id: string;
  category: string;
  scheduled_time: string;
  completed: boolean;
  completed_at?: string;
  notes?: string;
}
