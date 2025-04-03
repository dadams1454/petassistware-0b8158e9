
import { Puppy } from '@/components/litters/puppies/types';

export interface PuppyWithAge extends Puppy {
  age?: number;
  ageInWeeks?: number;
  ageGroup?: string;
  developmentalStage?: string;
  weightHistory?: PuppyWeightRecord[];
}

export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  age_days?: number;
  notes?: string;
  created_at: string;
}

export interface PuppyChartData {
  age: number;
  weight: number;
  weightUnit: string;
  date: string;
}

export interface PuppyAgeGroup {
  id: string;
  name: string;
  ageRangeStart: number;
  ageRangeEnd: number;
  description?: string;
  color: string;
}

export interface PuppyAgeGroupData {
  ageGroup: PuppyAgeGroup;
  puppies: PuppyWithAge[];
}

export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  maleCount: number;
  femaleCount: number;
  averageWeight?: number;
  weightUnit?: string;
  youngestAge?: number;
  oldestAge?: number;
  upcomingVaccinations?: number;
}

// Socialization Types
export interface SocializationCategory {
  id: string;
  name: string;
  color?: string;
  description?: string;
  examples?: string[];
}

export type SocializationReactionType = 
  | 'very_positive'
  | 'positive'
  | 'neutral'
  | 'cautious'
  | 'fearful'
  | 'very_fearful';

export interface SocializationReaction {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface SocializationReactionObject {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface SocializationReactionOption {
  id: string;
  name: string;
  value: string;
  label: string;
  color: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience_type?: string;
  experience: string;
  experience_date: string | Date;
  reaction: string;
  notes?: string;
  created_at: string;
}

export interface SocializationProgress {
  category: string;
  categoryName: string;
  count: number;
  target: number;
  completion_percentage: number;
}
