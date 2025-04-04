
import { Puppy } from './litter';

// Make sure to properly export PuppyWithAge
export interface PuppyWithAge extends Puppy {
  ageInDays?: number;
  age_days?: number;
  ageInWeeks?: number;
  age_weeks?: number;
  age?: number;
}

// Define age groups for puppies
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

// Define puppy age group type
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

// Socialization related types
export type SocializationReactionType = 'positive' | 'neutral' | 'negative' | 'fearful' | 'aggressive' | 'unknown';

export interface SocializationReaction {
  id: string;
  type: SocializationReactionType;
  label?: string;
  description: string;
  value?: string; // For compatibility
  icon?: string;
  name?: string;   // Adding for compatibility
  color?: string;  // Adding for compatibility
  emoji?: string;  // Adding for compatibility
}

export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  icon?: string;
  color?: string; // Adding for compatibility
  examples?: string[]; // Adding for compatibility
}

export interface SocializationCategoryOption {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  color?: string; // Adding for compatibility
  examples?: string[]; // Adding for compatibility
}

export interface SocializationReactionOption {
  id: string;
  name: string;
  color: string;
  icon?: string;
  value?: string; // Adding for compatibility
  label?: string; // Adding for compatibility
}

export interface SocializationProgress {
  categoryId: string;
  categoryName: string;
  total: number;
  count: number;
  target: number;
  percentage: number;
  completion_percentage?: number; // For compatibility
  category?: string; // Adding for compatibility
  id?: string; // Adding for compatibility
}

// Puppy care related types
export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  activity_type: string;
  timestamp: string;
  notes?: string;
  performed_by?: string;
  created_at: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  date: string;
  reaction: SocializationReactionType;
  notes?: string;
  created_at: string;
  // Adding for compatibility
  experience_date?: string;
  experience_type?: string;
}

// Weight tracking
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  unit?: string; // For backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number; // For puppy weight tracking
  birth_date?: string; // For age calculation
}

// Puppy milestone
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  title?: string;
  is_completed?: boolean;
  description?: string;
}

// Vaccination types
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  scheduled_date?: string;
  due_date: string;
  administered?: boolean;
  notes?: string;
  created_at: string;
  vaccine_name?: string;
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
