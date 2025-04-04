
// Puppy tracking related types

import { WeightUnit } from '@/types/common';

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
  color?: string; // Adding for compatibility with existing code
}

export interface SocializationCategoryOption {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  color?: string; // Adding for compatibility with existing code
}

export interface SocializationReactionOption {
  id: string;
  type: SocializationReactionType;
  name: string;
  description?: string;
  color: string;
  emoji: string;
  value?: string; // Adding for compatibility with existing code
}

export interface SocializationProgress {
  categoryId: string;
  category: string;
  total: number;
  completed: number;
  percentage: number;
  // For backwards compatibility
  completion_percentage?: number;
  count?: number;
  target?: number;
  categoryName?: string;
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
  // For backwards compatibility
  experience?: string;
  experience_date?: string;
  experience_type?: string;
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

// Add weight record type since it's referenced from other modules
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}

// Add vaccination schedule types
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccine_name: string;
  due_date: string;
  administered: boolean;
  administered_date?: string;
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
  created_at: string;
}

// Add puppy milestone for hooks
export interface PuppyMilestone {
  id?: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  title?: string;
  notes?: string;
  created_at?: string;
  is_completed?: boolean;
}

// Re-export WeightUnit to ensure it's available to importers
export type { WeightUnit };
