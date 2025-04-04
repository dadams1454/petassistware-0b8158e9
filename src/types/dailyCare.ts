
export interface CareTaskPreset {
  id: string;
  task_name: string;
  category: string;
  is_default: boolean;
  breeder_id?: string;
  created_at: string;
  usage_count: number;
}

export interface DailyCareSummary {
  dog_id: string;
  dog_name: string;
  breed: string;
  lastCareActivity?: CareActivity;
  caredForToday: boolean;
  flags?: DogFlag[];
  needsAttention: boolean;
}

export interface CareActivity {
  id: string;
  dog_id: string;
  activity_type: string;
  category: string;
  task_name: string;
  timestamp: string;
  performed_by?: string;
  notes?: string;
  created_at: string;
}

export interface CareLogFormData {
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
  flags?: DogFlag[];
}

export interface DogFlag {
  type: 'in_heat' | 'special_attention' | 'incompatible' | 'other';
  value?: string;
  incompatible_with?: string[];
}

export interface BreedingStatus {
  status: 'intact' | 'in_heat' | 'pregnant' | 'nursing' | 'spayed' | 'neutered';
  status_since?: string;
  next_heat?: string;
  days_until_next_heat?: number;
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
  flags?: DogFlag[];
  incompatible_with?: string[];
  dog_weight?: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  created_at: string;
}

export interface PottyBreakSession {
  id: string;
  session_time: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export interface PottyBreakDog {
  id: string;
  dog_id: string;
  session_id: string;
  created_at: string;
}

export interface CareLog {
  id: string;
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
  created_at: string;
  created_by: string;
}

// Daily Care Log (for compatibility)
export interface DailyCarelog {
  id: string;
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
  created_at: string;
  created_by: string;
}

// Care Log Entry for display
export interface CareLogEntry {
  id: string;
  dog_id: string;
  dog_name: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

// Activity Log for history
export interface CareActivityLog {
  id: string;
  dog_id: string;
  activity_type: string;
  timestamp: string;
  notes?: string;
  created_at: string;
  created_by: string;
}

// Special Conditions
export interface DogSpecialCondition {
  id: string;
  dog_id: string;
  condition_type: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  created_at: string;
}
