
import { Puppy } from './litter';
import { WeightUnit } from './common';

// Puppy with age calculation
export interface PuppyWithAge extends Puppy {
  age: number;
  ageInDays: number;
  ageInWeeks: number;
  developmentalStage: string;
  weightHistory?: any[];
  litter?: any;
  currentWeight?: number;
  ageDescription?: string;
}

// Puppy age group definitions
export enum PuppyAgeGroup {
  NEWBORN = 'newborn',
  TWO_WEEK = 'twoWeek',
  FOUR_WEEK = 'fourWeek',
  SIX_WEEK = 'sixWeek',
  EIGHT_WEEK = 'eightWeek',
  TEN_WEEK = 'tenWeek',
  TWELVE_WEEK = 'twelveWeek',
  OLDER = 'older',
  ALL = 'all'
}

// Age group data structure for puppies
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

// Age group structure with display information
export interface PuppyAgeGroupInfo {
  name: string;
  puppyCount: number;
  color: string;
  ageRange: string;
  minAge: number;
  maxAge: number;
}

// Statistics for puppy management
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  totalPuppies: number;
  byAgeGroup: PuppyAgeGroupData;
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
  ageGroups: PuppyAgeGroupInfo[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  
  // Additional stats
  activeCount: number;
  reservedCount: number;
  availableCount: number;
  soldCount: number;
  currentWeek: number;
  
  // Legacy properties for backward compatibility
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

// Weight record for puppies
export interface WeightRecord {
  id: string;
  puppy_id: string;
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  notes?: string;
  created_at: string;
  age_days?: number;
}

// Vaccination schedule
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  scheduled_date: string;
  due_date?: string; // For compatibility
  vaccine_name?: string;
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
  notes?: string;
  lot_number?: string;
  created_at: string;
}

// Socialization reactions
export type SocializationReactionType = 'excited' | 'curious' | 'neutral' | 'cautious' | 'fearful' | 'aggressive';

// Socialization reaction option
export interface SocializationReactionOption {
  id: string;
  label: string;
  description: string;
  color: string;
}

// Socialization category
export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  color: string;
}

// Socialization category option
export interface SocializationCategoryOption {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  targetCount: number;
  color: string;
}

// Socialization experience
export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  experience_date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at: string;
}

// Socialization reaction
export interface SocializationReaction {
  id: string;
  label: string;
  description: string;
  color: string;
}

// Socialization progress
export interface SocializationProgress {
  categoryId: string;
  categoryName: string;
  count: number;
  total: number;
  percentage: number;
  target: number;
}

// Puppy care log
export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  date: string;
  activity_type: string;
  notes?: string;
  performed_by?: string;
  created_at: string;
}
