
import { Puppy, PuppyWithAge } from './litter';

// Re-export PuppyWithAge for compatibility
export { PuppyWithAge };

// Puppy age group interface
export interface PuppyAgeGroup {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  description: string;
  color: string;
}

// Puppy age group data
export interface PuppyAgeGroupData {
  [key: string]: PuppyWithAge[];
}

// Puppy management stats
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  ageGroups: PuppyAgeGroup[];
  puppiesByAgeGroup: PuppyAgeGroupData;
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  isLoading: boolean;
  error: Error | null;
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
  // Legacy property
  stats?: any;
  totalCount?: number;
}

// Socialization record type
export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  experience_date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at: string;
}

// Socialization reaction type
export type SocializationReactionType = 'positive' | 'neutral' | 'negative' | 'very_positive' | 'cautious' | 'fearful' | 'very_fearful';

// Socialization category
export type SocializationCategory = 
  'people' | 
  'animals' | 
  'environments' | 
  'sounds' | 
  'objects' | 
  'handling' | 
  'travel';

// Socialization category option with required properties
export interface SocializationCategoryOption {
  id: string;
  category: SocializationCategory;
  name: string;
  description: string;
  targetCount: number;
  experiences: string[];
  examples?: string[];
  color?: string;
}

// Socialization reaction option
export interface SocializationReactionOption {
  id: string;
  value: SocializationReactionType;
  label: string;
  color: string;
  emoji: string;
}

// Socialization progress
export interface SocializationProgress {
  category: string;
  categoryName?: string;
  total: number;
  completed: number;
  target: number;
  completion_percentage: number;
  positive: number;
  neutral: number;
  negative: number;
  cautious?: number;
  fearful?: number;
  count?: number;
}

// Puppy care log
export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  category: string;
  action: string;
  timestamp: string;
  notes?: string;
  performed_by?: string;
  created_at: string;
}

// Weight record for puppies
export interface WeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}

// Vaccination schedule item
export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  scheduled_date: string;
  due_date: string;
  administered: boolean;
  vaccine_name?: string;
  notes?: string;
  created_at?: string;
}

// Vaccination record
export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
  created_at?: string;
}

// Socialization experience (expanded record)
export interface SocializationExperience extends SocializationRecord {
  categoryName?: string;
  categoryColor?: string;
  reactionEmoji?: string;
  reactionLabel?: string;
}
