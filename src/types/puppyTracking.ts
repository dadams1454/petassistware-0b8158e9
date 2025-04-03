
import { WeightUnit } from './common';

// Interface for puppy with age calculation
export interface PuppyWithAge {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  color: string;
  birth_date: string;
  litter_id: string;
  microchip_number?: string;
  photo_url?: string;
  current_weight?: string;
  status: 'Available' | 'Reserved' | 'Sold' | 'Unavailable';
  birth_order?: number;
  birth_weight?: string;
  birth_time?: string;
  presentation?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  sale_price?: number;
  notes?: string;
  vaccination_dates?: string;
  deworming_dates?: string;
  vet_check_dates?: string;
  akc_litter_number?: string;
  akc_registration_number?: string;
  health_notes?: string;
  weight_notes?: string;
  
  // Age calculation fields
  age_days: number;
  age_in_weeks: number;
  
  // For backward compatibility
  ageInDays?: number;
  age_weeks?: number;
  
  // For litter relationship
  litters?: {
    id: string;
    name?: string;
    birth_date: string;
    litter_name?: string; // Added for compatibility
  };
  
  // Standard weight unit - important for consistency
  weight_unit?: WeightUnit;
}

// Interface for puppy weight records
export interface WeightRecord {
  id: string;
  puppy_id?: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at: string;
  percent_change?: number;
  
  // For backward compatibility 
  unit?: WeightUnit;
  
  // For age calculation
  age_days?: number;
  birth_date?: string;
}

// Interface for puppy age groups
export interface PuppyAgeGroupData {
  id: string;
  label: string;
  minAge: number;
  maxAge: number;
  description: string;
  color: string;
  
  // Added properties to fix errors
  name: string;
  startDay?: number;
  endDay?: number;
  milestones?: string[];
  careChecks?: any[];
}

// Interface for puppy management statistics
export interface PuppyManagementStats {
  // List of all puppies
  puppies: PuppyWithAge[];
  
  // Age group definitions
  ageGroups: PuppyAgeGroupData[];
  
  // Puppies organized by age group
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  
  // Loading and error states
  isLoading: boolean;
  error: any;
  
  // Count statistics
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  
  // Totals summary statistics
  total: {
    count: number;
    male: number;
    female: number;
  };
  
  // Gender breakdown statistics
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  
  // Status breakdown statistics
  byStatus: Record<string, number>;
  
  // Age group breakdown statistics
  byAgeGroup: Record<string, number>;
  
  // Additional stats property for compatibility
  stats?: {
    totalPuppies: number;
    availablePuppies: number;
    reservedPuppies: number;
    soldPuppies: number;
    byGender: {
      male: number;
      female: number;
      unknown?: number;
    };
    byStatus: Record<string, number>;
    byAgeGroup: Record<string, number>;
  };
}

// Socialization-related types
export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  experienceGoal: number;
  icon?: string;
  color?: string; // Added to fix errors
}

export interface SocializationCategoryOption {
  id: string;
  name: string;
  experiences: string[];
}

export interface SocializationReactionOption {
  id: string;
  name: string;
  type: string;
  color: string;
  description: string;
}

export type SocializationReaction = string;
export type SocializationReactionType = string;

export interface SocializationReactionObject {
  id: string;
  name: string;
  color: string;
}

export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  reaction: string;
  notes?: string;
  date: string;
  created_at: string;
}

export interface SocializationProgress {
  total_experiences: number;
  completed_experiences: number;
  by_category: Record<string, number>;
  overall_percentage: number;
  
  // Added for component compatibility
  categoryName: string;
  category: string;
  count: number;
  target: number;
  completion_percentage: number;
}

// Milestone related interfaces
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  title?: string;
  is_completed?: boolean;
}

// Vaccination related interfaces
export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  administered_by?: string;
  vaccination_date: string;
  lot_number?: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  scheduled_date: string;
  administered: boolean;
  vaccine_name?: string;
}

// Puppy weight tracking record
export interface PuppyWeightRecord extends WeightRecord {
  puppy_id: string;
}
