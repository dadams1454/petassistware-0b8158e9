
// Re-export PuppyWithAge for easier imports
export type { PuppyWithAge } from './litter';

// Puppy age group data
export interface PuppyAgeGroupData {
  newborn: PuppyWithAge[];
  twoWeek: PuppyWithAge[];
  fourWeek: PuppyWithAge[];
  sixWeek: PuppyWithAge[];
  eightWeek: PuppyWithAge[];
}

export interface PuppyAgeGroup {
  id: string;
  name: string;
  description: string;
  minDays: number;
  maxDays: number;
  color: string;
  // Additional properties for compatibility
  minAge?: number;
  maxAge?: number;
  startDay?: number;
  endDay?: number;
  milestones?: string[];
}

// Socialization reaction type
export type SocializationReactionType = 
  | 'very_positive' 
  | 'positive' 
  | 'neutral' 
  | 'cautious' 
  | 'fearful' 
  | 'very_fearful' 
  | 'no_reaction'
  | 'negative' 
  | 'unknown';

// Puppy management statistics
export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  unavailablePuppies?: number;
  maleCount?: number;
  femaleCount?: number;
  activeCount: number;
  availableCount: number;
  reservedCount: number;
  soldCount: number;
  neonate?: number; // 0-2 weeks
  transitional?: number; // 2-4 weeks
  socialization?: number; // 4-8 weeks
  juvenile?: number; // 8+ weeks
  
  // Status counts
  byStatus: {
    available: number;
    reserved: number;
    sold: number;
    unavailable: number;
  };
  
  // Gender counts
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  
  // Age group categorization
  byAgeGroup: PuppyAgeGroupData;
  
  // Age stats
  averageAge?: number;
  youngestAge?: number;
  oldestAge?: number;
  
  // Weight stats
  averageWeight?: number;
  minWeight?: number;
  maxWeight?: number;
  
  // Health stats  
  vaccinationRate?: number;
  dewormingRate?: number;
  healthCheckRate?: number;
  
  // For backward compatibility
  puppies?: any[];
  isLoading?: boolean;
  error?: any;
  currentWeek?: number;
  ageGroups?: PuppyAgeGroup[];
  puppiesByAgeGroup?: Record<string, PuppyWithAge[]>;
  total?: {
    count: number;
    male: number;
    female: number;
  };
}

// Socialization-related types
export interface SocializationCategory {
  id: string;
  name: string;
}

export interface SocializationCategoryOption {
  id: string;
  name: string;
  value: string;
  label: string;
  examples: string[];
  categoryId?: string; // For linking
  order?: number;
  color?: string;
  description?: string;
}

export interface SocializationReactionOption {
  id: string;
  name: string;
  value: string;
  label: string;
  color: string;
  type: SocializationReactionType;
  emoji: string;
}

export interface SocializationProgress {
  categoryId: string;
  count: number;
  total: number;
  percentage: number;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category_id: string;
  experience: string;
  date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at: string;
}

// Puppy care log
export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  care_type: string;
  care_date: string;
  performed_by: string;
  notes?: string;
  created_at: string;
}

// Weight related types
export interface WeightRecord {
  id: string;
  puppy_id: string;
  dog_id?: string;
  weight: number;
  weight_unit: string;
  unit?: string; // For backward compatibility
  date: string;
  notes?: string;
  age_days?: number;
  percent_change?: number;
  created_at: string;
}

// Vaccination related types
export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccine_name: string;
  vaccination_type: string;
  scheduled_date: string;
  administered: boolean;
  administration_date?: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccine_name: string;
  vaccination_date: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
  created_at: string;
}
