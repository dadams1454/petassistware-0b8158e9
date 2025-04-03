import { WeightUnit as CommonWeightUnit } from './common';

export type WeightUnit = CommonWeightUnit;

export interface PuppyWithAge {
  id: string;
  name?: string;
  gender?: string;
  color?: string;
  birth_date: string;
  photo_url?: string;
  birth_weight?: string | number;
  current_weight?: string | number;
  litter_id?: string;
  age_days?: number;
  age_weeks?: number;
  ageInDays?: number;
  ageInWeeks?: number;
  status?: string;
  birth_order?: number;
  // Added fields for backward compatibility
  ageDescription?: string;
  litters?: {
    id: string;
    name?: string;
    birth_date: string;
  };
}

export interface PuppyAgeGroupData {
  groupName: string;
  ageRange: string;
  description: string;
  imageUrl: string;
}

export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  averageWeight: number;
  averagePrice: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  puppyStatusCounts: { [key: string]: number };
  totalCount?: number;  // Added for backward compatibility
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  unit: WeightUnit; // For compatibility
  date: string;
  notes?: string;
  created_at: string;
  percent_change?: number;
  birth_date?: string; // For calculating age
  age_days?: number;
}

export interface SocializationCategory {
  id: string;
  name: string;
}

export interface SocializationReactionObject {
  id: string;
  name: string;
  color: string;
}

export interface SocializationReaction {
  category: SocializationCategory;
  reaction: SocializationReactionObject;
  notes?: string;
}

export interface SocializationProgress {
  category: SocializationCategory;
  progress: number;
}

export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category_id: string;
  experience: string;
  experience_date: string;
  reaction_id?: string;
  notes?: string;
  created_at: string;
}
