
import { WeightUnit } from './common';

export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Test = 'test',
  Other = 'other'
}

export enum AppetiteLevelEnum {
  Poor = 'poor',
  Normal = 'normal',
  Increased = 'increased'
}

export enum EnergyLevelEnum {
  Low = 'low',
  Normal = 'normal',
  High = 'high'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Loose = 'loose',
  Diarrhea = 'diarrhea',
  Hard = 'hard',
  Constipation = 'constipation'
}

export type HealthRecordType = 
  | 'examination'
  | 'vaccination'
  | 'medication'
  | 'surgery'
  | 'test'
  | 'other';

export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordType;
  visit_date: string;
  vet_name: string;
  vet_clinic?: string;
  title?: string;
  description?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  next_due_date?: string;
  record_notes?: string;
  document_url?: string;
  
  // Vaccination-specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Medication-specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  prescription_number?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  
  // Surgery-specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
  // Common fields
  performed_by?: string;
  reminder_sent?: boolean;
  created_at: string;
}

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  energy?: EnergyLevelEnum | string;
  appetite?: AppetiteLevelEnum | string;
  stool_consistency?: StoolConsistencyEnum | string;
  abnormal?: boolean;
  alert_generated?: boolean;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export interface Medication {
  id: string;
  dog_id: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
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
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

export interface WeightData {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For backward compatibility
  date: string;
  percent_change?: number;
  age_days?: number;
  notes?: string;
  created_at: string;
}

// Utility functions for health record types
export const healthRecordTypeToString = (type: HealthRecordType): string => {
  switch (type) {
    case 'examination': return 'Examination';
    case 'vaccination': return 'Vaccination';
    case 'medication': return 'Medication';
    case 'surgery': return 'Surgery';
    case 'test': return 'Test';
    case 'other': return 'Other';
    default: return type;
  }
};

export const stringToHealthRecordType = (str: string): HealthRecordType => {
  const lowerStr = str.toLowerCase();
  switch (lowerStr) {
    case 'examination': return 'examination';
    case 'vaccination': return 'vaccination';
    case 'medication': return 'medication';
    case 'surgery': return 'surgery';
    case 'test': return 'test';
    default: return 'other';
  }
};
