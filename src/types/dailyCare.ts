
export interface DailyCarelog {
  id: string;
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
  created_by: string;
  created_at: string;
  flags?: string[];
  incompatible_with?: string[];
}

export interface CareLogFormData {
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
  flags?: string[];
  incompatible_with?: string[];
}

export interface CareTaskPreset {
  id: string;
  category: string;
  task_name: string;
  created_by: string;
  created_at: string;
}

export interface DogCareStatus {
  dog_id: string;
  dog_name: string;
  dog_photo: string;
  breed: string;
  color?: string;
  sex?: string;
  last_care?: {
    category: string;
    task_name: string;
    timestamp: string;
  };
  flags?: string[];
  incompatible_with?: string[];
  dog_weight?: number;
  weight_unit?: string;
  birthdate?: string;
  requires_special_handling?: boolean;
  last_potty_time?: string | null;
  last_feeding_time?: string | null;
  last_medication_time?: string | null;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
}

export interface DogFlag {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface DogCareObservation {
  id: string;
  dog_id: string;
  category: string;
  observation_type: string;
  observation: string;
  timestamp: string;
  created_by: string;
  created_at: string;
}

export interface CareScheduleItem {
  id: string;
  dog_id: string;
  category: string;
  task_name: string;
  scheduled_time: string;
  frequency: string;
  is_completed: boolean;
  completed_at?: string;
  completed_by?: string;
  notes?: string;
  created_at: string;
}
