
import { WeightUnit } from './common';

// Health Record Types
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Dental = 'dental',
  Allergy = 'allergy',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Test = 'test',
  Other = 'other'
}

// Helper function to convert string to enum
export function stringToHealthRecordType(value: string): HealthRecordTypeEnum {
  switch (value.toLowerCase()) {
    case 'vaccination': return HealthRecordTypeEnum.Vaccination;
    case 'examination': return HealthRecordTypeEnum.Examination;
    case 'medication': return HealthRecordTypeEnum.Medication;
    case 'surgery': return HealthRecordTypeEnum.Surgery;
    case 'dental': return HealthRecordTypeEnum.Dental;
    case 'allergy': return HealthRecordTypeEnum.Allergy;
    case 'observation': return HealthRecordTypeEnum.Observation;
    case 'deworming': return HealthRecordTypeEnum.Deworming;
    case 'grooming': return HealthRecordTypeEnum.Grooming;
    case 'test': return HealthRecordTypeEnum.Test;
    case 'other': return HealthRecordTypeEnum.Other;
    default: return HealthRecordTypeEnum.Examination;
  }
}

// Base Health Record interface
export interface HealthRecord {
  id: string;
  dog_id?: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  visit_date: string;
  record_notes?: string;
  vet_name: string;
  document_url?: string;
  next_due_date?: string | null;
  created_at?: string;
  
  // Added for compatibility with existing code
  date?: string;
  description?: string;
  performed_by?: string;
  
  // Fields for vaccination records
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Fields for medication records
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  prescription_number?: string;
  
  // Fields for examination records
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string | null;
  
  // Fields for surgery records
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Weight tracking interfaces
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  puppy_id?: string;
  age_days?: number;
}

// Health indicator enums
export enum AppetiteEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

export enum EnergyLevelEnum {
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic',
  Hyperactive = 'hyperactive'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard',
  Mucousy = 'mucousy',
  Bloody = 'bloody'
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: AppetiteEnum;
  energy_level: EnergyLevelEnum;
  stool_consistency: StoolConsistencyEnum;
  abnormal: boolean;
  notes?: string;
  alert_generated?: boolean;
  created_at: string;
  created_by?: string;
  water_intake?: string;
  urination?: string;
  
  // For compatibility with existing code
  energy?: string;
}

// Health alert interface
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: 'active' | 'resolved';
  resolved: boolean;
  resolved_at?: string | null;
  created_at: string;
}

// Growth statistics interface
export interface GrowthStats {
  percentChange: number;
  averageGrowthRate: number;
  weightGoal?: number;
  projectedWeight?: number;
  onTrack?: boolean;
}
