
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

// Puppy age group interface
export interface PuppyAgeGroup {
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
  milestones: string;
}

// Puppy age group info interface
export interface PuppyAgeGroupInfo {
  id: string;
  name: string;
  groupName: string;
  ageRange: string;
  description: string;
  imageUrl?: string;
  startDay: number;
  endDay: number;
  color: string;
  milestones?: string | string[];
  puppyCount?: number;
  minAge?: number;
  maxAge?: number;
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
export type SocializationReactionType = 'very_positive' | 'positive' | 'neutral' | 'cautious' | 'fearful' | 'very_fearful' | 'excited' | 'curious' | 'aggressive';

// Socialization reaction option
export interface SocializationReactionOption {
  id: string;
  label: string;
  value: string;
  type: string;
  color: string;
  emoji?: string;
  description?: string;
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
  value: string;
  label: string;
  name: string;
  description: string;
  targetCount: number;
  color: string;
  order?: number;
  examples?: string[];
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
  value: string;
  type: string;
  color: string;
  emoji?: string;
  description?: string;
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

// Puppy milestone
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
