
export interface FacilityArea {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface FacilityTask {
  id: string;
  name: string;
  description: string | null;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
  custom_days: number[] | null;
  area_id: string | null;
  created_at: string;
  active: boolean;
  assigned_to: string | null;
  last_generated: string | null;
  next_due: string | null;
  facility_areas?: FacilityArea | null;
}

export interface FacilityTaskLog {
  id: string;
  task_id: string;
  completed_by: string;
  completed_at: string;
  notes: string | null;
  status: 'completed' | 'skipped' | 'requires_attention';
  created_at: string;
  photo_url: string | null;
  follow_up_required: boolean;
  initials?: string;
  verified_by?: string;
}

export interface DailyChecklistSubmission {
  id: string;
  date: string;
  completed_by: string;
  verified_by: string | null;
  comments: string | null;
  created_at: string;
  tasks: {
    task_id: string;
    completed: boolean;
    initials: string;
    time: string;
  }[];
}

export interface FacilityStaff {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
}
