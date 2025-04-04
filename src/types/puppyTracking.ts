
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
  name: string;
  range: string;
  ageRange: [number, number]; // in days
  developmentalPhase: string;
  description: string;
  milestones: string[];
  color: string;
  puppies: PuppyWithAge[];
  count: number;
}

export interface PuppyManagementStats {
  totalPuppies: number;
  activeCount: number;
  reservedCount: number;
  availableCount: number;
  soldCount: number;
  byAgeGroup: Record<string, PuppyWithAge[]>;
  ageGroups: PuppyAgeGroupData[];
  puppiesByAgeGroup: Record<string, number>;
  currentWeek: number;
  weightRanges?: Record<string, any>;
}
