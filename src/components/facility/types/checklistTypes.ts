
import { FacilityArea, FacilityTask } from '@/types/facility';

export interface ChecklistTask extends FacilityTask {
  completed: boolean;
  initials: string;
  time: string;
  staffId?: string | null;
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
