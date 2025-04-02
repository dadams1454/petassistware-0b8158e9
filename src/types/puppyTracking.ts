
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
