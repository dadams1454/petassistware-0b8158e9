
/**
 * Puppy module type definitions
 */
import { PuppyWithAge, PuppyAgeGroup, PuppyAgeGroupInfo, PuppyAgeGroupData, PuppyManagementStats } from '@/types/puppyTracking';

// Re-export types from puppyTracking.ts for convenience and consistency
export type { 
  PuppyWithAge, 
  PuppyAgeGroup, 
  PuppyAgeGroupInfo, 
  PuppyAgeGroupData, 
  PuppyManagementStats 
};

/**
 * Interface for puppy tracking options
 */
export interface PuppyTrackingOptions {
  includeArchived?: boolean;
  filterByStatus?: string[];
  filterByGender?: string[];
  filterByAgeGroup?: string;
}
