
import { WeightUnit } from './common';

// Puppy type with age information
export interface PuppyWithAge {
  id: string;
  name?: string;
  gender?: string;
  color?: string;
  birth_date?: string;
  litter_id: string;
  status?: string;
  microchip_number?: string;
  photo_url?: string;
  current_weight?: string;
  weight_unit?: string;
  
  // Age properties
  age?: number;
  ageInDays?: number;
  ageInWeeks?: number;
  developmentalStage?: string;
  weightHistory?: any[];
  
  // Additional properties for backward compatibility
  age_days?: number;
  age_weeks?: number;
}

// Age group definition for puppy management
export interface PuppyAgeGroupData {
  id: string;
  name: string;
  range?: string;
  ageRange: [number, number];
  startDay: number;
  endDay: number;
  developmentalPhase?: string;
  description?: string;
  milestones?: string[] | string;
  color: string;
  puppies?: PuppyWithAge[];
  count?: number;
  careChecks?: string[];
}

// Puppy statistics organized by age groups
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  ageGroups: PuppyAgeGroupData[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  totalPuppies: number;
  
  // Status counts
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  
  // For backward compatibility
  activeCount: number;
  availableCount: number;
  reservedCount: number;
  soldCount: number;
  currentWeek: number;
  
  // Breakdown counts
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  byStatus: {
    available: number;
    reserved: number;
    sold: number;
    unavailable: number;
  };
  byAgeGroup: Record<string, PuppyWithAge[]>;
  
  // Status flags
  isLoading: boolean;
  error: any;
  
  // For totals
  total: {
    count: number;
    male: number;
    female: number;
  };
}

// Puppy milestone
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date?: string;
  is_completed?: boolean;
  title?: string;
  notes?: string;
  
  // Additional fields for compatibility
  milestone_category?: string;
  category?: string;
  expected_age_days?: number;
  actual_age_days?: number;
  completion_date?: string;
  description?: string;
  created_at?: string;
  created_by?: string;
  photo_url?: string;
}

// Puppy weight chart data
export interface PuppyWeightChartData {
  age: number;
  weight: number;
  date: string;
}

// Socialization category type
export type SocializationCategory = 
  | 'people'
  | 'animals'
  | 'environments'
  | 'sounds'
  | 'surfaces'
  | 'handling'
  | 'objects';

// Enriched socialization category
export interface SocializationCategoryEnriched {
  id: string;
  name: string;
  color?: string;
  description?: string;
  examples?: string[];
}

// Socialization reaction type
export type SocializationReactionType = 
  | 'very_positive'
  | 'positive'
  | 'neutral'
  | 'curious'  
  | 'fearful';

// Socialization category option
export interface SocializationCategoryOption {
  id: string;
  name: string;
  value: string;
  label: string;
  color?: string;
  examples?: string[];
  description?: string;
}

// Socialization reaction option
export interface SocializationReactionOption {
  id: string;
  name: string;
  value: SocializationReactionType;
  label: string;
  color: string;
  emoji?: string;
}

// Socialization record
export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: SocializationCategory | SocializationCategoryEnriched;
  experience: string;
  experience_date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at: string;
}

// Socialization progress stats
export interface SocializationProgress {
  total: number;
  completed: number;
  positive: number;
  neutral: number;
  negative: number;
  categoryName?: string;
  category?: string;
  count?: number;
  target?: number;
  completion_percentage?: number;
  id?: string;
}

// Export types using 'export type' for isolatedModules compatibility
export type { WeightRecord } from './health';

// Vaccination Schedule type
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  scheduled_date?: string;
  administered?: boolean;
  notes?: string;
  vaccine_name?: string;
  created_at?: string;
}

// Vaccination Record type
export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  date: string;
  administered_by?: string;
  notes?: string;
  created_at: string;
}

// Export for SocializationExperience compatibility
export type SocializationExperience = SocializationRecord;
