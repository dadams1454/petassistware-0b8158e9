
/**
 * Puppy module type definitions
 */

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
 * Type for identifying puppy age groups
 */
export type PuppyAgeGroup = 
  | 'newborn'
  | 'twoWeek'
  | 'fourWeek' 
  | 'sixWeek'
  | 'eightWeek'
  | 'tenWeek'
  | 'twelveWeek'
  | 'older';

/**
 * Interface for detailed information about puppy age groups
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
  
  // Added missing properties
  maleCount: number;
  femaleCount: number;
  puppiesByStatus: Record<string, PuppyWithAge[]>;
  
  // Legacy properties
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  
  // Utility values
  currentWeek: number;
  
  // State
  isLoading: boolean;
  error: any;
  refetch: () => Promise<any>;
  
  // Extended statistics
  total?: {
    count: number;
    male: number;
    female: number;
  };
}

/**
 * Interface for puppy tracking options
 */
export interface PuppyTrackingOptions {
  includeArchived?: boolean;
  filterByStatus?: string[];
  filterByGender?: string[];
  filterByAgeGroup?: string;
}

// Re-export for backwards compatibility
export { 
  PuppyWithAge, 
  PuppyAgeGroup, 
  PuppyAgeGroupInfo, 
  PuppyAgeGroupData, 
  PuppyManagementStats, 
  PuppyTrackingOptions 
};
