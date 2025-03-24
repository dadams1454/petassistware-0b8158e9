
export interface DailyCarelog {
  id: string;
  dog_id: string;
  created_by: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes: string | null;
  created_at: string;
}

export interface CareTaskPreset {
  id: string;
  category: string;
  task_name: string;
  is_default: boolean;
  breeder_id: string | null;
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
  type: 'in_heat' | 'pregnant' | 'incompatible' | 'special_attention' | 'other';
  value?: string;
  incompatible_with?: string[];
}

export interface DogCareStatus {
  dog_id: string;
  dog_name: string;
  dog_photo?: string;
  breed: string;
  color: string;
  sex: string;
  last_care: {
    category: string;
    task_name: string;
    timestamp: string;
  } | null;
  flags: DogFlag[];
  potty_alert_threshold?: number; // Added this property
}
