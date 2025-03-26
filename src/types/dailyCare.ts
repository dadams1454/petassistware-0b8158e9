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
  frequency?: string;
  nextDueDate?: Date;
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
  sex: string; // This field is used in DogNameCell
  last_care: {
    category: string;
    task_name: string;
    timestamp: string;
  } | null;
  flags: DogFlag[];
  // Additional properties used in the application
  potty_alert_threshold?: number;
  requires_special_handling?: boolean;
  dog_weight?: number;
  last_potty_time?: string | null;
  last_feeding_time?: string | null;
  last_medication_time?: string | null;
  last_grooming_time?: string | null;
  last_exercise_time?: string | null;
  last_wellness_time?: string | null;
  last_training_time?: string | null;
  feeding_times_today?: any[];
  potty_times_today?: any[];
  medication_times_today?: any[];
  exercise_times_today?: any[];
  grooming_times_today?: any[];
  wellness_times_today?: any[];
  training_times_today?: any[];
  // Medication specific fields
  medication_frequency?: string;
  medication_next_due_date?: string;
}

export interface MedicationLogFormData extends CareLogFormData {
  frequency: string;
  nextDueDate?: Date;
  medicationType: 'preventative' | 'treatment';
}
