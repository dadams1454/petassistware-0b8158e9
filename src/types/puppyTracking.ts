
import { WeightUnit } from './common';

// Puppy Weight Record
export interface WeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
}

// Puppy with age information
export interface PuppyWithAge {
  id: string;
  name: string;
  litter_id?: string;
  birth_date: string;
  birth_weight?: string;
  birth_order?: number;
  gender: string;
  color: string;
  status: string;
  microchip_number?: string;
  akc_registration_number?: string;
  akc_litter_number?: string;
  notes?: string;
  photo_url?: string;
  created_at?: string;
  birth_time?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  eyes_open_date?: string;
  ears_open_date?: string;
  first_walk_date?: string;
  fully_mobile_date?: string;
  current_weight?: string;
  sale_price?: number;
  reservation_date?: string;
  deworming_dates?: string;
  vaccination_dates?: string;
  vet_check_dates?: string;
  presentation?: string;
  
  // Calculated fields
  age: number;
  ageInDays: number;
  ageInWeeks: number;
  developmentalStage?: string;
  weightHistory?: any[];
  litter?: any;
  currentWeight?: number;
  age_days?: number; // For backward compatibility
  age_weeks?: number; // For backward compatibility
}

// Age group for puppy categorization
export interface PuppyAgeGroup {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  color: string;
  description: string;
  milestones?: string;
}

// Puppy age group data structure
export interface PuppyAgeGroupData {
  newborn: { name: string; puppyCount: number; color: string; ageRange: string; minAge: number; maxAge: number; };
  twoWeek: { name: string; puppyCount: number; color: string; ageRange: string; minAge: number; maxAge: number; };
  fourWeek: { name: string; puppyCount: number; color: string; ageRange: string; minAge: number; maxAge: number; };
  sixWeek: { name: string; puppyCount: number; color: string; ageRange: string; minAge: number; maxAge: number; };
  eightWeek: { name: string; puppyCount: number; color: string; ageRange: string; minAge: number; maxAge: number; };
  tenWeek: { name: string; puppyCount: number; color: string; ageRange: string; minAge: number; maxAge: number; };
  twelveWeek: { name: string; puppyCount: number; color: string; ageRange: string; minAge: number; maxAge: number; };
  older: { name: string; puppyCount: number; color: string; ageRange: string; minAge: number; maxAge: number; };
  all: { name: string; puppyCount: number; color: string; ageRange: string; minAge: number; maxAge: number; };
}

// Puppy management statistics
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  unavailablePuppies?: number;
  activeCount: number;
  availableCount: number;
  reservedCount: number;
  soldCount: number;
  averageAge?: number;
  youngestPuppy?: number;
  oldestPuppy?: number;
  currentWeek: number;
  ageGroups: PuppyAgeGroup[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  byAgeGroup: PuppyAgeGroupData;
  
  // Statistics by category
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
  
  byStatus: {
    available: number;
    reserved: number;
    sold: number;
    unavailable: number;
  };
  
  // Loading state
  isLoading: boolean;
  error: any;
}

// Socialization Categories
export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  color: string;
  examples?: string[];
}

// Socialization reaction types
export type SocializationReactionType = 'positive' | 'neutral' | 'cautious' | 'fearful' | 'aggressive' | 'avoidant';

// Socialization reaction data
export interface SocializationReaction {
  id: string;
  type: SocializationReactionType;
  label: string;
  description: string;
  statusColor: string;
  emoji?: string;
  statusLabel: string;
}

// Socialization category option
export interface SocializationCategoryOption extends SocializationCategory {}

// Socialization reaction option
export interface SocializationReactionOption extends SocializationReaction {}

// Socialization progress tracking
export interface SocializationProgress {
  categoryId: string;
  category: string;
  categoryName: string;
  total: number;
  target: number;
  percentage: number;
  color?: string;
  count?: number;
  completion_percentage?: number;
}

// Puppy care log entry
export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  care_type: string;
  care_date: string;
  performed_by: string;
  notes?: string;
  created_at: string;
}

// Socialization experience
export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  experience_date: string;
  reaction: SocializationReactionType;
  notes?: string;
  created_at: string;
}

// Vaccination schedule
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name: string;
  due_date: string;
  scheduled_date?: string;
  administered: boolean;
  notes?: string;
  created_at?: string;
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
  created_at?: string;
}
