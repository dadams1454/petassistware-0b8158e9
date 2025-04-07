
/**
 * Puppy tracking related types and interfaces
 */
import { PuppyWithAge } from './puppy';
import { WeightUnit } from './weight-units';

// Age group definitions
export interface PuppyAgeGroup {
  id: string;
  name: string;
  displayName: string;
  description: string;
  minDays: number;
  maxDays: number;
  unit: 'days' | 'weeks';
  color: string;
  startDay: number;
  endDay: number;
  minAge: number;
  maxAge: number;
  milestones: string[]; // Array of milestone strings
}

// Enhanced info for age groups
export interface PuppyAgeGroupInfo {
  id: string;
  name: string;
  groupName: string;
  ageRange: string;
  description: string;
  startDay: number;
  endDay: number;
  color: string;
  milestones: string[]; // Array of milestone strings
  minAge: number;
  maxAge: number;
}

// Puppies organized by age group
export interface PuppyAgeGroupData {
  newborn: PuppyWithAge[];
  twoWeek: PuppyWithAge[];
  fourWeek: PuppyWithAge[];
  sixWeek: PuppyWithAge[];
  eightWeek: PuppyWithAge[];
  tenWeek: PuppyWithAge[];
  twelveWeek: PuppyWithAge[];
  older: PuppyWithAge[];
  all: PuppyWithAge[];
}

// Complete puppy management statistics
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  totalPuppies: number;
  ageGroups: PuppyAgeGroupInfo[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  byAgeGroup: PuppyAgeGroupData;
  byStatus: {
    available: number;
    reserved: number;
    sold: number;
    unavailable: number;
  };
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  activeCount: number;
  reservedCount: number;
  availableCount: number;
  soldCount: number;
  currentWeek: number;
  
  // Legacy properties
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  isLoading: boolean;
  error: any;
  refetch?: () => void;
  
  // Extended statistics
  total: {
    count: number;
    male: number;
    female: number;
  };
}

// Re-export PuppyWithAge to make it available to importers of this module
export type { PuppyWithAge };

// Socialization types
export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  color?: string;
  icon?: string;
}

export interface SocializationCategoryOption extends SocializationCategory {
  options: string[];
}

export interface SocializationReactionType {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

export interface SocializationReaction {
  id: string;
  type: SocializationReactionType;
  notes?: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  experience: string;
  experience_date: string;
  reaction?: SocializationReaction;
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
  category_id: string;
  category_name: string;
  total_experiences: number;
  positive_experiences: number;
  neutral_experiences: number;
  negative_experiences: number;
  completion_percentage: number;
}

// Puppy milestone type
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  title: string;
  milestone_type: string;
  expected_age_days: number;
  description: string;
  is_completed: boolean;
  completion_date: string;
}

// Vaccination related types
export interface VaccinationScheduleItem {
  id: string;
  vaccination_type: string;
  recommended_age: number;
  is_required: boolean;
  notes?: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  administered?: boolean;
  administered_date?: string;
  notes?: string;
  created_at: string;
}
