import { WeightUnit as CommonWeightUnit } from './common';

// Define weight unit type using the common definition
export type WeightUnit = CommonWeightUnit;

export interface PuppyWithAge {
  id: string;
  name?: string;
  birth_date?: string;
  color?: string;
  gender?: string;
  status?: string;
  current_weight?: string;
  litter_id?: string;
  ageInDays: number;
  ageInWeeks: number;
  // For backward compatibility
  age_days?: number;
  age_weeks?: number;
  photo_url?: string; // Add photo_url to avoid errors with PuppyCard component
  created_at?: string;
  updated_at?: string;
  litters?: {
    id: string;
    name?: string;
    birth_date: string;
  };
}

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  ageGroup: string;
  description: string;
  puppies: PuppyWithAge[];
  count: number;
  minDays: number;
  maxDays: number;
  minAge: any;
  maxAge: any;
  milestones: string[];
  color: string;
  startDay?: number;
  endDay?: number;
  careChecks?: any[];
}

export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  activeLitters: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
  // Include any other stats used in your application
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  unit: WeightUnit; // For backward compatibility
  notes?: string;
  created_at: string;
  percent_change?: number;
  age_days?: number;
}

export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name?: string;
  due_date: string;
  scheduled_date?: string;
  administered: boolean;
  notes?: string;
  created_at?: string;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  title?: string;
  milestone_date: string;
  notes?: string;
  created_at?: string;
  is_completed?: boolean;
  category?: string;
}

export interface SocializationCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
  examples?: string[];
}

export type SocializationReactionType = 'positive' | 'neutral' | 'negative' | 'curious' | 'mixed';

export interface SocializationReaction {
  id: string;
  name: string;
  type: SocializationReactionType;
  description?: string;
}

export interface SocializationReactionObject extends SocializationReaction {
  description?: string;
}

export interface SocializationProgress {
  categoryName: string;
  count: number;
  total: number;
  percentage: number;
  // For backward compatibility
  category_name?: string;
  id?: string;
}

// For backward compatibility
export interface AgeGroup {
  id: string;
  name: string;
  ageGroup: string;
  description: string;
  puppies: PuppyWithAge[];
  count: number;
  minDays: number;
  maxDays: number;
  minAge: any;
  maxAge: any;
  milestones: string[];
  color: string;
  startDay?: number;
  endDay?: number;
  careChecks?: any[];
}

// For backward compatibility
export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight_grams: number;
  weight_unit: string;
  weight_date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// For backward compatibility
export interface PuppyHealthRecord {
  id: string;
  puppy_id: string;
  record_type: string;
  title: string;
  description?: string;
  date: string;
  performed_by?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// For backward compatibility
export interface PuppyVaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// For backward compatibility
export interface VaccinationRecord {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// For backward compatibility
export interface PuppyVaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  scheduled_date?: string;
  administered: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// For backward compatibility
export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name?: string;
  due_date: string;
  scheduled_date?: string;
  administered: boolean;
  notes?: string;
  created_at?: string;
}

// For backward compatibility
export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}
