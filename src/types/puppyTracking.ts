
import { WeightUnit } from './common';

export interface PuppyWithAge {
  id: string;
  name: string;
  birth_date: string;
  age_days?: number;
  age_weeks?: number;
  litter_id?: string;
  gender?: string;
  color?: string;
  status?: string;
  photo_url?: string;
  weight_data?: WeightRecord[];
  current_weight?: number | string;
  birth_weight?: number | string;
  weight_unit?: WeightUnit;
  growth_percentage?: number;
  litters?: any; // For related litter data
}

export interface PuppyAgeGroupData {
  id: string; // Unique identifier for age group
  label: string;
  name: string; // Display name
  min_age: number;
  max_age: number;
  startDay: number; // Start day of age range
  endDay: number; // End day of age range
  description?: string;
  puppies: PuppyWithAge[];
  careChecks?: string[];
  milestones?: string[];
}

export interface PuppyManagementStats {
  total: number;
  totalPuppies: number; // Total count of puppies
  availablePuppies: number; // Available puppies count
  reservedPuppies: number; // Reserved puppies count
  soldPuppies: number; // Sold puppies count
  isLoading?: boolean; // Loading state
  error?: Error; // Error state
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
  puppies: PuppyWithAge[];
  ageGroups: PuppyAgeGroupData[];
  puppiesByAgeGroup: { [key: string]: PuppyWithAge[] };
}

export interface SocializationCategory {
  id: string;
  name: string;
  description?: string;
  color?: string; // Color for UI display
  examples?: string[]; // Example experiences
}

export interface SocializationReaction {
  id: string;
  name: string;
  description?: string;
  positive: boolean;
  color?: string; // Color for UI display
}

export interface SocializationReactionObject {
  id: string;
  name: string;
  positive: boolean;
}

export interface SocializationReactionOption {
  value: string;
  label: string;
  positive: boolean;
}

export interface SocializationCategoryOption {
  value: string;
  label: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  name?: string; // Name of experience
  category: string;
  category_id?: string;
  description?: string;
  experience?: string;
  experience_date?: string;
  experience_type?: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface SocializationRecord {
  id: string;
  puppy_id: string;
  experience_date: string;
  experience: string;
  category: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface SocializationProgress {
  total_experiences: number;
  completed_experiences: number;
  by_category: {
    category: string;
    total: number;
    completed: number;
    percentage: number;
  }[];
  overall_percentage: number;
  
  // Fields for UI rendering
  category?: string;
  categoryId?: string;
  categoryName?: string;
  count?: number;
  target?: number;
  completion_percentage?: number;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  title?: string;
  description?: string;
  expected_age_days?: number;
  completion_date?: string;
  is_completed?: boolean;
  category?: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  vaccination_date?: string;
  scheduled_date?: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationSchedule {
  id?: string;
  puppy_id?: string;
  vaccination_type?: string;
  scheduled_date?: string;
  due_date?: string;
  administered?: boolean;
  notes?: string;
  created_at?: string;
  upcoming: VaccinationScheduleItem[];
  completed: VaccinationRecord[];
  vaccine_name?: string;
}

export interface WeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For backward compatibility
  date: string;
  age_days?: number;
  notes?: string;
  created_at: string;
  percent_change?: number;
  birth_date?: string; // For age calculation
}

export interface PuppyWeightRecord extends WeightRecord {
  birth_date?: string;
}

// Type alias for backward compatibility
export type SocializationReactionType = SocializationReaction;
