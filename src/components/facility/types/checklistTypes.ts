
import { FacilityArea, FacilityTask } from '@/types/facility';

export interface ChecklistTask {
  id: string;
  name: string;
  description?: string | null;
  frequency: string;
  area_id?: string | null;
  custom_days?: number[] | null;
  active?: boolean;
  created_at?: string;
  
  // Properties needed for checklist
  completed: boolean;
  initials: string;
  time: string;
  staffId?: string | null;

  // These were missing and causing errors
  assigned_to?: string | null;
  last_generated?: string | null;
  next_due?: string | null;
}

export interface ChecklistArea {
  name: string;
  id: string;
  tasks: ChecklistTask[];
}

export interface FacilityStaff {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
}
