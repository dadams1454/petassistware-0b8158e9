
import { FacilityArea, FacilityTask } from '@/types/facility';

export interface ChecklistTask extends FacilityTask {
  completed: boolean;
  initials: string;
  time: string;
}

export interface ChecklistArea {
  name: string;
  id: string;
  tasks: ChecklistTask[];
}
