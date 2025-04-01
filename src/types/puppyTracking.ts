
export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
  created_at: string;
  due_date?: string;
  is_completed?: boolean;
}

export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at: string;
  is_completed: boolean;
}

export interface PuppyWithAge {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | null;
  color: string;
  litter_id: string;
  birth_date?: string;
  current_weight?: string;
  photo_url?: string;
  microchip_number?: string;
  status: string;
  ageInDays: number;
  litters?: {
    id: string;
    name?: string;
    birth_date: string;
  };
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category_id: string;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface SocializationCategory {
  id: string;
  name: string;
  description?: string;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at: string;
  // Enhanced fields for UI
  title: string;
  category: string;
  target_date: string;
  completion_date?: string;
  description?: string;
}

export interface BreedGrowthStandard {
  breed: string;
  age_weeks: number;
  min_weight: number;
  median_weight: number;
  max_weight: number;
  weight_unit: 'oz' | 'g' | 'lbs' | 'kg';
}
