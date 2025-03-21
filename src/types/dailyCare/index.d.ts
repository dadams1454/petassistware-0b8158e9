// If this file doesn't exist yet, we'll create it
// Add the missing CareLog type
export interface CareLog {
  id: string;
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
}

// Ensure DogCareStatus has care_logs property
export interface DogCareStatus {
  dog_id: string;
  dog_name: string;
  gender?: string;
  breed?: string;
  age?: number;
  profile_image_url?: string;
  flags?: DogFlag[];
  care_logs?: CareLog[];
  // Add any other properties that might be in DogCareStatus
}

// Make sure we keep existing types
export interface DailyCarelog {
  id: string;
  dog_id: string;
  user_id: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
  flags?: DogFlag[];
  created_at: string;
}

export interface CareTaskPreset {
  id: string;
  category: string;
  task_name: string;
  user_id: string;
  created_at: string;
}

export interface CareLogFormData {
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: Date;
  notes?: string;
  flags?: DogFlag[];
}

export interface DogFlag {
  type: 'in_heat' | 'incompatible' | 'special_attention' | 'other';
  value?: string;
  incompatible_with?: string[];
}
