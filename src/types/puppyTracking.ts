import { Litter } from './litter';

// Basic puppy information with additional age properties
export interface PuppyWithAge {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  color: string;
  status: string;
  photo_url?: string;
  litter_id: string;
  birth_order?: number;
  current_weight?: number;
  weight_unit?: string;
  notes?: string;
  microchip_id?: string;
  registration_number?: string;
  created_at: string;
  updated_at?: string;
  age_days: number;
  age_weeks: number;
  ageInDays: number;  // Alternative property name
  ageInWeeks: number; // Alternative property name
  age_in_weeks: number; // Required by some components
  ageDescription: string;
  litters?: Litter;
}

// Information for puppy age grouping
export interface AgeGroup {
  id: string;
  name: string;
  description: string;
  startDay: number;
  endDay: number;
  color?: string;
  careChecks: string[];
  milestones: string[];
}

// Extended age group data with puppy counts
export interface PuppyAgeGroupData extends AgeGroup {
  minAge: number;
  maxAge: number;
  count: number;
  puppies: PuppyWithAge[];
}

// Puppy statistics by status and other metrics
export interface PuppyManagementStats {
  totalCount: number;
  byStatus: Record<string, number>;
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  byColor: Record<string, number>;
  byAgeGroup: Record<string, number>;
  weightRanges: {
    min: number;
    max: number;
    avg: number;
    unit: string;
  };
  adoptionRate: number;
  reservationRate: number;
  totalPuppies: number;
  totalLitters: number;
  activeLitters: number;
  availablePuppies: number;
  reservedPuppies: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
  puppiesByAgeGroup: Record<string, number>;
  weightCompletionRate: number;
  vaccinationCompletionRate: number;
}

// Milestone tracking for puppies
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  title: string;
  milestone_type: string;
  category?: string;
  expected_age_days: number;
  description?: string;
  is_completed: boolean;
  completion_date?: string;
  created_at: string;
  updated_at?: string;
}

// Weight tracking records
export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// Define WeightUnit type
export type WeightUnit = 'g' | 'oz' | 'lbs' | 'kg' | 'lb';

// Define WeightRecord for backward compatibility
export interface WeightRecord extends Partial<PuppyWeightRecord> {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  age_days?: number;
  birth_date?: string;
}

// Health tracking for puppies
export interface PuppyHealthRecord {
  id: string;
  puppy_id: string;
  record_type: string;
  record_date: string;
  notes: string;
  performed_by?: string;
  created_at: string;
  updated_at?: string;
}

// Vaccination tracking
export interface PuppyVaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
  next_due_date?: string;
  created_at: string;
  updated_at?: string;
}

// For backward compatibility
export type VaccinationRecord = PuppyVaccinationRecord;

// Vaccination schedule
export interface PuppyVaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  scheduled_date: string;
  is_completed: boolean;
  vaccination_record_id?: string;
  created_at: string;
  updated_at?: string;
  due_date: string;
  vaccine_name?: string;
  administered?: boolean;
  administered_date?: string;
  notes?: string;
  vaccination_date?: string; // Adding for compatibility
}

// For backward compatibility
export type VaccinationScheduleItem = PuppyVaccinationSchedule;

// Socialization tracking
export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  recommended_experiences: number;
  priority: 'high' | 'medium' | 'low';
  age_start_days: number;
  age_end_days: number;
  created_at: string;
  updated_at?: string;
  color?: string;
  examples?: string[];
}

// Update the socialization reaction types
export type SocializationReactionType = 'positive' | 'neutral' | 'negative' | 'very_positive' | 'fearful' | 'cautious' | 'very_fearful';

// Socialization reaction interface
export interface SocializationReaction {
  id: string;
  name: string;
  color: string;
  description?: string;
}

// Add the SocializationReactionObject interface that matches the same structure as SocializationReaction
export interface SocializationReactionObject {
  id: string;
  name: string;
  color: string;
  description?: string;
}

// Socialization experience records
export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category_id: string;
  experience_type: string;
  experience_date: string;
  reaction: SocializationReactionType;
  notes?: string;
  created_at: string;
  updated_at?: string;
  category?: string;
  experience?: string;
}

// Socialization progress tracking
export interface SocializationProgress {
  id: string;
  categoryId: string;
  category_name: string;
  categoryName?: string;
  completion_percentage: number;
  count: number;
  target: number;
  puppy_id: string;
}
