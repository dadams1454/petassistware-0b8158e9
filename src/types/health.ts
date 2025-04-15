
/**
 * Health-related type definitions
 */

// Define enums that are used throughout the app
export enum HealthRecordTypeEnum {
  VACCINATION = 'VACCINATION',
  EXAMINATION = 'EXAMINATION',
  MEDICATION = 'MEDICATION',
  SURGERY = 'SURGERY',
  TEST = 'TEST',
  OTHER = 'OTHER',
  Examination = 'EXAMINATION', // For backwards compatibility
  Vaccination = 'VACCINATION'  // For backwards compatibility
}

export enum AppetiteLevel {
  NORMAL = 'NORMAL',
  REDUCED = 'REDUCED',
  INCREASED = 'INCREASED',
  NONE = 'NONE'
}

export enum EnergyLevel {
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  HIGH = 'HIGH',
  LETHARGIC = 'LETHARGIC'
}

export enum StoolConsistency {
  NORMAL = 'NORMAL',
  LOOSE = 'LOOSE',
  WATERY = 'WATERY',
  HARD = 'HARD',
  BLOODY = 'BLOODY',
  NONE = 'NONE'
}

export enum MedicationStatusEnum {
  DUE = 'due',
  OVERDUE = 'overdue',
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  UNKNOWN = 'unknown'
}

export enum WeightUnitEnum {
  LB = 'lb',
  OZ = 'oz',
  KG = 'kg',
  G = 'g'
}

// For backwards compatibility
export type HealthRecordType = HealthRecordTypeEnum;

// Weight units
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  record_type: HealthRecordType;
  title?: string;
  date: string;
  visit_date?: string;
  record_notes?: string;
  description?: string; // Add for backward compatibility
  document_url?: string;
  created_at: string;
  updated_at?: string;
  next_due_date?: string;
  performed_by?: string;
  vet_name?: string;
  
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
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  
  // Examination-specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // Surgery-specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  name: string;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  created_at: string;
  record_id?: string;
  status?: string;
  date?: string;
  
  // Extended properties for medication tracking
  administration_route?: string;
  last_administered?: string;
  is_active?: boolean;
}

// Medication administration record
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_date: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Health indicator (vital signs) interface
export interface HealthIndicator {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  date: string;
  appetite: AppetiteLevel;
  energy: EnergyLevel;
  stool_consistency: StoolConsistency;
  abnormal?: boolean;
  alert_generated?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  
  // For compatibility with existing code
  name?: string;
  value?: string;
}

// Health certificate type
export interface HealthCertificate {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  issue_date: string;
  expiry_date?: string;
  certificate_type: string;
  issuer: string;
  certificate_number?: string;
  document_url?: string;
  file_url?: string; // For backward compatibility
  notes?: string;
  created_at: string;
}

// Health alert interface
export interface HealthAlert {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  resolved: boolean;
  created_at: string;
  resolved_at?: string;
  record_id?: string;
}

// Weight record
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}

// Export everything needed
export { WeightUnit };
