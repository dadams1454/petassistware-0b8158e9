
// Puppy tracking and management types

// Represents a puppy with age calculation
export interface PuppyWithAge {
  id: string;
  name?: string;
  birth_date: string;
  gender?: string;
  color?: string;
  status?: string;
  litter_id?: string;
  litter_name?: string;
  ageInDays: number;
  ageInWeeks: number;
  photo_url?: string;
  // Add properties that are used in components but missing in the interface
  current_weight?: string;
  birth_order?: number;
  // For backward compatibility
  age_days?: number;
  age_weeks?: number;
  age?: number;
  ageDescription?: string;
}

// Defines an age group for puppies
export interface PuppyAgeGroupData {
  id: string;
  name: string;      // Required name for the age group
  groupName?: string; // Optional alternate name format
  startDay: number;  // Starting day for this age group
  endDay: number;    // Ending day for this age group
  description?: string;
  color?: string;
  milestones?: string[]; // Important milestones to track in this age group
  careChecks?: string[]; // Care checks relevant for this age group
  // Properties used by components but not in the original interface
  minAge?: number;
  maxAge?: number;
  label?: string;
  ageRange?: string;
  imageUrl?: string;
}

// Comprehensive puppy management statistics
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  ageGroups: PuppyAgeGroupData[];
  puppiesByAgeGroup: { [groupId: string]: PuppyWithAge[] };
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  isLoading: boolean;
  error?: Error | null;
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
  byStatus: Record<string, number>;
  byAgeGroup: Record<string, number>;
  // Add stats property used in components
  stats?: any;
  totalCount?: number;
}

// Puppy weight record
export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  age_days?: number;
  notes?: string;
  created_at?: string;
}

// General weight record
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  unit?: string; // For backward compatibility
  date: string;
  notes?: string;
  created_at?: string;
  percent_change?: number;
  age_days?: number;
}

// Socialization Types
export interface SocializationCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  examples?: string[];
  icon?: string;
  importance?: number;
  recommended_age_start?: number;
  recommended_age_end?: number;
}

export interface SocializationReaction {
  id: string;
  name: string;
  value: string;
  color: string;
  emoji?: string;
  description?: string;
}

export type SocializationReactionType = 'positive' | 'neutral' | 'negative' | 'unknown' | 'very_positive' | 'cautious' | 'fearful' | 'very_fearful' | 'no_reaction';

export interface SocializationReactionObject {
  type: SocializationReactionType;
  notes?: string;
}

export interface SocializationReactionOption {
  value: SocializationReactionType;
  label: string;
  color: string;
}

export interface SocializationCategoryOption {
  value: string;
  label: string;
  description?: string;
  examples?: string[];
  color?: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  experience_type?: string;
  reaction: SocializationReactionType;
  experience_date: string;
  notes?: string;
  created_at: string;
}

export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  reaction: SocializationReactionType;
  date: string;
  notes?: string;
  created_at: string;
}

export interface SocializationProgress {
  category: string;
  categoryId?: string;
  categoryName?: string;
  total: number;
  completed: number;
  positive: number;
  neutral: number;
  negative: number;
  cautious?: number;
  percentage: number;
  count?: number;
  target?: number;
  completion_percentage?: number;
}

// Puppy milestone types
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  title?: string;
  is_completed?: boolean;
  category?: string;
  description?: string;
  milestone_category?: string;
  completion_date?: string;
  expected_age_days?: number;
  actual_age_days?: number;
  photo_url?: string;
}

// Vaccination types
export interface VaccinationScheduleItem {
  id: string;
  vaccine_name: string;
  due_date: string;
  administered: boolean;
  puppy_id: string;
  scheduled_date?: string;
  vaccination_date?: string;
  notes?: string;
  vaccination_type?: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  date: string;
  vaccination_date?: string;
  notes?: string;
  lot_number?: string;
  administered_by?: string;
}

export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccine_name: string;
  due_date: string;
  scheduled_date?: string;
  administered: boolean;
  notes?: string;
  vaccination_type?: string;
}
