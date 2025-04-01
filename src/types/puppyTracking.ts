
import { WeightUnitEnum } from './health';

export type WeightUnit = keyof typeof WeightUnitEnum;

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  description: string;
  color?: string;
  milestones?: string;
  careChecks?: string[];
}

export interface PuppyWithAge {
  id: string;
  name: string;
  litter_id: string;
  birth_date: string;
  gender?: string;
  color?: string;
  status?: string;
  microchip_number?: string;
  ageInDays: number;
  photo_url?: string;
  current_weight?: string | number;
  weight?: number;
  weight_unit?: WeightUnit;
  litters?: {
    id: string;
    name: string;
    birth_date: string;
  };
}

export interface PuppyManagementStats {
  total?: number;
  available?: number;
  reserved?: number;
  sold?: number;
  males?: number;
  females?: number;
  averageAge?: number;
  averageWeight?: number;
  colorDistribution?: Record<string, number>;
  ageDistribution?: Record<string, number>;
  totalPuppies: number;
  availablePuppies?: number;
  reservedPuppies?: number;
  soldPuppies?: number;
  maleCount?: number;
  femaleCount?: number;
  puppiesByColor?: Record<string, number>;
  puppiesByAge?: Record<string, number>;
  activeLitters: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
}

export interface WeightData {
  weight: number;
  unit: WeightUnit;
  date?: string;
  age?: number;
  ageInDays?: number;
}

export interface WeightRecord {
  id: string;
  puppy_id?: string;
  dog_id?: string;
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  unit: WeightUnit;
  notes?: string;
  percent_change?: number | null;
  created_at: string;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_id: string;
  title?: string;
  description?: string;
  expected_age_days?: number;
  completion_date?: string | null;
  milestone_date?: string | null;
  completed?: boolean;
  notes?: string;
}

export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  color?: string;
  examples?: string[];
}

export type SocializationReaction = string;

export interface SocializationReactionType {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category_id: string;
  category?: string;
  experience?: string;
  experience_date?: string;
  date?: string;
  description?: string;
  reaction: SocializationReaction;
  notes?: string;
  created_at?: string;
}

export interface SocializationProgress {
  category: string;
  count: number;
  target: number;
  completionPercentage: number;
  categoryId?: string;
  categoryName?: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
  created_at?: string;
  due_date?: string;
  is_completed?: boolean;
}

export interface VaccinationScheduleItem {
  id: string;
  puppy_id?: string;
  vaccination_type: string;
  due_date: string;
  is_completed?: boolean;
  vaccination_date?: string;
  notes?: string;
}
