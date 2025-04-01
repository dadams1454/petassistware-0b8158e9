
export interface PuppyWithAge {
  id: string;
  name: string;
  litter_id: string;
  birth_date: string;
  gender: string;
  color: string;
  microchip_number?: string;
  status: string;
  ageInDays: number;
  weight?: number;
  weight_unit?: string;
  sale_price?: number;
  reservation_id?: string;
  customer_id?: string;
  collar_color?: string;
  markings?: string;
}

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  description?: string;
}

export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  color: string;
  examples: string[];
}

export interface SocializationProgress {
  categoryId: string;
  categoryName: string;
  count: number;
  target: number;
  completionPercentage: number;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category_id: string;
  date: string;
  description: string;
  location?: string;
  reaction: SocializationReaction;
  notes?: string;
}

export type SocializationReaction = 'positive' | 'neutral' | 'negative' | 'fearful' | 'excited';

export interface PuppyManagementStats {
  total: number;
  available: number;
  reserved: number;
  sold: number;
  male: number;
  female: number;
  average_age: number;
  total_litters: number;
}

export interface WeightRecord {
  id: string;
  puppy_id?: string;
  dog_id?: string;
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  notes?: string;
  percent_change?: number | null;
  created_at: string;
  birth_date?: string;
}

export type WeightUnit = 'oz' | 'g' | 'lbs' | 'kg';

export interface WeightData {
  id: string;
  weight: number;
  date: string;
  age: number; // Age in days
  unit: WeightUnit;
}

export interface PuppyMilestone {
  id: string;
  name: string;
  expected_age_days: number;
  description: string;
  is_required: boolean;
  category: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  due_date?: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
  created_at: string;
  is_completed?: boolean;
}

export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  is_completed: boolean;
  notes?: string;
  vaccination_date?: string;
}
