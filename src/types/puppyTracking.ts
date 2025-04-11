
/**
 * Puppy tracking type definitions
 */
import { WeightUnit } from './weight-units';

/**
 * Interface for puppy with age information
 */
export interface PuppyWithAge {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
  color?: string;
  status?: string;
  litter_id?: string;
  photo_url?: string;
  age_days?: number;
  ageInDays?: number;
  ageInWeeks?: number;
  ageDescription?: string;
  // Additional optional fields
  birth_weight?: string;
  current_weight?: string;
  microchip_number?: string;
  akc_registration_number?: string;
  akc_litter_number?: string;
  reservation_date?: string;
  // Additional fields may be present
  [key: string]: any;
}

/**
 * Type for identifying puppy age groups
 */
export type PuppyAgeGroup = PuppyAgeGroupInfo;

/**
 * Interface for detailed information about puppy age groups
 */
export interface PuppyAgeGroupInfo {
  id: string;
  name: string;
  groupName: string;
  displayName: string;
  ageRange: string;
  description: string;
  startDay: number;
  endDay: number;
  minDays: number;
  maxDays: number;
  unit: string;
  color: string;
  milestones: string[];
  minAge: number;
  maxAge: number;
}

/**
 * Interface for grouped puppies by age
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
  total: number;
}

/**
 * Interface for puppy management stats - complete with all required properties
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
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  
  // Named counts for easier access
  activeCount: number;
  reservedCount: number;
  availableCount: number;
  soldCount: number;
  
  // Required properties
  maleCount: number;
  femaleCount: number;
  puppiesByStatus: Record<string, PuppyWithAge[]>;
  
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
 * Puppy milestone interface
 */
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  title: string;
  description?: string;
  is_completed: boolean;
  completionDate?: string;
  expectedAgeDays?: number;
  created_at?: string;
  notes?: string;
  category?: string;
}

/**
 * Vaccination schedule item
 */
export interface VaccinationScheduleItem {
  id: string;
  vaccinationType: string;
  dueDate: string;
  ageInWeeks: number;
  description: string;
  administered?: boolean;
  notes?: string;
}

/**
 * Vaccination record
 */
export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccinationType: string;
  vaccinationDate: string;
  administeredBy: string;
  notes?: string;
  created_at: string;
}

/**
 * Socialization category
 */
export interface SocializationCategory {
  id: string;
  category: string;
  displayName: string;
  description: string;
  targetCount: number;
}

/**
 * Socialization category option
 */
export interface SocializationCategoryOption {
  id: string;
  category: string;
  displayName: string;
  description: string;
  examples: string[];
  targetCount: number;
}

/**
 * Socialization reaction type
 */
export type SocializationReactionType =
  | 'positive'
  | 'neutral'
  | 'cautious'
  | 'fearful'
  | 'very_positive'
  | 'very_fearful';

/**
 * Socialization reaction
 */
export interface SocializationReaction {
  id: string;
  type: SocializationReactionType;
  description: string;
  color: string;
}

/**
 * Socialization reaction option
 */
export interface SocializationReactionOption {
  id: string;
  type: SocializationReactionType;
  description: string;
  label: string;
  value: string;
}

/**
 * Socialization experience
 */
export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  reaction: SocializationReactionType;
  notes?: string;
  created_at: string;
  date: string;
}

/**
 * Socialization progress
 */
export interface SocializationProgress {
  category: string;
  categoryName: string;
  total: number;
  completed: number;
  percentage: number;
  count: number;
  target: number;
  completion_percentage: number;
}
