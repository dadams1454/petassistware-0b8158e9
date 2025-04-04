
import { Puppy, PuppyWithAge } from './litter';

// Puppy age group data
export interface PuppyAgeGroupData {
  [key: string]: PuppyWithAge[];
  newborn: PuppyWithAge[];
  twoWeek: PuppyWithAge[];
  fourWeek: PuppyWithAge[];
  sixWeek: PuppyWithAge[];
  eightWeek: PuppyWithAge[];
}

// Puppy management statistics
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  unavailablePuppies: number;
  maleCount: number;
  femaleCount: number;
  activeCount: number;
  availableCount: number;
  neonate: number; // 0-2 weeks
  transitional: number; // 2-4 weeks
  socialization: number; // 4-8 weeks
  juvenile: number; // 8+ weeks
  
  // Status counts
  statusCounts: {
    available: number;
    reserved: number;
    sold: number;
    unavailable: number;
  };
  
  // Age group categorization
  byAgeGroup: PuppyAgeGroupData;
  
  // Age stats
  averageAge: number;
  youngestAge: number;
  oldestAge: number;
  
  // Weight stats
  averageWeight: number;
  minWeight: number;
  maxWeight: number;
  
  // Health stats  
  vaccinationRate: number;
  dewormingRate: number;
  healthCheckRate: number;
}

// Socialization reaction type
export type SocializationReactionType = 
  'very_positive' | 'positive' | 'neutral' | 
  'cautious' | 'fearful' | 'very_fearful' | 'no_reaction' |
  'negative' | 'unknown';

// Socialization category interface
export interface SocializationCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  examples?: string[];
  icon?: string;
  order?: number;
}

// Socialization category option interface
export interface SocializationCategoryOption {
  id: string;
  name: string;
  description?: string;
  examples?: string[];
  color?: string;
  value?: string;
  label?: string;
  order?: number;
}

// Socialization reaction option interface
export interface SocializationReactionOption {
  id: string;
  name: string;
  color: string;
  emoji?: string;
  value: SocializationReactionType;
}

// Socialization progress interface
export interface SocializationProgress {
  categoryId: string;
  category: string;
  categoryName: string;
  total: number;
  completed: number;
  positive: number;
  neutral: number;
  negative: number;
  percentage: number;
  count?: number;
  target?: number;
  completion_percentage?: number;
}

// Puppy care log interface
export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  care_type: string;
  care_date: string;
  notes?: string;
  performed_by?: string;
  created_at: string;
  duration?: number;
  status?: string;
  feeding_amount?: number;
  feeding_unit?: string;
  weight?: number;
  weight_unit?: string;
}

// Socialization experience interface
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
