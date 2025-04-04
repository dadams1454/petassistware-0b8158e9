
import { PuppyWithAge } from './litter';

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
export type SocializationReactionType = 'positive' | 'neutral' | 'cautious' | 'fearful';

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

// Socialization progress
export interface SocializationProgress {
  categoryId: string;
  categoryName: string;
  count: number;
  total: number;
  percentage: number;
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
}
