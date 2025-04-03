
import { WeightUnit } from './common';

// PuppyAgeGroupData interface for organizing puppies by age group
export interface PuppyAgeGroupData {
  id: string;
  name: string;
  description: string;
  startDay: number;
  endDay: number;
  milestones: string;
  color?: string;
}

// Base puppy interface with age information
export interface PuppyWithAge {
  id: string;
  name: string | null;
  gender: string | null;
  color: string | null;
  birth_date?: string;
  litter_id: string;
  status: string;
  photo_url?: string | null;
  current_weight?: string | null;
  weight_unit?: string | null;
  age_days: number;
  age_in_weeks?: number;
  litters?: {
    id: string;
    name?: string;
    litter_name?: string;
    birth_date?: string;
  };
}

// Interface for puppy management statistics
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  puppiesByAgeGroup: { [key: string]: PuppyWithAge[] };
  ageGroups: PuppyAgeGroupData[];
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  isLoading: boolean;
  error: any;
  // Additional stats for dashboard
  total: {
    count: number;
    male: number;
    female: number;
  };
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  byStatus: {
    [key: string]: number;
  };
  byAgeGroup: {
    [key: string]: number;
  };
}

// Socialization tracking interfaces
export type SocializationReactionType = 
  | 'very_positive'
  | 'positive'
  | 'neutral'
  | 'cautious'
  | 'fearful'
  | 'very_fearful';

export interface SocializationCategory {
  id: string;
  name: string;
}

export interface SocializationCategoryOption {
  id: string;
  name: string;
}

export interface SocializationReaction {
  id: SocializationReactionType;
  name: string;
  positive: boolean;
  color: string;
}

export interface SocializationReactionObject {
  id: string;
  name: string;
  positive: boolean;
  color: string;
}

export interface SocializationReactionOption {
  id: string;
  name: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface SocializationProgress {
  total_experiences: number;
  completed_experiences: number;
  by_category: {
    category: string;
    categoryName: string;
    count: number;
    target: number;
    completion_percentage: number;
  }[];
  overall_percentage: number;
}

// Puppy milestone interfaces
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string | Date;
  notes?: string;
  created_at: string;
}

// Vaccination interfaces
export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at: string;
  scheduled_date?: string;
  administered?: boolean;
  vaccine_name?: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
  created_at?: string;
}

export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at: string;
  scheduled_date: string;
  administered: boolean;
  vaccine_name: string;
}

// Weight tracking interfaces
export interface WeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  age_days?: number;
  percent_change?: number;
  notes?: string;
  created_at: string;
}

export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  age_days?: number;
  percent_change?: number;
  notes?: string;
  created_at: string;
}
