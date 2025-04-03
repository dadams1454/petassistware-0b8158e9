
import { WeightUnitValue } from './litter';

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  title: string;
  expected_age_days: number;
  is_completed: boolean;
  completion_date?: string;
  notes?: string;
  created_at: string;
}

export interface WeightRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnitValue;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at?: string;
}

export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

export interface SocializationCategory {
  id: string;
  name: string;
  description?: string;
  examples?: string[];
  color?: string;
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category_id: string;
  experience: string;
  date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface HealthRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  date: string;
  notes?: string;
  created_at: string;
}

export enum HealthRecordTypeEnum {
  VACCINATION = 'vaccination',
  EXAMINATION = 'examination',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  TEST = 'test',
  OTHER = 'other'
}

export interface PuppyVaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name: string;
  due_date: string;
  administered: boolean;
  notes?: string;
  created_at?: string;
}

// Add missing interfaces that are being imported elsewhere
export interface PuppyWithAge {
  id: string;
  name: string;
  gender: string;
  color: string;
  birth_date: string;
  litter_id: string;
  status: string;
  photo_url?: string;
  current_weight?: string;
  ageInDays: number;
  age_days?: number;
  ageInWeeks?: number;
  age_weeks?: number;
  ageDescription?: string;
  litters?: {
    id: string;
    name?: string;
    birth_date: string;
  };
  birth_order?: number;
}

export interface AgeGroup {
  id: string;
  name: string;
  description: string;
  startDay: number;
  endDay: number;
  color: string;
  careChecks?: string[];
  milestones?: string[];
}

export interface PuppyAgeGroupData extends AgeGroup {
  count?: number;
  puppies?: PuppyWithAge[];
}

export interface PuppyManagementStats {
  totalCount?: number;
  byStatus?: Record<string, number>;
  byGender?: {
    male: number;
    female: number;
    unknown: number;
  };
  byColor?: Record<string, number>;
  byAgeGroup?: Record<string, number>;
  weightRanges?: {
    min: number;
    max: number;
    avg: number;
    unit: string;
  };
  adoptionRate?: number;
  reservationRate?: number;
  totalPuppies: number;
  totalLitters: number;
  activeLitters: number;
  availablePuppies: number;
  reservedPuppies: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
  puppiesByAgeGroup?: Record<string, number>;
  weightCompletionRate?: number;
  vaccinationCompletionRate?: number;
}

export interface PuppyWeightRecord extends WeightRecord {
  puppy_id: string;
}

export interface PuppyHealthRecord extends HealthRecord {
  puppy_id: string;
}

export interface VaccinationRecord {
  id: string;
  name: string;
  date: string;
  next_due?: string;
  notes?: string;
}

export interface PuppyVaccinationRecord extends VaccinationRecord {
  puppy_id: string;
}

export interface VaccinationScheduleItem {
  id: string;
  type: string;
  name: string;
  due_date: string;
  administered: boolean;
  notes?: string;
}

export interface SocializationReactionType {
  id: string;
  name: string;
}

export interface SocializationReaction {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface SocializationReactionObject {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface SocializationProgress {
  category: string;
  count: number;
  progress: number;
  color?: string;
}
