
/**
 * Core type definitions for puppies module
 */

import { BaseEntity } from '@/types/core';

/**
 * Extended Puppy interface with age calculations
 */
export interface PuppyWithAge {
  id: string;
  name: string;
  litter_id: string;
  gender: string;
  color: string;
  collar_color?: string;
  birth_weight?: number;
  birth_weight_unit?: string;
  birthdate: string;
  birth_date?: string; // For compatibility with some components
  status: string;
  markings?: string;
  microchip_id?: string;
  notes?: string;
  photo_url?: string;
  reserve_status?: string;
  customer_id?: string;
  created_at: string;
  updated_at?: string;
  
  // Age-related calculated fields
  age_days?: number;
  ageInDays?: number; // For compatibility with some components
  age_weeks?: number;
  ageInWeeks?: number; // For compatibility with some components
  age_description?: string;
  ageDescription?: string; // For compatibility with some components
  weight_current?: number;
  weight_unit?: string;
}

/**
 * Puppy age group definitions
 */
export interface PuppyAgeGroup {
  id: string;
  name: string;
  description?: string;
  min_days: number;
  max_days: number;
  sort_order: number; // Added sort_order property for sorting
  groupName?: string; // For compatibility with some components
  displayName?: string;
  ageRange?: string;
  startDay?: number;
  endDay?: number;
  minDays?: number; // For compatibility with min_days
  maxDays?: number; // For compatibility with max_days
  unit?: string;
  color?: string;
  milestones?: string[];
  minAge?: number;
  maxAge?: number;
}

/**
 * Age group info with puppies
 */
export interface PuppyAgeGroupInfo {
  id: string;
  name: string;
  description?: string;
  min_days: number;
  max_days: number;
  sort_order: number;
  puppies: PuppyWithAge[];
}

/**
 * Grouped puppy data structure
 */
export interface PuppyAgeGroupData {
  byAgeGroup: Record<string, PuppyWithAge[]>;
  ageGroups: PuppyAgeGroup[];
  allPuppies: PuppyWithAge[];
}

/**
 * Overall puppy management statistics
 */
export interface PuppyManagementStats {
  totalPuppies: number;
  byAgeGroup: Record<string, PuppyWithAge[]>;
  byStatus: Record<string, PuppyWithAge[]>;
  byGender: Record<string, PuppyWithAge[]>;
  ageGroups: PuppyAgeGroup[];
  allPuppies: PuppyWithAge[];
  
  // For compatibility with existing components
  puppies?: PuppyWithAge[];
  isLoading?: boolean;
  loading?: boolean;
  error?: any;
  refetch?: () => Promise<any>;
  
  // Status counts
  activeCount?: number;
  reservedCount?: number;
  availableCount?: number;
  soldCount?: number;
  maleCount?: number;
  femaleCount?: number;
  
  // Status groupings
  puppiesByAgeGroup?: Record<string, PuppyWithAge[]>;
  puppiesByStatus?: Record<string, PuppyWithAge[]>;
  
  // Backward compatibility
  availablePuppies?: number;
  reservedPuppies?: number;
  soldPuppies?: number;
  currentWeek?: number;
  
  // Other stats
  total?: {
    count: number;
    male: number;
    female: number;
  };
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
