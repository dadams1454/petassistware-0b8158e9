
// Types for puppy tracking

export interface PuppyWithAge {
  id: string;
  name: string;
  birth_date?: string;
  color?: string;
  gender?: string;
  microchip_id?: string;
  collar_color?: string;
  weight?: number;
  weight_unit?: string;
  litter_id: string;
  status?: string;
  adoption_status?: string;
  price?: number;
  notes?: string;
  ageInDays: number;
  litters?: {
    name?: string;
    birth_date?: string;
  };
  photo_url?: string;
  current_weight?: string | number;
  birth_weight?: string | number;
}

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  description: string;
  color: string;
  milestones?: string;
  careChecks?: string[];
}

export interface PuppyAgeGroup {
  name: string;
  min: number;
  max: number;
}

// Default age groups for puppies
export const DEFAULT_AGE_GROUPS: PuppyAgeGroup[] = [
  { name: 'Neonatal', min: 0, max: 14 },
  { name: 'Transitional', min: 15, max: 21 },
  { name: 'Socialization', min: 22, max: 49 },
  { name: 'Juvenile', min: 50, max: 84 },
  { name: 'Adolescent', min: 85, max: 180 },
  { name: 'Young Adult', min: 181, max: 365 }
];

export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  maleCount: number;
  femaleCount: number;
  averageWeight: number;
  weightUnit: string;
  totalLitters: number;
  activeLitters: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
  puppiesByColor?: Record<string, number>;
  puppiesByAge?: Record<string, number>;
}

export interface WeightData {
  weight: number;
  age: number;
  date: string;
  weight_unit?: string;
  unit?: string;
  id?: string;
}

export interface PuppyMilestone {
  id?: string;
  puppy_id: string;
  milestone_type: string;
  completed: boolean;
  completion_date?: string;
  milestone_date?: string;
  notes?: string;
  created_at?: string;
  category?: string;
  title?: string;
  description?: string;
  expected_age_days?: number;
}

export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  age_range: { min: number; max: number };
  color?: string;
  examples?: string[];
}

export interface SocializationProgress {
  category: string;
  categoryId?: string;
  categoryName?: string;
  completed: number;
  total: number;
  completionPercentage: number;
  target: number;
  count?: number;
}

export interface SocializationReaction {
  id?: string;
  name?: string;
  color?: string;
  description?: string;
}

export type SocializationReactionType = string | SocializationReaction;

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  reaction: string;
  experience_date: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  due_date: string;
  completed?: boolean;
  is_completed?: boolean;
  notes?: string;
  created_at: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  due_date?: string;
  is_completed?: boolean;
  notes?: string;
  administered_by?: string;
  lot_number?: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  unit?: string;
  date: string;
  notes?: string;
  created_at: string;
  percent_change?: number;
  birth_date?: string; // For puppy weight tracking
}

export type WeightUnit = 'lbs' | 'kg' | 'g' | 'oz' | string;
