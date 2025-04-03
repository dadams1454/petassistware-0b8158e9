
// Weight record types for puppies
export type WeightUnit = 'oz' | 'g' | 'lbs' | 'kg' | 'lb';

export interface PuppyWeight {
  id: string;
  puppy_id: string;
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  notes?: string;
  created_at: string;
  age_days?: number;
}

export interface WeightTrackerProps {
  puppyId: string;
  birthDate?: string;
  onAddSuccess?: () => void;
}

// Type for weight data
export interface WeightData {
  id: string;
  date: string;
  weight: number;
  unit: WeightUnit;
  ageInDays?: number;
  ageInWeeks?: number;
}

// PuppyWithAge interface
export interface PuppyWithAge {
  id: string;
  name?: string;
  gender?: string;
  birth_date?: string;
  color?: string;
  status?: string;
  litter_id?: string;
  photo_url?: string;
  current_weight?: string;
  age_days: number;
  age_in_weeks?: number;
  ageInDays: number;
  ageInWeeks?: number;
  age_weeks?: number;
  ageDescription?: string;
  litters?: {
    id: string;
    name?: string;
    birth_date: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Age Group Types
export interface AgeGroup {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  description: string;
  milestones?: string;
}

export interface PuppyAgeGroupData extends AgeGroup {
  minAge: number;
  maxAge: number;
  count: number;
  puppies: PuppyWithAge[];
  careChecks?: string[];
}

// Puppy Management Statistics
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

// Weight Record Types
export interface WeightRecord {
  id: string;
  puppy_id?: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
}

// Puppy Milestone Types
export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at?: string;
}

// Health Record Types
export interface PuppyHealthRecord {
  id: string;
  puppy_id: string;
  date: string;
  type: string;
  notes: string;
  created_at: string;
}

// Vaccination Types
export interface PuppyVaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  lot_number?: string;
  administered_by?: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  administered: boolean;
  scheduled_date: string;
  notes?: string;
}

export interface PuppyVaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  administered: boolean;
  notes?: string;
}

// Socialization Types
export interface SocializationCategory {
  id: string;
  name: string;
  examples?: string[];
}

export type SocializationReactionType = 'positive' | 'neutral' | 'negative' | 'very_positive' | 'cautious' | 'fearful' | 'very_fearful';

export interface SocializationReaction {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface SocializationReactionObject {
  id: SocializationReactionType;
  name: string;
  color: string;
  description: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface SocializationProgress {
  category: string;
  total: number;
  positive: number;
  neutral: number;
  negative: number;
  percentage: number;
}
