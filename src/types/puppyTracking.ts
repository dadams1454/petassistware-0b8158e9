
import { WeightUnit } from './common';

export interface PuppyAgeGroupData {
  title: string;
  range: string;
  description: string;
  startWeek: number;
  endWeek: number;
  careChecks?: string[];
  developmentMilestones: string;
  commonIssues: string;
  recommendedActions: string;
  puppies: PuppyWithAge[];
}

export interface PuppyAgeGroup {
  id: string;
  name: string;
  start_week: number;
  end_week: number;
  description: string;
  care_items: string[];
  milestones: string[];
  common_issues: string[];
  recommended_actions: string[];
}

export interface PuppyManagementStats {
  totalCount: number;
  byAge: Record<string, number>;
  byStatus: Record<string, number>;
  byGender: Record<string, number>;
  puppies?: PuppyWithAge[];
  ageGroups?: PuppyAgeGroupData[];
  puppiesByAgeGroup?: Record<string, PuppyWithAge[]>;
}

export interface PuppyWithAge {
  id: string;
  name: string;
  litter_id: string;
  gender: string;
  color: string;
  birth_date: string;
  ageInDays: number;
  ageInWeeks: number;
  developmentalStage: string;
  currentWeight?: number;
  weightUnit?: string;
  photo_url?: string;
  notes?: string;
  ageDescription?: string;
  status?: string;
}

export interface SocializationReactionType {
  positive: 'positive';
  neutral: 'neutral';
  negative: 'negative';
  curious: 'curious';
  fearful: 'fearful';
}

export type SocializationCategory = 
  | 'people'
  | 'animals'
  | 'environments'
  | 'surfaces'
  | 'noises'
  | 'objects'
  | 'handling';

export interface SocializationCategoryOption {
  id: string;
  name: string;
  color: string;
  description: string;
  examples: string[];
}

export interface SocializationReactionOption {
  id: string;
  name: string;
  description: string;
  color: string;
  emoji: string;
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
  category: SocializationCategory;
  categoryName: string;
  total: number;
  completed: number;
  positive: number;
  neutral: number;
  negative: number;
  count?: number;
  target?: number;
  completion_percentage?: number;
}

export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  care_type: string;
  care_time: string;
  notes?: string;
  performed_by?: string;
  created_at: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  categoryName?: string;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  title: string;
  milestone_type: string;
  expected_age_days: number;
  description: string;
  is_completed: boolean;
  completion_date: string;
  category?: string;
  notes?: string;
  created_at: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
}

export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name?: string;
  due_date: string;
  administered: boolean;
  scheduled_date?: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccine_name: string;
  administration_date: string;
  lot_number?: string;
  expiry_date?: string;
  notes?: string;
  administered_by?: string;
  created_at: string;
}
