
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
}

// Socialization-related types
export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  experienceGoal: number;
  icon?: string;
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
