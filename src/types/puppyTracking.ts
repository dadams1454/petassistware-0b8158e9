
import { WeightUnit } from './common';

// Puppy with age information
export interface PuppyWithAge {
  id: string;
  litter_id?: string;
  name?: string;
  gender?: string;
  color?: string;
  status?: string;
  birth_date?: string;
  photo_url?: string;
  notes?: string;
  ageInDays: number;
  ageInWeeks: number;
  developmentalStage: string;
  currentWeight?: string | number;
  weightUnit?: string;
}

// Puppy age group data
export interface PuppyAgeGroupData {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  description?: string;
  color?: string;
  milestones?: string;
  careChecks?: string[];
}

// Puppy management statistics
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  ageGroups: PuppyAgeGroupData[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  isLoading: boolean;
  error: any;
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
  byStatus: Record<string, number>;
  byAgeGroup: Record<string, number>;
  totalCount?: number;
  byAge?: Record<string, number>;
  byColor?: Record<string, number>;
  stats?: any;
}

// Puppy milestone
export interface PuppyMilestone {
  id?: string;
  puppy_id: string;
  title: string;
  milestone_type: string;
  expected_age_days?: number;
  description?: string;
  is_completed: boolean;
  completion_date?: string;
  category?: string;
  notes?: string;
  created_at?: string;
}

// Milestone category
export interface MilestoneCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

// Vaccination schedule
export interface VaccinationSchedule {
  id?: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name?: string;
  due_date: string;
  scheduled_date?: string;
  administered: boolean;
  notes?: string;
  created_at?: string;
}

// Vaccination record
export interface VaccinationRecord {
  id?: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  lot_number?: string;
  administered_by?: string;
  notes?: string;
  created_at?: string;
}

// Socialization category
export type SocializationCategory = 
  | 'people'
  | 'dogs'
  | 'animals'
  | 'environments'
  | 'surfaces'
  | 'sounds'
  | 'objects';

// Socialization category option
export interface SocializationCategoryOption {
  id: string;
  name: string;
  description: string;
  color: string;
  examples: string[];
  value?: string;
  label?: string;
}

// Socialization reaction type
export type SocializationReactionType =
  | 'positive'
  | 'neutral'
  | 'cautious'
  | 'fearful'
  | 'aggressive'
  | 'avoidant'
  | 'curious'
  | 'excited'
  | 'very_positive'
  | 'very_fearful';

// Socialization reaction option
export interface SocializationReactionOption {
  id?: string;
  value: SocializationReactionType;
  label: string;
  name?: string;
  color?: string;
  description?: string;
}

// Socialization experience
export interface SocializationExperience {
  id?: string;
  puppy_id: string;
  category: SocializationCategory;
  categoryName?: string;
  experience: string;
  experience_date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at?: string;
  experience_type?: string;
}

// Socialization progress
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

// Weight record
export interface WeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at: string;
  percent_change?: number;
  age_days?: number;
  unit?: WeightUnit;
}
