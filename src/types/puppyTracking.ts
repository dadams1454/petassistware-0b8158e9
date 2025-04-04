
import { Puppy, PuppyWithAge } from './litter';

// Age groups for puppy development tracking
export type PuppyAgeGroup = 'newborn' | 'infant' | 'transitional' | 'socialization' | 'juvenile';

// Socialization types
export type SocializationReactionType = 'very_positive' | 'positive' | 'neutral' | 'nervous' | 'fearful' | 'avoidant' | 'aggressive' | 'curious' | 'excited' | 'unknown';

export type SocializationCategory = 'people' | 'animals' | 'environment' | 'handling' | 'sounds' | 'surfaces' | 'objects' | 'dogs';

export interface SocializationCategoryOption {
  id: string;
  name: string;
  color: string;
  description?: string;
  examples?: string[];
}

export interface SocializationReactionOption {
  id: string;
  name: string;
  color: string;
  emoji: string;
  value: SocializationReactionType;
  label?: string;
}

export interface SocializationProgress {
  category: string;
  categoryName: string;
  count: number;
  target: number;
  completion_percentage: number;
  total: number;
  completed: number;
  positive: number;
  neutral: number;
  negative: number;
  categoryId?: string; // For backwards compatibility
}

export interface SocializationExperience {
  id?: string;
  puppy_id: string;
  category: SocializationCategory | string;
  categoryName?: string;
  experience: string;
  experience_date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at?: string;
  experience_type?: string;
}

export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  timestamp: string;
  care_type: string;
  activity: string;
  notes?: string;
  performed_by?: string;
  created_at: string;
}

// Statistics for puppy management dashboard
export interface PuppyAgeGroupData {
  id: string;
  name: string;
  range: string;
  ageRange: [number, number]; // in days
  startDay: number;
  endDay: number;
  developmentalPhase: string;
  description: string;
  milestones: string[];
  color: string;
  puppies: PuppyWithAge[];
  count: number;
  careChecks?: string[];
}

export interface PuppyManagementStats {
  totalPuppies: number;
  activeCount: number;
  reservedCount: number;
  availableCount: number;
  soldCount: number;
  currentWeek: number;
  
  // These can be derived from above properties but kept for backward compatibility
  puppies?: PuppyWithAge[];
  availablePuppies?: number;
  reservedPuppies?: number;
  soldPuppies?: number;
  
  byAgeGroup: Record<string, PuppyWithAge[]>;
  ageGroups: PuppyAgeGroupData[];
  puppiesByAgeGroup: Record<string, number>;
  
  // Additional metadata
  isLoading?: boolean;
  error?: any;
  
  // Extended statistics
  total?: {
    count: number;
    male: number;
    female: number;
  };
  byGender?: {
    male: number;
    female: number;
    unknown: number;
  };
  byStatus?: {
    available: number;
    reserved: number;
    sold: number;
    unavailable: number;
  };
  
  weightRanges?: Record<string, any>;
}

// Export PuppyWithAge so it's available
export { PuppyWithAge };

// Add WeightRecord definition for puppy weight tracking
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;  // For puppy weight records
  birth_date?: string; // For reference
}

// Add vaccination types
export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  scheduled_date: string;
  administered: boolean;
  administrationDate?: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  administrationDate: string;
  notes?: string;
  created_at: string;
}

export interface PuppyMilestone {
  id?: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at?: string;
  title?: string;
  is_completed?: boolean;
}

// Add SocializationRecord for backward compatibility
export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: {
    id: string;
    name: string;
  };
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}
