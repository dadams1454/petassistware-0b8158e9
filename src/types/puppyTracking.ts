
import { Puppy } from './litter';
import { WeightUnit } from './common';

// Extend Puppy with age information
export interface PuppyWithAge extends Puppy {
  ageInDays?: number;
  age_days?: number;
  ageInWeeks?: number;
  age_weeks?: number;
  age?: number;
  developmentalStage?: string;
  weightHistory?: WeightRecord[];
  litter?: any;
  currentWeight?: number;
  current_weight?: string;
  current_weight_unit?: string;
  weight_unit?: string;
}

// Define age groups for puppies
export interface PuppyAgeGroup {
  id: string;
  name: string;
  displayName: string;
  description: string;
  minDays: number;
  maxDays: number;
  startDay: number;
  endDay: number;
  minAge: number;
  maxAge: number;
  unit: string;
  color: string;
  milestones?: string;
}

// Define puppy age group data
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

// Define puppy management statistics
export interface PuppyManagementStats {
  totalPuppies: number;
  puppies: PuppyWithAge[];
  ageGroups: PuppyAgeGroup[];
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
  
  // Extended statistics
  total: {
    count: number;
    male: number;
    female: number;
  };
}

// Weight record interface
export interface WeightRecord {
  id: string;
  puppy_id: string;
  dog_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
}

// Socialization types
export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  color?: string;
  examples?: string[];
}

export interface SocializationCategoryOption extends SocializationCategory {
  categoryId?: string;
  value?: string;
  label?: string;
  order?: number;
}

export type SocializationReactionType = 'very_positive' | 'positive' | 'neutral' | 'cautious' | 'fearful' | 'curious' | 'very_fearful' | 'negative';

export interface SocializationReaction {
  id: string;
  type: SocializationReactionType;
  name: string;
  description?: string;
  color: string;
  emoji?: string;
}

export interface SocializationReactionOption extends SocializationReaction {
  value?: string;
  label?: string;
  icon?: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  experience_date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at: string;
}

export interface SocializationProgress {
  categoryId: string;
  categoryName: string;
  count: number;
  total: number;
  percentage: number;
  target?: number;
}

export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  log_type: string;
  log_date: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  weight?: number;
  weight_unit?: WeightUnit;
}

// Vaccination-related types
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  dog_id?: string;
  vaccine_name: string;
  scheduled_date: string;
  due_date?: string;
  administered: boolean;
  administered_date?: string;
  notes?: string;
  created_at?: string;
  vaccination_type?: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  lot_number?: string;
  administered_by?: string;
  notes?: string;
  created_at: string;
}

// Puppy milestone interface
export interface PuppyMilestone {
  id?: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at?: string;
  title?: string;
  is_completed?: boolean;
  description?: string;
  expected_age_days?: number;
  completion_date?: string;
  actual_age_days?: number;
  milestone_category?: string;
  photo_url?: string;
}
