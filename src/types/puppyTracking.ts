
import { PuppyWithAge as ModulePuppyWithAge, PuppyAgeGroup, PuppyAgeGroupInfo, PuppyAgeGroupData as ModulePuppyAgeGroupData } from '@/modules/puppies/types';

/**
 * Re-export core types from modules/puppies/types
 */
export type PuppyWithAge = ModulePuppyWithAge;
export type { PuppyAgeGroup, PuppyAgeGroupInfo };
export type PuppyAgeGroupData = ModulePuppyAgeGroupData;

/**
 * Interface for vaccination schedule items
 */
export interface VaccinationScheduleItem {
  id: string;
  name: string;
  dueDate?: string;
  vaccinationType: string;
  description?: string;
  required: boolean;
  ageWeeks: number;
}

/**
 * Interface for vaccination records
 */
export interface VaccinationRecord {
  id: string;
  puppyId: string;
  vaccinationType: string;
  vaccinationDate: string;
  administeredBy?: string;
  notes?: string;
  createdAt: string;
}

/**
 * Interface for puppy milestones
 */
export interface PuppyMilestone {
  id: string;
  puppyId: string;
  title: string;
  description?: string;
  expectedAgeDays: number;
  completionDate?: string;
  isCompleted: boolean;
  category?: string;
  notes?: string;
  photoUrl?: string;
}

/**
 * Interface for puppy management statistics
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
  maleCount: number;
  femaleCount: number;
  
  // Groupings by properties
  puppiesByStatus: Record<string, PuppyWithAge[]>;
  
  // Legacy property names for backward compatibility
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  
  // Utility values
  currentWeek: number;
  
  // State management
  isLoading: boolean;
  error: any;
  refetch: () => Promise<any>;
  
  // Extended statistics (added to fix type errors)
  total?: {
    count: number;
    male: number;
    female: number;
  };
}

// Socialization Types

export type SocializationReactionType = 'positive' | 'neutral' | 'fearful';

export interface SocializationReaction {
  type: SocializationReactionType;
  date: string;
  notes?: string;
}

export interface SocializationReactionOption {
  id: string;
  label: string;
  value: string;
  type: SocializationReactionType | string;
  icon: string;
  name: string;
  color?: string;
}

export interface SocializationCategory {
  id: string;
  category: string;
  displayName: string;
  description: string;
  targetCount: number;
  examples?: string[];
  color?: string;
}

export interface SocializationCategoryOption extends SocializationCategory {
  value: string;
  label: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  categoryName?: string;
  experience: string;
  experience_date?: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at: string;
}

export interface SocializationProgress {
  category: string;
  categoryName: string;
  total: number;
  completed: number;
  percentage: number;
}
