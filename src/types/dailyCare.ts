
import { WeightUnit } from './common';

export interface DogCareStatus {
  dog_id: string;
  dog_name: string;
  dog_photo: string;
  breed: string;
  color: string;
  sex: string;
  last_care: {
    category: string;
    task_name: string;
    timestamp: string;
  };
  flags: DogFlag[];
}

export interface DailyCareSummary {
  dog_id: string;
  total_logs: number;
  last_care_date: string;
  recent_activity_types: string[];
  pending_activities: string[];
  has_flags: boolean;
  flags?: string[];
}

export interface CareLogEntry {
  id: string;
  dog_id: string;
  task_name: string;
  category: string;
  timestamp: string;
  notes?: string;
  created_by: string;
  created_at: string;
  flags?: string[];
}

export interface CareActivityLog {
  id: string;
  dog_id: string;
  activity_type: string;
  timestamp: string;
  notes?: string;
  performed_by?: string;
  created_at: string;
}

export interface DailyCarelog {
  id: string;
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
  created_by: string;
  created_at: string;
  flags?: DogFlag[];
  status?: string;
  type?: string;
}

export interface CareLogFormData {
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
  flags?: DogFlag[];
}

export interface MedicationsLogProps {
  dogId?: string;
  onRefresh?: () => void;
}

export interface MedicationFilterProps {
  activeFilter: string;
  onChange: (filter: string) => void;
  counts?: {
    all: number;
    preventative: number;
    other: number;
  };
}

export interface CareTaskPreset {
  id: string;
  category: string;
  task_name: string;
  created_at: string;
  usage_count: number;
  tenant_id?: string;
}

export interface DogFlag {
  type: string;
  value?: string;
  color?: string;
  icon?: string;
}

export interface DogSpecialCondition {
  type: string;
  value: string;
  notes?: string;
  start_date?: string;
  end_date?: string;
}
