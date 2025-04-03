
// Basic Puppy Types
export interface PuppyWithAge {
  id: string;
  name?: string;
  color?: string;
  gender?: string;
  litter_id?: string;
  photo_url?: string;
  birth_date: string;
  birth_weight?: string;
  current_weight?: string;
  ageInDays: number;
  ageInWeeks: number;
  ageDescription?: string;
  birth_order?: number;
  status?: string;
  litters: {
    id: string;
    name?: string; 
    birth_date: string;
  };
}

export interface AgeGroup {
  id: string;
  name: string;
  description: string;
  minDays: number;
  maxDays: number;
  milestones: string[];
  color: string;
}

export interface PuppyAgeGroupData {
  ageGroup: AgeGroup;
  puppies: PuppyWithAge[];
}

export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  ageGroups: AgeGroup[];
  puppiesByAgeGroup: PuppyAgeGroupData[];
  totalCount: number;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date?: string;
  notes?: string;
  created_at?: string;
  // Additional fields to handle the developmental milestones table
  title?: string;
  description?: string;
  is_completed?: boolean;
  completion_date?: string;
  expected_age_days?: number;
  actual_age_days?: number;
  milestone_category?: string;
  photo_url?: string;
  created_by?: string;
}

// Weight tracking types
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg' | 'lbs';

export interface WeightRecord {
  id: string;
  puppy_id?: string;
  dog_id?: string;
  date: string;
  weight: number;
  unit: WeightUnit;
  weight_unit: string;
  notes?: string;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}

export interface PuppyWeightRecord extends WeightRecord {
  puppy_id: string;
  age_days: number;
}

export interface PuppyHealthRecord {
  id: string;
  puppy_id: string;
  record_type: string;
  date: string;
  details: string;
  administered_by?: string;
  notes?: string;
  created_at: string;
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
  created_at?: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  administered?: boolean;
  lot_number?: string;
  notes?: string;
  created_at?: string;
}

export interface PuppyVaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at?: string;
}

export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  vaccine_name: string;
  notes?: string;
  administered: boolean;
  created_at?: string;
}

export interface VaccinationScheduleItem {
  id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  vaccination_date?: string; // Date when administered, if done
  status: 'scheduled' | 'completed' | 'overdue';
}

// Socialization types
export type SocializationCategory = {
  id: string;
  name: string;
};

export type SocializationReactionType = 'very_positive' | 'positive' | 'neutral' | 'cautious' | 'fearful' | 'very_fearful';

export interface SocializationReaction {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface SocializationReactionObject {
  id: SocializationReactionType;
  name: string;
  emoji: string;
  color: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  category_id?: string;
  experience: string;
  experience_date: string;
  experience_type?: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface SocializationProgress {
  category: string;
  categoryId?: string;
  categoryName?: string;
  count?: number;
  target?: number;
  completion_percentage?: number;
}
