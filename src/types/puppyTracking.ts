
/**
 * Puppy tracking type definitions
 */
import { Puppy } from './puppy';
import { WeightRecord } from './weight';
import { WeightUnit } from './weight-units';

/**
 * Puppy with age data
 */
export interface PuppyWithAge extends Puppy {
  age?: number;                  // For backward compatibility
  age_days?: number;             // For backward compatibility
  ageInDays: number;             // Canonical field
  ageInWeeks: number;            // Canonical field
  ageDescription?: string;       // Human-readable age description
  weightHistory?: WeightRecord[]; // Weight history for this puppy
}

/**
 * Puppy age group identifier
 */
export type PuppyAgeGroup = 
  | 'newborn'
  | 'twoWeek'
  | 'fourWeek'
  | 'sixWeek'
  | 'eightWeek'
  | 'tenWeek'
  | 'twelveWeek'
  | 'older'
  | 'all';

/**
 * Age group information
 */
export interface PuppyAgeGroupInfo {
  id: PuppyAgeGroup;
  name: string;
  groupName: string;
  ageRange: string;
  description: string;
  startDay: number;
  endDay: number;
  color: string;
  milestones: string[];
  minAge: number;
  maxAge: number;
}

/**
 * Data structure for puppies by age group
 */
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

/**
 * Puppy management statistics
 */
export interface PuppyManagementStats {
  // Core data
  puppies: PuppyWithAge[];
  totalPuppies: number;
  
  // Age grouping data
  ageGroups: PuppyAgeGroupInfo[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  byAgeGroup: PuppyAgeGroupData;
  
  // Status counts
  byStatus: Record<string, number>;
  byGender: Record<string, number>;
  
  // Named counts for easier access
  activeCount: number;
  reservedCount: number;
  availableCount: number;
  soldCount: number;
  
  // Legacy properties
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  
  // Utility values
  currentWeek: number;
  
  // State
  isLoading: boolean;
  error: any;
  refetch: () => Promise<any>;
  
  // Extended statistics
  total: {
    count: number;
    male: number;
    female: number;
  };
}

/**
 * Puppy milestone data
 */
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  category?: string;
  expected_age_days?: number;
  actual_age_days?: number;
  completion_date?: string;
  description?: string;
  title?: string;
  is_completed?: boolean;
  photo_url?: string;
}

/**
 * Vaccination schedule item
 */
export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at: string;
  administered?: boolean;
  administered_date?: string;
}

/**
 * Vaccination record
 */
export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
  administered_by?: string;
  lot_number?: string;
  created_at: string;
}

/**
 * Socialization category
 */
export interface SocializationCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  targetCount?: number;
  examples?: string[];
}

/**
 * Socialization category option
 */
export interface SocializationCategoryOption {
  value: string;
  label: string;
  description?: string;
  id?: string;
}

/**
 * Socialization reaction option
 */
export interface SocializationReactionOption {
  value: string;
  label: string;
  description?: string;
  id?: string;
  color?: string;
}

// Export SocializationReactionType for backward compatibility
export type SocializationReactionType = string;

// Export SocializationReaction for backward compatibility
export type SocializationReaction = SocializationReactionOption;

/**
 * Socialization experience type
 */
export type SocializationExperience = {
  id: string;
  category: string;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  puppy_id: string;
  created_at: string;
  experience_type?: string;
};

/**
 * Socialization progress interface
 */
export interface SocializationProgress {
  category: string;
  total: number;
  completed: number;
  percentage: number;
}

// Export a copy of WeightRecord type for backward compatibility
export type WeightRecord = {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
};
