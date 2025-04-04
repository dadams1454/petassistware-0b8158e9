
// Puppy tracking related types

import { WeightUnit } from './common';

// Puppy with age information
export interface PuppyWithAge {
  id: string;
  name: string;
  birth_date?: string;
  ageInDays?: number;
  ageInWeeks?: number;
  age_days?: number;
  age_weeks?: number;
  age?: number;
  litter_id?: string;
  gender?: string;
  color?: string;
  status?: string;
  photo_url?: string;
  microchip_number?: string;
  birth_weight?: number;
  birth_weight_unit?: WeightUnit;
  current_weight?: number;
  current_weight_unit?: WeightUnit;
  sale_price?: number;
  is_sold?: boolean;
  is_available?: boolean;
  is_reserved?: boolean;
  customer_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Age group data
export interface PuppyAgeGroup {
  id: string;
  name: string;
  description?: string;
  minAge: number;
  maxAge: number;
  unit: 'days' | 'weeks' | 'months';
  startDay?: number;
  endDay?: number;
  milestones?: string;
}

// Mapping of age groups to puppies
export interface PuppyAgeGroupData {
  [ageGroupId: string]: PuppyWithAge[];
}

// Stats for puppy management dashboard
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  totalPuppies: number;
  ageGroups: PuppyAgeGroup[];
  puppiesByAgeGroup: PuppyAgeGroupData;
  byAgeGroup: PuppyAgeGroupData;
  
  // Status counts
  activeCount?: number;
  availableCount?: number;
  reservedCount?: number;
  soldCount?: number;
  
  // Original property names (for backward compatibility)
  availablePuppies?: number;
  reservedPuppies?: number;
  soldPuppies?: number;
  
  // Extended statistics
  total?: {
    count: number;
    male: number;
    female: number;
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
    [key: string]: number;
  };
  
  // Current week (for timeline view)
  currentWeek?: number;
  
  // Loading and error states
  isLoading?: boolean;
  error?: any;
}

// Add socialization types that were missing
export type SocializationReactionType = 'positive' | 'neutral' | 'negative' | 'fearful' | 'curious';

export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface SocializationCategoryOption {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
}

export interface SocializationReactionOption {
  id: string;
  type: SocializationReactionType;
  name: string;
  description?: string;
  color: string;
  emoji: string;
}

export interface SocializationProgress {
  categoryId: string;
  category: string;
  total: number;
  completed: number;
  percentage: number;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  date: string;
  category: string;
  stimulus: string;
  reaction: SocializationReactionType;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  date: string;
  care_type: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}
