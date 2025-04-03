
// Basic puppy interface with age calculations
export interface PuppyWithAge {
  id: string;
  name?: string;
  birth_date?: string;
  color?: string;
  gender?: string;
  ageInDays: number;
  ageInWeeks: number;
  status?: string;
  litter_id?: string;
  current_weight?: string;
  photo_url?: string;
  litter_name?: string;
}

// Age group for organizing puppies
export interface PuppyAgeGroup {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  color: string;
  description: string;
}

// Extended age group with care information
export interface PuppyAgeGroupData {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  color: string;
  description: string;
  milestones?: string;
  careChecks?: string[];
  [key: string]: any;
}

// Statistics for puppy management
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  ageGroups: PuppyAgeGroupData[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
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
}

// Puppy milestone
export interface PuppyMilestone {
  id: string;
  title: string;
  milestone_type: string;
  expected_age_days: number;
  description: string;
  is_completed: boolean;
  completion_date: string;
}

// Socialization tracking
export type SocializationCategory = 
  | 'people' 
  | 'animals' 
  | 'environments' 
  | 'sounds' 
  | 'surfaces' 
  | 'objects'
  | 'handling';

export interface SocializationCategoryOption {
  id: string;
  name: string;
  color: string;
  description: string;
  examples: string[];
}

export type SocializationReactionType = 'positive' | 'neutral' | 'negative' | 'fearful' | 'excited' | 'curious' | 'no_reaction';

export interface SocializationReactionOption {
  value: SocializationReactionType;
  label: string;
  emoji: string;
  color: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  categoryName?: string;
  experience: string;
  experience_date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at: string;
}

export interface SocializationProgress {
  category: string;
  categoryName: string;
  total: number;
  completed: number;
  positive: number;
  neutral: number;
  negative: number;
  count: number;
  target: number;
  completion_percentage: number;
}

// Vaccination tracking
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name: string;
  due_date: string;
  notes?: string;
  administered: boolean;
  scheduled_date: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  title: string;
  is_completed: boolean;
}
