
// Puppy tracking types
export interface Puppy {
  id: string;
  litter_id: string;
  litter_name?: string;
  name?: string;
  birth_date?: string;
  color?: string;
  gender?: 'Male' | 'Female';
  microchip_id?: string;
  status?: 'Available' | 'Reserved' | 'Placed' | 'Deceased';
  created_at: string;
  updated_at: string;
}

export interface PuppyWithLitter extends Puppy {
  litter: {
    id: string;
    name: string;
    birth_date: string;
    puppy_count: number;
  };
}

export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb' | 'lbs';

export interface WeightRecord {
  id: string;
  puppy_id?: string;
  dog_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  unit: WeightUnit; // For compatibility
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  minAgeDays: number;
  maxAgeDays: number;
  color: string;
  description?: string;
  puppies: Puppy[];
}

export const DEFAULT_AGE_GROUPS: Omit<PuppyAgeGroupData, 'puppies'>[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    minAgeDays: 0,
    maxAgeDays: 14,
    color: 'blue',
    description: 'First two weeks of life'
  },
  {
    id: 'transitional',
    name: 'Transitional',
    minAgeDays: 15,
    maxAgeDays: 21,
    color: 'green',
    description: 'Eyes and ears opening'
  },
  {
    id: 'socialization',
    name: 'Socialization',
    minAgeDays: 22,
    maxAgeDays: 49,
    color: 'amber',
    description: 'Key period for development'
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    minAgeDays: 50,
    maxAgeDays: 84,
    color: 'purple',
    description: 'Preparing for new homes'
  }
];

export interface PuppyManagementStats {
  totalPuppies: number;
  totalLitters: number;
  availablePuppies: number;
  reservedPuppies: number;
  puppiesByAgeGroup: Record<string, number>;
  weightCompletionRate: number;
  vaccinationCompletionRate: number;
  socializationCompletionRate: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
  activeLitters: number;
}

// Socialization types
export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  recommended_age_weeks: number[];
  experiences: string[];
  icon?: string;
  color?: string;
}

export type SocializationReaction = 'positive' | 'neutral' | 'negative' | 'fearful' | 'not_exposed';

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category_id: string;
  experience: string;
  reaction: SocializationReaction;
  notes?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface SocializationProgress {
  category_id: string;
  total_experiences: number;
  completed_experiences: number;
  positive_reactions: number;
  negative_reactions: number;
  neutral_reactions: number;
  completion_percentage: number;
}

// Vaccination types
export interface VaccinationScheduleItem {
  id: string;
  name: string;
  description?: string;
  recommended_age_weeks: number;
  is_core: boolean;
  created_at: string;
  updated_at: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_id: string;
  date_administered: string;
  administered_by?: string;
  notes?: string;
  next_due_date?: string;
  created_at: string;
  updated_at: string;
  vaccination?: VaccinationScheduleItem;
}

// Puppy milestone types
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  title: string;
  category: 'physical' | 'behavioral' | 'health' | 'socialization';
  description?: string;
  expected_age_days: number;
  completion_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
