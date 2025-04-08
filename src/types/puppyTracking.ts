
/**
 * Puppy tracking type definitions
 */
import { Puppy, PuppyWithAge } from './puppy';
import { WeightRecord } from './weight';

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
}

/**
 * Socialization category option
 */
export interface SocializationCategoryOption {
  value: string;
  label: string;
  description?: string;
}

/**
 * Socialization reaction option
 */
export interface SocializationReactionOption {
  value: string;
  label: string;
  description?: string;
}

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
};
