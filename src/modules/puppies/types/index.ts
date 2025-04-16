
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
  age_weeks?: number;
  age_description?: string;
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
  sort_order: number;
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
