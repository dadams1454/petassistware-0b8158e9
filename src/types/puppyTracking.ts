
import { WeightRecord } from './weight';
import { WeightUnit } from './weight-units';
import { Puppy, PuppyWithAge } from './puppy';

/**
 * String literal for puppy age groups
 */
export type PuppyAgeGroup = 
  | 'newborn' 
  | 'twoWeek' 
  | 'fourWeek'
  | 'sixWeek'
  | 'eightWeek'
  | 'tenWeek'
  | 'twelveWeek'
  | 'older';

/**
 * Interface for puppy age group information
 */
export interface PuppyAgeGroupInfo {
  id: string;
  name: string;
  displayName: string;
  description: string;
  minDays: number;
  maxDays: number;
  unit: string;
  color: string;
  startDay: number;
  endDay: number;
  minAge: number;
  maxAge: number;
  milestones: string[];
  // Extra fields for display purposes
  groupName?: string;
  ageRange?: string;
}

/**
 * Interface for puppy age group data
 */
export interface PuppyAgeGroupData {
  newborn: number;
  twoWeek: number;
  fourWeek: number;
  sixWeek: number;
  eightWeek: number;
  tenWeek: number;
  twelveWeek: number;
  older: number;
  total: number;
}

/**
 * Interface for puppy weight data
 */
export interface PuppyWeightData {
  ageInDays: number;
  weight: number;
  weightUnit: WeightUnit;
  date: string;
}

/**
 * Interface for puppy milestone
 */
export interface PuppyMilestone {
  title: string;
  description?: string;
  expectedAgeDays: number;
  completed: boolean;
  completionDate?: string;
  category: string;
}

/**
 * Interface for vaccination schedule item
 */
export interface VaccinationScheduleItem {
  vaccinationType: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
  notes?: string;
}

/**
 * Interface for vaccination record
 */
export interface VaccinationRecord {
  id: string;
  vaccinationType: string;
  vaccinationDate: string;
  lotNumber?: string;
  manufacturer?: string;
  administeredBy?: string;
  notes?: string;
}

/**
 * Interface for puppy management statistics
 */
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  maleCount: number;
  femaleCount: number;
  activeCount: number;
  availableCount: number;
  reservedCount: number;
  soldCount: number;
  ageGroups: PuppyAgeGroupInfo[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  puppiesByStatus: Record<string, PuppyWithAge[]>;
  byAgeGroup: PuppyAgeGroupData;
  byStatus: Record<string, number>;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

/**
 * Interface for socialization category
 */
export interface SocializationCategory {
  id: string;
  category: string;
  displayName: string;
  description: string;
  icon?: string;
  targetExperiences?: number;
  name?: string;
  categoryId?: string;
}

/**
 * Interface for socialization category option
 */
export interface SocializationCategoryOption {
  id: string;
  category: string;
  displayName: string;
  description: string;
  icon?: string;
  name?: string;
  categoryId?: string;
}

/**
 * Type for socialization reaction type
 */
export type SocializationReactionType = 
  | 'positive' 
  | 'neutral' 
  | 'cautious'
  | 'fearful' 
  | 'excited'
  | 'curious';

/**
 * Interface for socialization reaction
 */
export interface SocializationReaction {
  id: string;
  type: SocializationReactionType;
  description: string;
  color: string;
  icon?: string;
  name?: string;
  emoji?: string;
}

/**
 * Interface for socialization reaction option
 */
export interface SocializationReactionOption {
  id: string;
  type: SocializationReactionType;
  description: string;
  color: string;
  name?: string;
  emoji?: string;
}

/**
 * Interface for socialization experience
 */
export interface SocializationExperience {
  id: string;
  category: string;
  experience: string;
  date: string;
  reaction?: SocializationReactionType;
  notes?: string;
}

/**
 * Interface for socialization record
 */
export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

/**
 * Interface for socialization progress
 */
export interface SocializationProgress {
  category: string;
  total: number;
  completed: number;
  percentage: number;
  categoryName?: string;
  count?: number;
  target?: number;
  completion_percentage?: number;
}
