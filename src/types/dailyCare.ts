
/**
 * Daily care-related types
 */

// Daily care log entry
export interface DailyCarelog {
  id: string;
  dog_id: string;
  timestamp: string;
  category: string;
  task: string;
  task_name?: string; // Added this to fix compatibility issues
  notes?: string;
  flags?: string[];
  completed_by?: string;
  created_by?: string; // Added for compatibility
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

// Form data for creating a care log
export interface CareLogFormData {
  dog_id: string;
  timestamp: string | Date;
  category: string;
  task: string;
  task_name?: string; // Added for compatibility
  notes?: string;
  flags?: string[];
  metadata?: Record<string, any>;
}

// Preset care tasks
export interface CareTaskPreset {
  id: string;
  category: string;
  task_name: string;
  is_default: boolean;
  breeder_id?: string;
  created_at: string;
  updated_at?: string;
}

// Care status for a dog
export interface DogCareStatus {
  id: string;
  dog_id: string;
  name: string;
  dog_name?: string; // For compatibility with both naming conventions
  status: string;
  last_updated: string;
  flags?: DogFlag[];
  
  // Extended properties for compatibility with dog.ts DogCareStatus
  breed?: string;
  sex?: string;
  gender?: string; // Added for compatibility
  color?: string;
  dog_photo?: string;
  photo_url?: string;
  birthdate?: string;
  requires_special_handling?: boolean;
  last_potty_time?: string | null;
  last_feeding_time?: string | null;
  last_medication_time?: string | null;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  last_care?: {
    category: string;
    task_name: string;
    timestamp: string;
    notes?: string;
  } | null;
  created_at: string;
  updated_at?: string;
}

// Flag for marking special conditions for a dog
export interface DogFlag {
  id: string;
  name: string;
  color: string;
  description?: string;
  type?: string;
  value?: string;
  incompatible_with?: string[];
}

// Observation made during care
export interface DogCareObservation {
  id: string;
  dog_id: string;
  category: string;
  observation_type: string;
  timestamp: string;
  notes?: string;
  severity?: 'low' | 'medium' | 'high';
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
  updated_at?: string;
}

// Scheduled care item
export interface CareScheduleItem {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  title: string;
  category: string;
  scheduled_time: string;
  frequency?: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at?: string;
}

// Alias type for compatibility
export type CareLog = DailyCarelog;

// Define flag types for the toggleFlag function
export type FlagType = "other" | "special_attention" | "incompatible" | "in_heat";
