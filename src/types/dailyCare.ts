
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
  notes?: string;
  flags?: string[];
  completed_by?: string;
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
  dog_name?: string;
  status: string;
  last_updated: string;
  flags?: string[];
}

// Flag for marking special conditions for a dog
export interface DogFlag {
  id: string;
  name: string;
  color: string;
  description?: string;
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
