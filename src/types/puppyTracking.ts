
import { PuppyWithAge } from './litter';

// Define age groups for puppies
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
}

// Define puppy management statistics
export interface PuppyManagementStats {
  totalPuppies: number;
  puppies: PuppyWithAge[];
  ageGroups: string[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
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

// Socialization related types
export type SocializationReactionType = 'positive' | 'neutral' | 'negative' | 'fearful' | 'aggressive' | 'unknown';

export interface SocializationReaction {
  id: string;
  type: SocializationReactionType;
  label: string;
  description: string;
  value?: string; // For compatibility
  icon?: string;
}

export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  icon?: string;
}

export interface SocializationCategoryOption {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
}

export interface SocializationReactionOption {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface SocializationProgress {
  categoryId: string;
  categoryName: string;
  total: number;
  count: number;
  target: number;
  percentage: number;
  completion_percentage?: number; // For compatibility
}

// Puppy care related types
export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  activity_type: string;
  timestamp: string;
  notes?: string;
  performed_by?: string;
  created_at: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  date: string;
  reaction: SocializationReactionType;
  notes?: string;
  created_at: string;
}
