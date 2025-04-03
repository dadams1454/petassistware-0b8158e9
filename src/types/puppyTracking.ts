
// Define weight unit enum/type
export type WeightUnit = 'lb' | 'kg' | 'oz' | 'g' | 'lbs';

export interface PuppyWithAge {
  id: string;
  name?: string;
  birth_date?: string;
  color?: string;
  gender?: string;
  status?: string;
  current_weight?: string;
  litter_id?: string;
  ageInDays: number;
  ageInWeeks: number;
  // For backward compatibility
  age_days?: number;
  age_weeks?: number;
}

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  ageGroup: string;
  description: string;
  puppies: PuppyWithAge[];
  count: number;
  minDays: number;
  maxDays: number;
  minAge: any;
  maxAge: any;
  milestones: string[];
  color: string;
  startDay?: number;
  endDay?: number;
  careChecks?: any[];
}

export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  activeLitters: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
  // Include any other stats used in your application
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  unit: WeightUnit; // For backward compatibility
  notes?: string;
  created_at: string;
  percent_change?: number;
  age_days?: number;
}

export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name?: string;
  due_date: string;
  scheduled_date?: string;
  administered: boolean;
  notes?: string;
  created_at?: string;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  title?: string;
  milestone_date: string;
  notes?: string;
  created_at?: string;
  is_completed?: boolean;
  category?: string;
}

export interface SocializationCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
  examples?: string[];
}

export type SocializationReactionType = 'positive' | 'neutral' | 'negative' | 'curious' | 'mixed';

export interface SocializationReaction {
  id: string;
  name: string;
  type: SocializationReactionType;
  description?: string;
}

export interface SocializationReactionObject extends SocializationReaction {
  description?: string;
}

export interface SocializationProgress {
  categoryName: string;
  count: number;
  total: number;
  percentage: number;
  // For backward compatibility
  category_name?: string;
  id?: string;
}
