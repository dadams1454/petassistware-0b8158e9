
/**
 * Daily care type definitions
 */
import { DogFlag } from './dog';

/**
 * Daily care log entry
 */
export interface DailyCarelog {
  id: string;
  dog_id: string;
  category: string;
  task_name: string;
  notes?: string;
  created_by: string;
  timestamp: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Care log form data
 */
export interface CareLogFormData {
  dog_id: string;
  category: string;
  task_name: string;
  notes?: string;
  timestamp?: string;
}

/**
 * Care task preset
 */
export interface CareTaskPreset {
  id: string;
  category: string;
  task_name: string;
  created_at: string;
  created_by: string;
}

/**
 * Dog care observation
 */
export interface DogCareObservation {
  id: string;
  dog_id: string;
  type: string;
  value: string;
  timestamp: string;
  created_by: string;
  created_at: string;
}

/**
 * Care schedule item
 */
export interface CareScheduleItem {
  id: string;
  dog_id: string;
  category: string;
  task_name: string;
  frequency: string;
  due_date: string;
  completed: boolean;
  completed_date?: string;
  created_at: string;
}

/**
 * Dog care status
 */
export interface DogCareStatus {
  dog_id: string;
  dog_name: string;
  breed?: string;
  sex?: string;
  color?: string;
  dog_photo?: string;
  birthdate?: string;
  requires_special_handling?: boolean;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  last_potty_time?: string | null;
  last_feeding_time?: string | null;
  last_medication_time?: string | null;
  flags: DogFlag[];
  created_at: string;
  updated_at: string;
  last_care?: {
    category: string;
    task_name: string;
    timestamp: string;
    notes?: string;
  } | null;
}
