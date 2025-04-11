
/**
 * Puppy tracking type definitions
 */
import { WeightUnit } from './weight-units';
import { WeightRecord } from './weight';

/**
 * Interface for puppy with age information
 */
export interface PuppyWithAge {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
  color?: string;
  status?: string;
  litter_id?: string;
  photo_url?: string;
  age_days?: number;
  ageInDays?: number;
  ageInWeeks?: number;
  ageDescription?: string;
  // Additional optional fields
  birth_weight?: string;
  current_weight?: string;
  microchip_number?: string;
  akc_registration_number?: string;
  akc_litter_number?: string;
  reservation_date?: string;
  // Additional fields may be present
  [key: string]: any;
}

/**
 * Extended PuppyAgeGroup interface with additional properties
 */
export interface PuppyAgeGroupInfo {
  id: string;
  name: string;
  groupName: string;
  displayName: string;
  ageRange: string;
  description: string;
  startDay: number;
  endDay: number;
  minDays: number;
  maxDays: number;
  unit: string;
  color: string;
  milestones: string[];
  minAge: number;
  maxAge: number;
}

/**
 * Type for identifying puppy age groups
 */
export type PuppyAgeGroup = PuppyAgeGroupInfo | 'newborn' | 'twoWeek' | 'fourWeek' | 'sixWeek' | 'eightWeek' | 'tenWeek' | 'twelveWeek' | 'older';

/**
 * Interface for grouped puppies by age
 */
export interface PuppyAgeGroupData {
  newborn: PuppyWithAge[];
  twoWeek: PuppyWithAge[];
  fourWeek: PuppyWithAge[];
  sixWeek: PuppyWithAge[];
  eightWeek: PuppyWithAge[];
  tenWeek: PuppyWithAge[];
  twelveWeek: PuppyWithAge[];
  older: PuppyWithAge[];
  all: PuppyWithAge[];
  total: number;
}

/**
 * Interface for puppy management stats
 */
export interface PuppyManagementStats {
  // Core data
  puppies: PuppyWithAge[];
  totalPuppies: number;
  
  // Age grouping data
  ageGroups: PuppyAgeGroupInfo[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  byAgeGroup: PuppyAgeGroupData;
  
  // Status counts
  byStatus: Record<string, number>;
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  
  // Named counts for easier access
  activeCount: number;
  reservedCount: number;
  availableCount: number;
  soldCount: number;
  
  // Legacy properties
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  
  // Added missing properties
  maleCount: number;
  femaleCount: number;
  puppiesByStatus: Record<string, PuppyWithAge[]>;
  
  // Utility values
  currentWeek: number;
  
  // State
  isLoading: boolean;
  error: any;
  refetch: () => Promise<any>;
  
  // Extended statistics
  total: {
    count: number;
    male: number;
    female: number;
  };
}

/**
 * Puppy milestone interface
 */
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  title: string;
  description?: string;
  is_completed: boolean;
  completionDate?: string;
  expectedAgeDays?: number;
  created_at?: string;
  notes?: string;
}

/**
 * Vaccination schedule item
 */
export interface VaccinationScheduleItem {
  id: string;
  vaccinationType: string;
  dueDate: string;
  ageInWeeks: number;
  description: string;
  administered?: boolean;
}

/**
 * Vaccination record
 */
export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccinationType: string;
  vaccinationDate: string;
  administeredBy: string;
  notes?: string;
  created_at: string;
}
