
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
  | 'first_crawl'
  | 'standing'
  | 'walking'
  | 'first_walk'
  | 'full_mobility'
  | 'first_bark'
  | 'first_solid_food'
  | 'first_food'
  | 'fully_weaned'
  | 'first_vaccination'
  | 'microchipped'
  | 'temperament_test'
  | 'deworming'
  | 'socialization_started'
  | 'teeth_eruption'
  | 'grooming_start'
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
