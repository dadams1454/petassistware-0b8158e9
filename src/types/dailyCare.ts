
export interface DogCareStatus {
  dog_id: string;
  dog_name: string;
  dog_photo: string;
  breed: string;
  color: string;
  sex: string;
  last_care: string;
  flags: string[];
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
