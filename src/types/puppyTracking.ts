
// Defining the key types needed for puppy tracking functionality

export interface PuppyWithAge {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  color: string;
  status: string;
  litter_id: string;
  birth_weight?: string;
  microchip_number?: string;
  age_days: number;  // Age in days
  age_weeks: number; // Age in weeks
  created_at: string;
  updated_at: string;
  // Additional properties needed by components
  photo_url?: string;
  current_weight?: string;
  ageInDays?: number; // Alias for age_days for backward compatibility
  ageInWeeks?: number; // Alias for age_weeks for backward compatibility
  ageDescription?: string;
  litters?: any; // For litter information
}

export interface PuppyManagementStats {
  totalPuppies: number;
  totalLitters: number;
  activeLitters: number;
  availablePuppies: number;
  reservedPuppies: number;
  puppiesByAgeGroup: PuppyAgeGroupData[];
  recentWeightChecks: number;
  upcomingVaccinations: number;
  weightCompletionRate: number;
  vaccinationCompletionRate: number;
}

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  description: string;
  minAge: number;
  maxAge: number;
  count: number;
  puppies: PuppyWithAge[];
  // Additional fields needed by components
  startDay?: number;
  endDay?: number;
  milestones?: string;
  careChecks?: any[];
  examples?: string[];
  color?: string; // Used for styling
}

// Define DEFAULT_AGE_GROUPS for use in hooks
export const DEFAULT_AGE_GROUPS: PuppyAgeGroupData[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    description: 'Puppies 0-14 days old',
    minAge: 0,
    maxAge: 14,
    startDay: 0,
    endDay: 14,
    count: 0,
    puppies: [],
    milestones: 'Eyes closed, minimal movement, needs frequent feeding and cleaning',
    color: '#FFD8E6' // Soft pink
  },
  {
    id: 'transition',
    name: 'Transition',
    description: 'Puppies 15-28 days old',
    minAge: 15,
    maxAge: 28,
    startDay: 15,
    endDay: 28,
    count: 0,
    puppies: [],
    milestones: 'Eyes opening, beginning to hear, starting to walk',
    color: '#FFF4D8' // Soft yellow
  },
  {
    id: 'socialization',
    name: 'Socialization',
    description: 'Puppies 29-49 days old',
    minAge: 29,
    maxAge: 49,
    startDay: 29,
    endDay: 49,
    count: 0,
    puppies: [],
    milestones: 'Playing with littermates, weaning from mother, exploring environment',
    color: '#E2F4FF' // Soft blue
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    description: 'Puppies 50-84 days old',
    minAge: 50,
    maxAge: 84,
    startDay: 50,
    endDay: 84,
    count: 0,
    puppies: [],
    milestones: 'Ready for adoption, basic training begins, fully eating solid food',
    color: '#E5FFE2' // Soft green
  },
  {
    id: 'older',
    name: 'Older Puppies',
    description: 'Puppies 85+ days old',
    minAge: 85,
    maxAge: 365,
    startDay: 85,
    endDay: 365,
    count: 0,
    puppies: [],
    milestones: 'Advanced training, full vaccinations, continued socialization',
    color: '#F0E6FF' // Soft purple
  }
];

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  percent_change?: number;
  // Additional fields needed by components
  age_days?: number;
  birth_date?: string;
}

export type WeightUnit = 'lbs' | 'kg' | 'oz' | 'g';

export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  experiences: SocializationExperience[];
  // Additional fields needed by components
  examples?: string[];
  importance?: 'high' | 'medium' | 'low';
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  date: string;
  reaction: SocializationReaction;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Additional fields for backward compatibility
  category_id?: string;
  experience_date?: string;
}

// Updated to be a rich object with properties rather than just a string
export interface SocializationReactionOption {
  id: string;
  name: string;
  color: string;
  description: string;
}

export type SocializationReaction = 'positive' | 'neutral' | 'negative' | 'fearful' | 'excited';

export interface SocializationProgress {
  category: string;
  category_id?: string;
  categoryName?: string;
  count: number;
  positiveCount: number;
  negativeCount: number;
  completion_percentage: number;
  target?: number;
}

export interface PuppyVaccination {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
  created_at: string;
}

export interface PuppyVaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at: string;
  is_completed?: boolean;
  vaccination_date?: string;
}

// Alias for backward compatibility
export type VaccinationScheduleItem = PuppyVaccinationSchedule;
export type VaccinationRecord = PuppyVaccination;

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  // Additional fields needed by components
  title?: string;
  category?: string;
  expected_age_days?: number;
  description?: string;
  completion_date?: string;
}

// Dog Care Status for daily care logs
export interface DogCareStatus {
  id: string;
  name: string;
  lastCareTime?: string;
  careStatus: 'recent' | 'overdue' | 'none';
  careTypes: string[];
  needsAttention: boolean;
}
