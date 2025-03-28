
export interface Milestone {
  id: string;
  puppy_id: string;
  milestone_type: MilestoneType;
  milestone_date: string | Date;
  notes?: string;
  created_at: string;
}

export type MilestoneType = 
  | 'eyes_open'
  | 'ears_open'
  | 'first_walk'
  | 'full_mobility'
  | 'first_bark'
  | 'first_food'
  | 'fully_weaned'
  | 'custom';

export interface MilestoneOption {
  value: MilestoneType;
  label: string;
  description: string;
  typicalAgeRange: {
    earliestDay: number;
    averageDay: number;
    latestDay: number;
  };
}

export interface MilestoneTrackerProps {
  puppyId: string;
  birthDate?: string | Date | null;
  onMilestoneAdded?: () => void;
}
