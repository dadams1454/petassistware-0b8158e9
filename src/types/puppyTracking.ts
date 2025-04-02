
/**
 * Types related to puppy tracking functionality
 */

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  description: string;
  color?: string;
  milestones?: string;
  careChecks?: string[];
}

export interface PuppyManagementStats {
  totalPuppies: number;
  activeLitters: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
}

export interface PuppyWithAge {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  color?: string;
  status?: string;
  photo_url?: string;
  litter_id?: string;
  current_weight?: string;
  ageInDays: number;
  ageInWeeks: number;
  ageDescription: string;
  litters?: any;
}

export type WeightUnit = "lbs" | "kg" | "g" | "oz";

export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
  created_at: string;
}

export interface WeightRecord {
  id: string;
  puppy_id?: string;
  dog_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at: string;
  percent_change?: number;
  age_days?: number;
  formatted_date?: string;
  birth_date?: string;
  unit?: WeightUnit; // For compatibility
}

export interface WeightData extends WeightRecord {
  birth_date?: string;
  age_days?: number;
  formatted_date?: string;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  title?: string;
  description?: string;
  expected_age_days?: number;
  completion_date?: string;
  category?: string;
  target_date?: string;
}

export interface SocializationCategory {
  id: string;
  name: string;
  description?: string;
}

export interface SocializationProgress {
  puppy_id: string;
  category_id: string;
  progress_level: number;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  category_id?: string;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export type SocializationReaction = 'Positive' | 'Neutral' | 'Negative';

export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  vaccination_date?: string;
  notes?: string;
  created_at: string;
  is_completed?: boolean;
  completed?: boolean;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  name: string;
  due_date: string;
  vaccination_date?: string;
  completed?: boolean;
}

// Export the existing puppy age groups to maintain compatibility
export { puppyAgeGroups as DEFAULT_AGE_GROUPS } from '@/data/puppyAgeGroups';
export interface PuppyAgeGroup extends PuppyAgeGroupData {}

