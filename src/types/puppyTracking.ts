
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
  availablePuppies?: number;
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

export type WeightUnit = 'oz' | 'lb' | 'kg' | 'g' | 'lbs';

// Importing the common weight record from health.ts
export type { WeightRecord, WeightData } from '@/types/health';

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
  color?: string;
  examples?: string[];
  importance?: number;
}

export interface SocializationProgress {
  puppy_id: string;
  category_id: string;
  progress_level: number;
  categoryName?: string;
  completionPercentage?: number;
  count?: number;
  target?: number;
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

export interface SocializationReaction {
  id: string;
  name: string;
  color: string;
  description?: string;
}

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
  administered_by?: string;
  lot_number?: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  name: string;
  due_date: string;
  vaccination_date?: string;
  completed?: boolean;
  vaccination_type?: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
}

// Export the existing puppy age groups to maintain compatibility
export { puppyAgeGroups as DEFAULT_AGE_GROUPS } from '@/data/puppyAgeGroups';
export interface PuppyAgeGroup extends PuppyAgeGroupData {}
