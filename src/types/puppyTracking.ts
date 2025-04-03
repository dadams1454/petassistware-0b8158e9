
import { WeightUnit } from './common';

// Base puppy type with age information
export interface PuppyWithAge {
  id: string;
  name: string | null;
  color: string | null;
  gender: string | null;
  birth_date?: string;
  litter_id: string;
  age_days: number;
  age_in_weeks: number;
  microchip_number?: string | null;
  photo_url?: string | null;
  current_weight?: number | null;
  weight_unit?: string | null;
  status: string;
  // Add compatibility fields
  ageInDays?: number;
  age_weeks?: number;
  birth_order?: number;
  litters?: {
    id: string;
    name?: string;
    birth_date: string;
  };
}

// Age group data for puppy tracking
export interface PuppyAgeGroupData {
  id: string;
  name: string;
  description: string;
  startDay: number;
  endDay: number;
  careChecks: string[];
  puppies?: PuppyWithAge[];
  // Add missing property from errors
  milestones?: string[];
  groupName?: string; // For backward compatibility
}

// Statistics for puppy management
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  totalPuppies: number;
  isLoading: boolean;
  error: null | Error;
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  ageGroups: PuppyAgeGroupData[];
  // Common status counts
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  // Additional breakdown stats
  total: {
    count: number;
    male: number;
    female: number;
  };
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  byStatus: Record<string, number>;
  byAgeGroup: Record<string, number>;
  // Extra property used in some components
  stats?: any;
}

// Socialization category
export interface SocializationCategory {
  id: string;
  name: string;
  // Additional properties found in errors
  color?: string;
  description?: string;
  examples?: string[];
}

// Socialization reaction types 
export type SocializationReactionType = 
  | 'positive' 
  | 'neutral' 
  | 'negative' 
  | 'fearful'
  | 'very_positive'  // Additional values from errors
  | 'cautious'  
  | 'very_fearful';

// Socialization reaction
export interface SocializationReaction {
  id: string;
  name: string;
  type: SocializationReactionType;
  // Additional properties from errors
  color?: string;
  description?: string;
}

// Object with reaction and color
export interface SocializationReactionObject extends SocializationReaction {
  color: string;
  description: string;
}

// For dropdown options
export interface SocializationReactionOption {
  id: string;
  name: string;
}

export interface SocializationCategoryOption {
  id: string;
  name: string;
}

// Socialization experience
export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: SocializationCategory | string;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
  experience_type?: string; // From errors
}

// Progress tracking for socialization
export interface SocializationProgress {
  total_experiences: number;
  completed_experiences: number;
  by_category: Record<string, number>;
  overall_percentage: number;
  // Additional properties from errors
  categoryId?: string;
  category?: string;
  categoryName?: string;
  completion_percentage?: number;
  count?: number;
  target?: number;
  id?: string;
}

// Puppy developmental milestones
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  // Additional properties from errors
  category?: string;
  expected_age_days?: number;
  actual_age_days?: number;
  completion_date?: string;
  description?: string;
  title?: string;
}

// Vaccination schedule item
export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at: string;
  vaccination_date?: string; // From errors
}

// Vaccination record
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

// Complete vaccination schedule
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccine_name: string; 
  vaccination_type: string;
  scheduled_date: string;
  due_date: string;
  administered: boolean;
  notes?: string;
  created_at: string;
}

// Weight record for a puppy
export interface WeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at: string;
  // Additional fields based on errors
  age_days?: number;
  percent_change?: number;
  dog_id?: string;
  unit?: WeightUnit;
}

// Type for puppy weight record display
export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  age_days?: number;
  percent_change?: number;
  notes?: string;
  created_at: string;
  unit?: WeightUnit; // Added for compatibility
}

// Safe converter between puppy and health weight records
export const convertToPuppyWeightRecord = (record: any): PuppyWeightRecord => {
  if (!record) {
    throw new Error("Cannot convert null or undefined to PuppyWeightRecord");
  }

  return {
    id: record.id || '',
    puppy_id: record.puppy_id || '',
    weight: typeof record.weight === 'number' ? record.weight : Number(record.weight || 0),
    weight_unit: record.weight_unit || record.unit || 'lb',
    unit: record.weight_unit || record.unit || 'lb', // Added for compatibility
    date: record.date || new Date().toISOString().split('T')[0],
    age_days: record.age_days ? Number(record.age_days) : undefined,
    percent_change: record.percent_change ? Number(record.percent_change) : undefined,
    notes: record.notes,
    created_at: record.created_at || new Date().toISOString()
  };
};

// Add backward compatibility type for AgeGroup
export interface AgeGroup extends PuppyAgeGroupData {
  // Additional fields may be needed
}
