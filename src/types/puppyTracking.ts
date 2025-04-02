
/**
 * Types related to puppy tracking functionality
 */

export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  vaccination_date?: string;
  notes?: string;
  created_at: string;
}

export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
  created_at: string;
}

export interface PuppyWithAge {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  color?: string;
  status?: string;
  photo_url?: string;
  litter_id?: string;
  ageInDays: number;
  ageInWeeks: number;
  ageDescription: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  category: string;
  created_at: string;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
}
