
// Re-export PuppyWithAge for easier imports
export { PuppyWithAge } from './litter';

// Puppy age group data
export interface PuppyAgeGroupData {
  [key: string]: PuppyWithAge[];
  newborn: PuppyWithAge[];
  twoWeek: PuppyWithAge[];
  fourWeek: PuppyWithAge[];
  sixWeek: PuppyWithAge[];
  eightWeek: PuppyWithAge[];
}

export interface PuppyAgeGroup {
  id: string;
  name: string;
  description: string;
  minDays: number;
  maxDays: number;
  color: string;
}

// Puppy management statistics
export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  unavailablePuppies?: number;
  maleCount?: number;
  femaleCount?: number;
  activeCount: number;
  availableCount: number;
  reservedCount: number;
  soldCount: number;
  neonate?: number; // 0-2 weeks
  transitional?: number; // 2-4 weeks
  socialization?: number; // 4-8 weeks
  juvenile?: number; // 8+ weeks
  
  // Status counts
  byStatus: {
    available: number;
    reserved: number;
    sold: number;
    unavailable: number;
  };
  
  // Gender counts
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  
  // Age group categorization
  byAgeGroup: PuppyAgeGroupData;
  
  // Age stats
  averageAge?: number;
  youngestAge?: number;
  oldestAge?: number;
  
  // Weight stats
  averageWeight?: number;
  minWeight?: number;
  maxWeight?: number;
  
  // Health stats  
  vaccinationRate?: number;
  dewormingRate?: number;
  healthCheckRate?: number;
  
  // For backward compatibility
  puppies?: any[];
  isLoading?: boolean;
  error?: any;
  currentWeek?: number;
  ageGroups?: PuppyAgeGroup[];
  puppiesByAgeGroup?: Record<string, PuppyWithAge[]>;
  total?: {
    count: number;
    male: number;
    female: number;
  };
}

// Socialization reaction type
export type SocializationReactionType = 
  | 'very_positive' 
  | 'positive' 
  | 'neutral' 
  | 'cautious' 
  | 'fearful' 
  | 'very_fearful' 
  | 'no_reaction'
  | 'negative' 
  | 'unknown';
