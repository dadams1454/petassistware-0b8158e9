
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
}

export interface PuppyAgeGroupData {
  label: string;
  min_age: number;
  max_age: number;
  puppies: PuppyWithAge[];
}

export interface PuppyManagementStats {
  total: number;
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
}

export interface SocializationReaction {
  id: string;
  name: string;
  description?: string;
  positive: boolean;
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
  name: string;
  category_id: string;
  description?: string;
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
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
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
  upcoming: VaccinationScheduleItem[];
  completed: VaccinationRecord[];
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
}

export interface PuppyWeightRecord extends WeightRecord {
  birth_date?: string;
}
