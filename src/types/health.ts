
import { WeightUnit } from './common';

// Medication status enum
export enum MedicationStatusEnum {
  Active = 'Active',
  Upcoming = 'Upcoming',
  Overdue = 'Overdue',
  Completed = 'Completed',
  Unknown = 'Unknown'
}

// Medication status type for compatibility
export type MedicationStatus = MedicationStatusEnum | string;

// Result type for medication status processing
export interface MedicationStatusResult {
  status: MedicationStatus;
  statusLabel: string;
  statusColor: string;
  nextDue?: string;
  emoji?: string;
}

// Health record type enum
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Test = 'test',
  Other = 'other'
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  visit_date: string;
  vet_name: string;
  record_notes?: string;
  next_due_date?: string | null;
  document_url?: string;
  created_at: string;
  updated_at?: string;
  
  // Vaccination specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  
  // Medication specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  
  // Examination specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string | null;
  
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Helper function to convert string to HealthRecordTypeEnum
export function stringToHealthRecordType(value: string): HealthRecordTypeEnum {
  switch (value) {
    case 'examination':
      return HealthRecordTypeEnum.Examination;
    case 'vaccination':
      return HealthRecordTypeEnum.Vaccination;
    case 'medication':
      return HealthRecordTypeEnum.Medication;
    case 'surgery':
      return HealthRecordTypeEnum.Surgery;
    case 'test':
      return HealthRecordTypeEnum.Test;
    default:
      return HealthRecordTypeEnum.Other;
  }
}

// Appetite level enum
export enum AppetiteLevelEnum {
  Excellent = 'Excellent',
  Good = 'Good',
  Normal = 'Normal',
  Poor = 'Poor',
  None = 'None'
}

// Energy level enum
export enum EnergyLevelEnum {
  High = 'High',
  Normal = 'Normal',
  Low = 'Low',
  Lethargic = 'Lethargic',
  Hyperactive = 'Hyperactive'
}

// Stool consistency enum
export enum StoolConsistencyEnum {
  Normal = 'Normal',
  Hard = 'Hard',
  Soft = 'Soft',
  Loose = 'Loose',
  Watery = 'Watery'
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: string;
  energy: string;
  stool_consistency: string;
  water_intake?: string;
  vomiting?: boolean;
  coughing?: boolean;
  sneezing?: boolean;
  breathing_issues?: boolean;
  abnormal?: boolean;
  alert_generated?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}
