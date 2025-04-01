
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
  // Add missing properties
  photo_url?: string;
  current_weight?: string;
  litters?: {
    id: string;
    name: string;
    birth_date: string;
  };
}

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  description?: string;
  // Add missing properties
  milestones?: string;
  color?: string;
  careChecks?: string[];
}

export interface SocializationCategory {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  examples: string[];
  // Add missing property
  color?: string;
}

export interface SocializationProgress {
  category: string;
  count: number;
  target: number;
  completionPercentage: number;
  // Add missing properties
  categoryId?: string;
  categoryName?: string;
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
  // Add missing properties
  experience?: string;
  experience_date?: string;
  created_at?: string;
}

// Update SocializationReaction to be an interface instead of a string union
export interface SocializationReactionType {
  id: string;
  name: string;
  color: string;
  order: number;
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
  // Add missing properties
  totalPuppies?: number;
  availablePuppies?: number;
  reservedPuppies?: number;
  soldPuppies?: number;
  maleCount?: number;
  femaleCount?: number;
  averageWeight?: number;
  puppiesByColor?: Record<string, number>;
  puppiesByAge?: Record<string, number>;
  activeLitters?: number;
  upcomingVaccinations?: number;
  recentWeightChecks?: number;
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

export interface WeightData {
  id: string;
  weight: number;
  date: string;
  unit: WeightUnit;
  // Add missing property
  age?: number;
}

export interface PuppyMilestone {
  id: string;
  name: string;
  expected_age_days: number;
  description: string;
  is_required: boolean;
  category: string;
  // Add missing properties
  title?: string;
  completion_date?: string;
  milestone_date?: string;
  notes?: string;
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
