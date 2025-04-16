
import { Puppy } from '@/types/puppy';
import { WeightRecord } from '@/types/weight';

/**
 * Extended puppy interface with age and weight data
 */
export interface PuppyWithAge extends Puppy {
  age?: number;          // Alias for age_days for compatibility
  age_days?: number;     // Age in days
  age_weeks?: number;    // Age in weeks
  ageInDays?: number;    // Legacy compatibility
  ageInWeeks?: number;   // Legacy compatibility
  created_at?: string;   // For compatibility with legacy code
  updated_at?: string;   // For compatibility with legacy code
  weightHistory?: WeightRecord[];
  lastWeight?: WeightRecord;
}

/**
 * Puppy age group information
 */
export interface PuppyAgeGroup {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  description?: string;
}

/**
 * PuppyAgeGroupInfo for compatibility with older components
 */
export interface PuppyAgeGroupInfo {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  description?: string;
  puppies: PuppyWithAge[];
}

/**
 * Group data structure for organizing puppies by age
 */
export interface PuppyAgeGroupData {
  [key: string]: PuppyWithAge[];
}

/**
 * Statistics and data for puppy management
 */
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  byAgeGroup: PuppyAgeGroupData;
  ageGroups?: PuppyAgeGroup[];
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  currentWeek?: number;
  activeCount?: number;
  availableCount?: number;
  reservedCount?: number;
  soldCount?: number;
  total?: {
    count: number;
    male?: number;
    female?: number;
  };
  byGender?: {
    male: number;
    female: number;
    unknown: number;
  };
  byStatus?: {
    available: number;
    reserved: number;
    sold: number;
    unavailable: number;
  };
  isLoading: boolean;
  error: Error | null;
}

/**
 * Options for puppy tracking
 */
export interface PuppyTrackingOptions {
  includeArchived?: boolean;
  filterByStatus?: string[];
  filterByGender?: string[];
  filterByAgeGroup?: string;
}
