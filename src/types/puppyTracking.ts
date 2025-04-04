
// Types for puppy tracking

// Age groups for puppies
export type PuppyAgeGroup = 
  | 'newborn'
  | 'twoWeek'
  | 'fourWeek'
  | 'sixWeek'
  | 'eightWeek'
  | 'tenWeek'
  | 'twelveWeek'
  | 'older'
  | 'all';

// Age group data storage
export interface PuppyAgeGroupData {
  newborn: any[];
  twoWeek: any[];
  fourWeek: any[];
  sixWeek: any[];
  eightWeek: any[];
  tenWeek: any[];
  twelveWeek: any[];
  older: any[];
  all: any[];
}

// Stats for puppy management
export interface PuppyManagementStats {
  totalPuppies: number;
  puppies: PuppyWithAge[];
  ageGroups: PuppyAgeGroup[];
  puppiesByAgeGroup: Record<string, any[]>;
  byAgeGroup: PuppyAgeGroupData;
  byStatus: {
    available: number;
    reserved: number;
    sold: number;
    unavailable: number;
  };
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  activeCount: number;
  reservedCount: number;
  availableCount: number;
  soldCount: number;
  currentWeek: number;
  
  // Legacy properties
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  isLoading: boolean;
  error: any;
  
  // Extended statistics
  total: {
    count: number;
    male: number;
    female: number;
  };
}

// Puppy with age information
export interface PuppyWithAge {
  id: string;
  name: string;
  gender: "Male" | "Female";
  color: string;
  birth_date?: string;
  litter_id: string;
  status: string;
  photo_url?: string;
  
  // Age related properties
  age?: number;
  ageInDays: number;
  ageInWeeks: number;
  
  // Additional metadata
  isReserved?: boolean;
  litterName?: string;
  developmentalStage?: string;
  weight?: number;
  weight_unit?: string;
  weightHistory?: any[];
}

// Puppy milestone
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
}

// Puppy care log
export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  care_type: string;
  care_time: string;
  notes?: string;
  created_at: string;
}

// Socialization types
export type SocializationReactionType = 
  | 'positive'
  | 'neutral'
  | 'fearful'
  | 'negative'
  | 'curious';

// Socialization category
export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  targetCount: number;
}

// Socialization category option
export interface SocializationCategoryOption {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  targetCount: number;
}

// Socialization reaction option
export interface SocializationReactionOption {
  id: string;
  name: string;
  color: string;
  value: SocializationReactionType;
  icon: string;
  type: string;
}

// Socialization experience
export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  experience: string;
  experience_date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at: string;
}

// Socialization reaction
export interface SocializationReaction {
  id: string;
  name: string;
  color: string;
  type: string;
}

// Socialization progress
export interface SocializationProgress {
  categoryId: string;
  categoryName: string;
  total: number;
  target: number;
  percentage: number;
}

// Vaccination schedule
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  scheduled_date: string;
  vaccination_type: string;
  vaccine_name: string;
  administered: boolean;
  due_date?: string;
  notes?: string;
  created_at: string;
}

// Vaccination record
export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
  created_at: string;
}
