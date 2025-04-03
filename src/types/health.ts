
// Define weight unit enum/type
export type WeightUnit = 'lb' | 'kg' | 'oz' | 'g' | 'lbs';

// Using enum with string values for better type-safety
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
  record_type: HealthRecordTypeEnum | string;
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
  expiration_date?: string;
  
  // Vaccination
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  
  // Surgery
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
  // For backward compatibility
  description?: string;
  date?: string;
  performed_by?: string;
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
  // Add for compatibility
  age_days?: number;
}

export interface WeightData {
  weight: number;
  unit: WeightUnit;
  date: string;
  age?: number;
  // Add for compatibility with other code
  weights?: number[];
}

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: AppetiteLevelEnum | string;
  energy: EnergyLevelEnum | string;
  stool_consistency: StoolConsistencyEnum | string;
  abnormal: boolean;
  notes?: string;
  created_by?: string;
  created_at?: string;
  alert_generated?: boolean;
}

// Add missing types
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  administration_route: string;
  notes?: string;
  created_at: string;
  is_active: boolean;
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
