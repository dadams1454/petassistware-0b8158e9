
// Define standard types used throughout the puppy tracking features

export interface PuppyManagementStats {
  totalPuppies: number;
  totalLitters: number;
  activeLitters: number;
  availablePuppies: number;
  reservedPuppies: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
  puppiesByAgeGroup: Record<string, number>;
  weightCompletionRate: number;
  vaccinationCompletionRate: number;
}

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  description: string;
  color: string;
  milestones: string;
  careChecks: string[];
  // These are for runtime tracking, not data definition
  minAge?: number;
  maxAge?: number;
  count?: number;
  puppies?: any[];
}

export interface SocializationCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  examples?: string[];
  importance?: "high" | "medium" | "low";
}

export interface SocializationReaction {
  id: string;
  name: string;
  color: string;
  description: string;
}

export type SocializationReactionType = 
  | "curious"
  | "neutral"
  | "cautious"
  | "fearful"
  | "excited"
  | "positive"
  | "negative";

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at: string;
  updated_at?: string;
  // For backward compatibility
  category_id?: string;
  experience_date?: string;
}

export interface SocializationProgress {
  categoryId: string;
  categoryName: string;
  total: number;
  completed: number;
  percentage: number;
  // For backward compatibility with snake_case naming
  category_id?: string;
  completion_percentage?: number;
  count?: number;
  target?: number;
}

export interface PuppyVaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  vaccination_date?: string; // Added to fix errors
  is_completed?: boolean; // Added to fix errors
  notes?: string;
  created_at?: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  lot_number?: string;
  administered_by?: string;
  notes?: string;
  created_at?: string;
}

// Export PuppyMilestone to fix import errors
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at?: string;
}

// Alias for backward compatibility
export type VaccinationScheduleItem = PuppyVaccinationSchedule;

export interface WeightRecord {
  id: string;
  puppy_id?: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  percent_change?: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
  // For backward compatibility
  age_days?: number;
  birth_date?: string;
}

export type WeightUnit = 'oz' | 'g' | 'lbs' | 'kg' | 'lb';

// Re-export PuppyWithAge from litter.ts to fix imports
export { PuppyWithAge } from './litter';

// Re-export WeightUnit for backward compatibility
export { DEFAULT_AGE_GROUPS } from '@/data/puppyAgeGroups';
