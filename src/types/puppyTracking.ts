
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
  examples?: string[];
  color?: string;
}

export interface SocializationReaction {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface SocializationProgress {
  category: SocializationCategory;
  completedCount: number;
  targetCount: number;
  experiences: SocializationExperience[];
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
  expected_age_days?: number;
}

export interface BreedGrowthStandard {
  breed: string;
  age_weeks: number;
  min_weight: number;
  median_weight: number;
  max_weight: number;
  weight_unit: 'oz' | 'g' | 'lbs' | 'kg';
}

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  description: string;
  startDay: number;
  endDay: number;
  color: string;
  priority: number;
  milestones?: string;
  careChecks?: string[];
}

export interface WeightRecord {
  id: string;
  puppy_id?: string;
  dog_id?: string;
  date: string;
  weight: number;
  weight_unit: 'oz' | 'g' | 'lbs' | 'kg';
  notes?: string;
  percent_change?: number | null;
  created_at: string;
}

export type WeightUnit = 'oz' | 'g' | 'lbs' | 'kg';

export interface WeightData {
  date: string;
  weight: number;
  weightUnit: WeightUnit;
  ageInDays?: number;
}

export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  maleCount: number;
  femaleCount: number;
  averageWeight: number;
  puppiesByColor: Record<string, number>;
  puppiesByAge: Record<string, number>;
  activeLitters: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
}
