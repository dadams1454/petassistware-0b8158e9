
import { Puppy } from '@/components/litters/puppies/types';
import { WeightUnit } from '@/types/common';

export interface PuppyWithAge extends Puppy {
  age?: number;
  ageInWeeks?: number;
  ageInDays?: number;
  ageGroup?: string;
  developmentalStage?: string;
  weightHistory?: PuppyWeightRecord[];
}

export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  age_days?: number;
  notes?: string;
  created_at: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For compatibility with older code
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
  formatted_date?: string;
}

export interface PuppyChartData {
  age: number;
  weight: number;
  weightUnit: string;
  date: string;
}

export interface PuppyAgeGroup {
  id: string;
  name: string;
  ageRangeStart: number;
  ageRangeEnd: number;
  description?: string;
  color: string;
}

export interface PuppyAgeGroupData {
  ageGroup: PuppyAgeGroup;
  puppies: PuppyWithAge[];
}

export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  maleCount: number;
  femaleCount: number;
  averageWeight?: number;
  weightUnit?: string;
  youngestAge?: number;
  oldestAge?: number;
  upcomingVaccinations?: number;
  // Dashboard-specific fields
  puppies?: PuppyWithAge[];
  ageGroups?: PuppyAgeGroup[];
  puppiesByAgeGroup?: PuppyAgeGroupData[];
  isLoading?: boolean;
  error?: Error | null;
}

// Socialization Types
export interface SocializationCategory {
  id: string;
  name: string;
  color?: string;
  description?: string;
  examples?: string[];
}

export interface SocializationCategoryOption {
  id: string;
  value: string;
  label: string;
  color: string;
}

export type SocializationReactionType = 
  | 'very_positive'
  | 'positive'
  | 'neutral'
  | 'cautious'
  | 'fearful'
  | 'very_fearful';

export interface SocializationReaction {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface SocializationReactionObject {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface SocializationReactionOption {
  id: string;
  name: string;
  value: string;
  label: string;
  color: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience_type?: string;
  experience: string;
  experience_date: string | Date;
  reaction: string;
  notes?: string;
  created_at: string;
}

export interface SocializationProgress {
  category: string;
  categoryName: string;
  count: number;
  target: number;
  completion_percentage: number;
}

// Add missing SocializationRecord type
export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  experience_date: string;
  reaction: string;
  notes?: string;
  created_at: string;
  categoryName?: string;
  reactionName?: string;
  reactionColor?: string;
  reactionEmoji?: string;
}

// Add missing PuppyMilestone type
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  title: string;
  milestone_type: string;
  milestone_category?: string;
  expected_age_days: number;
  description?: string;
  is_completed: boolean;
  completion_date?: string;
  actual_age_days?: number;
  notes?: string;
  photo_url?: string;
  created_at: string;
}

// Add missing VaccinationScheduleItem and VaccinationRecord types
export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name: string;
  scheduled_date: string;
  due_date: string;
  administered: boolean;
  notes?: string;
  created_at: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name: string;
  administration_date: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
  created_at: string;
}

export type VaccinationSchedule = VaccinationScheduleItem;
