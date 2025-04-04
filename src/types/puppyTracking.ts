
// Import common types
import { WeightUnit } from './common';
import { Litter } from './litter';
import { PuppyWeightRecord } from '@/services/puppyWeightService';

// Define the basic puppy structure
export interface Puppy {
  id: string;
  name: string;
  litter_id: string;
  birth_date?: string;
  color?: string;
  gender?: string;
  status: 'Available' | 'Reserved' | 'Sold' | 'Unavailable';
  birth_weight?: string;
  current_weight?: string;
  current_weight_unit?: string;
  weight_unit?: string;
  birth_order?: number;
  photo_url?: string;
  microchip_number?: string;
  akc_registration_number?: string;
  akc_litter_number?: string;
  notes?: string;
  created_at: string;
  // Additional fields
  birth_time?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  reservation_date?: string;
  eyes_open_date?: string;
  ears_open_date?: string;
  first_walk_date?: string;
  fully_mobile_date?: string;
  deworming_dates?: string;
  vaccination_dates?: string;
  vet_check_dates?: string;
  presentation?: string;
  sale_price?: number;
}

// Extended puppy type with age calculations
export interface PuppyWithAge extends Puppy {
  age: number;  // Age in days
  ageInDays: number;  // Alias for age
  age_days?: number;  // For backward compatibility
  ageInWeeks: number;
  age_weeks?: number;  // For backward compatibility
  developmentalStage: string;
  weightHistory?: PuppyWeightRecord[];
  // Optional litter reference
  litter?: Partial<Litter>;
}

// Puppy age group definitions
export interface PuppyAgeGroup {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  minDays: number;
  maxDays: number;
  minAge?: number; // For backward compatibility
  maxAge?: number; // For backward compatibility
  unit?: string;
  color: string;
  startDay?: number; // For backward compatibility
  endDay?: number; // For backward compatibility
  milestones?: string[]; // For backward compatibility
}

// Puppy age group data structure
export interface PuppyAgeGroupData {
  newborn: PuppyWithAge[];
  twoWeek: PuppyWithAge[];
  fourWeek: PuppyWithAge[];
  sixWeek: PuppyWithAge[];
  eightWeek: PuppyWithAge[];
  [key: string]: PuppyWithAge[]; // Allow additional age groups
}

// Puppy statistics structure
export interface PuppyStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
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
}

// Complete puppy management stats
export interface PuppyManagementStats extends PuppyStats {
  puppies: PuppyWithAge[];
  ageGroups: PuppyAgeGroup[];
  puppiesByAgeGroup: PuppyAgeGroupData;
  byAgeGroup: PuppyAgeGroupData;
  activeCount: number;
  availableCount: number;
  reservedCount: number;
  soldCount: number;
  currentWeek: number;
  isLoading: boolean;
  error: any;
  // Extended statistics
  total: {
    count: number;
    male: number;
    female: number;
  };
}

// Socialization tracking types
export type SocializationReactionType = 'positive' | 'neutral' | 'cautious' | 'fearful' | 'curious' | 'very_positive' | 'very_fearful';

export interface SocializationCategory {
  id: string;
  name: string;
  categoryId?: string;
  color?: string;
  description?: string;
  examples?: string[];
}

export interface SocializationCategoryOption extends SocializationCategory {
  value: string;
  label: string;
  order: number;
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

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category_id: string;
  category?: string;
  experience: string;
  date: string;
  experience_date?: string; // For backward compatibility
  reaction?: SocializationReactionType;
  notes?: string;
  created_at: string;
  experience_type?: string; // For backward compatibility
}

export interface SocializationProgress {
  categoryId: string;
  category?: string; // For backward compatibility
  categoryName?: string; // For backward compatibility
  total: number;
  count?: number; // For backward compatibility
  target?: number; // For backward compatibility
  percentage: number;
  completion_percentage?: number; // For backward compatibility
}

// Puppy milestone types
export interface PuppyMilestone {
  id?: string;
  puppy_id: string;
  title: string;
  milestone_type: string;
  expected_age_days: number;
  description?: string;
  is_completed: boolean;
  completion_date?: string;
  category?: string; // For backward compatibility
}

// Vaccination schedule for puppies
export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name?: string;
  scheduled_date: string;
  due_date?: string; // For backward compatibility
  administered: boolean;
  administration_date?: string;
  notes?: string;
  created_at: string;
}

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

// For additional compatibility
export type SocializationRecord = SocializationExperience;
export type WeightRecord = import('./health').WeightRecord;

// For care logs
export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  activity: string;
  notes?: string;
  timestamp: string;
  created_at: string;
  created_by?: string;
}
