
import { Puppy } from './litter';

// Puppy with calculated age
export interface PuppyWithAge extends Puppy {
  age: number;
  ageInDays: number;
  ageInWeeks: number;
  developmentalStage: string;
  weightHistory?: any[];
  litter?: any;
  currentWeight?: number;
  age_days?: number; // For backward compatibility
  age_weeks?: number; // For backward compatibility
}

// Puppy age group data structure
export interface PuppyAgeGroupData {
  // Specific age groups for puppies
  newborn: PuppyWithAge[];
  twoWeek: PuppyWithAge[];
  fourWeek: PuppyWithAge[];
  sixWeek: PuppyWithAge[];
  eightWeek: PuppyWithAge[];
  [key: string]: PuppyWithAge[]; // For dynamic age groups
}

// Puppy age group definition
export interface PuppyAgeGroup {
  id: string;
  name: string;
  displayName: string;
  description: string;
  minDays: number;
  maxDays: number;
  unit: 'days' | 'weeks';
  color: string;
  startDay?: number; // Adding for compatibility
  endDay?: number; // Adding for compatibility
  minAge?: number; // Adding for compatibility
  maxAge?: number; // Adding for compatibility
  milestones?: string; // Adding for compatibility
}

// Puppy management statistics
export interface PuppyManagementStats {
  totalPuppies: number;
  puppies: PuppyWithAge[];
  ageGroups: PuppyAgeGroup[];
  puppiesByAgeGroup: PuppyAgeGroupData;
  byAgeGroup: PuppyAgeGroupData;
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

// Puppy care log
export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  log_type: string;
  log_date: string;
  notes: string;
  performed_by: string;
  created_at: string;
}

// Socialization category
export interface SocializationCategory {
  id: string;
  name: string;
  description?: string; // Adding for compatibility
  color?: string; // Adding for compatibility
  examples?: string[]; // Adding for compatibility
}

// Socialization category option
export interface SocializationCategoryOption {
  id: string;
  name: string;
  description: string;
  color: string;
  examples: string[];
  categoryId: string;
  value: string;
  label: string;
  order: number;
}

// Socialization reaction type
export type SocializationReactionType = 'positive' | 'neutral' | 'cautious' | 'fearful' | 'curious' | 'very_positive' | 'very_fearful';

// Socialization reaction option
export interface SocializationReactionOption {
  id: string;
  name: string;
  value: string;
  label: string;
  color: string;
  type: SocializationReactionType;
  emoji: string;
}

// Define SocializationReaction for backwards compatibility
export interface SocializationReaction {
  statusLabel?: string;
  statusColor?: string;
  emoji?: string;
  color?: string;
  name?: string;
}

// Socialization progress
export interface SocializationProgress {
  categoryId: string;
  categoryName: string;
  count: number;
  total: number;
  percentage: number;
  category?: string; // For backward compatibility  
  target?: number; // For backward compatibility
  completion_percentage?: number; // For backward compatibility
}

// Socialization experience
export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  categoryName: string;
  experience: string;
  date: string;
  reaction: SocializationReactionType;
  notes?: string;
  created_at: string;
  experience_date?: string; // For backward compatibility
  experience_type?: string; // For backward compatibility
}

// Weight record for puppies
export interface WeightRecord {
  id: string;
  puppy_id: string;
  dog_id?: string;
  weight: number;
  weight_unit: string;
  unit?: string; // For backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number; // For puppy weight tracking
  birth_date?: string; // For age calculation
}

// Vaccination schedule item
export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  scheduled_date: string;
  due_date?: string;
  administered: boolean;
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
