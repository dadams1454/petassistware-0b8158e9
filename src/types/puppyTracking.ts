
import { type Puppy } from './litter';
import { type WeightUnit } from './common';
import { type WeightRecord as WeightRecordBase } from './weight';

// Puppy with age calculation
export interface PuppyWithAge extends Puppy {
  age: number;
  ageInDays: number;
  age_days?: number; // For backward compatibility
  ageInWeeks: number;
  age_weeks?: number; // For backward compatibility
  developmentalStage: string;
  weightHistory?: WeightRecordBase[];
  litter?: any;
  currentWeight?: number;
  current_weight_unit?: string;
  weight_unit?: string;
  ageDescription?: string;
}

// Weight record for puppies - with puppy_id required
export interface WeightRecord {
  id: string;
  puppy_id: string;
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  notes?: string;
  created_at: string;
  age_days?: number;
  percent_change?: number;
  dog_id?: string; // Add this for compatibility with the database
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
  ageRange?: string;
  groupName?: string;
  puppyCount?: number;
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
  minAge: number;
  maxAge: number;
  displayName: string;
  minDays: number;
  maxDays: number;
  unit: string;
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

// Vaccination schedule
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  scheduled_date: string;
  due_date?: string; // For compatibility
  vaccine_name?: string;
  administered: boolean;
  administered_date?: string;
  dog_id?: string;
  notes?: string;
  created_at: string;
}

// Vaccination schedule item for compatibility
export interface VaccinationScheduleItem extends VaccinationSchedule {}

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
  name?: string;
  icon?: string;
}

// Socialization category
export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  color: string;
  examples?: string[];
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
  experience_type?: string;
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
  name?: string;
  icon?: string;
}

// Socialization progress
export interface SocializationProgress {
  categoryId: string;
  categoryName: string;
  count: number;
  total: number;
  percentage: number;
  target: number;
  completion_percentage?: number;
  category?: string;
  id?: string;
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
  milestone_category?: string;
  expected_age_days?: number;
  completion_date?: string;
  description?: string;
  category?: string; // For component compatibility
}

// Care log alias
export type CareLog = PuppyCareLog;
