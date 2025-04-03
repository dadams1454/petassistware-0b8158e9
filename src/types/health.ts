
import { WeightUnit as CommonWeightUnit } from './common';

// Define weight unit type using the common definition
export type WeightUnit = CommonWeightUnit;

// Using enum with string values for better type-safety and consistency
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Dental = 'dental',
  Allergy = 'allergy',
  Test = 'test',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Other = 'other'
}

// String union type for better compatibility with database
export type HealthRecordType = 
  | 'examination'
  | 'vaccination'
  | 'medication'
  | 'surgery'
  | 'dental'
  | 'allergy'
  | 'test'
  | 'observation'
  | 'deworming'
  | 'grooming'
  | 'other';

export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

export enum EnergyLevelEnum {
  Hyperactive = 'hyperactive',
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic',
  // Add compatibility for older code
  VeryHigh = 'hyperactive',
  VeryLow = 'lethargic'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard',
  Mucousy = 'mucousy',
  Bloody = 'bloody',
  // Add compatibility for older code
  Solid = 'normal',
  SemiSolid = 'soft'
}

export interface HealthRecord {
  id: string;
  dog_id: string;
  title: string;
  record_type: HealthRecordTypeEnum | HealthRecordType;
  visit_date: string;
  record_notes?: string;
  vet_name: string;
  document_url?: string;
  next_due_date?: string;
  created_at: string;
  
  // Additional fields for specific record types
  // Examination
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // Vaccination
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Medication
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
  
  // Surgery
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
  // For UI display
  description?: string;
  date?: string;
  performed_by?: string;
}

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: AppetiteLevelEnum;
  energy: EnergyLevelEnum;
  stool_consistency: StoolConsistencyEnum;
  abnormal: boolean;
  notes?: string;
  alert_generated: boolean;
  created_at: string;
  created_by?: string;
}

export interface Medication {
  id: string;
  dog_id: string; // Reference to the dog
  name: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  administration_route: string;
  notes?: string;
  is_active: boolean;
  last_administered?: string;
  created_at: string;
}

export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

export interface WeightData {
  weight: number;
  unit: WeightUnit;
  date: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  date: string;
  percent_change?: number;
  notes?: string;
  created_at: string;
}

// Helper functions for converting between enum and string types
export const healthRecordTypeToString = (type: HealthRecordTypeEnum): string => {
  return type;
};

export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  return Object.values(HealthRecordTypeEnum).includes(type as HealthRecordTypeEnum)
    ? (type as HealthRecordTypeEnum)
    : HealthRecordTypeEnum.Other;
};
