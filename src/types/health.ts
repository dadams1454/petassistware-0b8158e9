
import type { WeightUnit } from './common';

// Health record type enumeration
export enum HealthRecordTypeEnum {
  EXAMINATION = 'examination',
  VACCINATION = 'vaccination',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  PROCEDURE = 'procedure',
  TEST = 'test',
  DENTAL = 'dental',
  IMAGING = 'imaging',
  DEWORMING = 'deworming',
  GROOMING = 'grooming',
  ALLERGY = 'allergy',
  OBSERVATION = 'observation',
  OTHER = 'other'
}

// Alias type for string representation of health record type
export type HealthRecordType = keyof typeof HealthRecordTypeEnum;

// Appetite level enumeration
export enum AppetiteLevelEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// Energy level enumeration
export enum EnergyLevelEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

// Stool consistency enumeration
export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard',
  MUCOUSY = 'mucousy',
  BLOODY = 'bloody'
}

// Medication status enumeration
export enum MedicationStatusEnum {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DISCONTINUED = 'discontinued',
  SCHEDULED = 'scheduled',
  MISSED = 'missed',
  OVERDUE = 'overdue',
  NOT_STARTED = 'not_started',
  UNKNOWN = 'unknown'
}

// Legacy appetite enum (for backward compatibility)
export enum AppetiteEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

// Legacy energy enum (for backward compatibility)
export enum EnergyEnum {
  Hyperactive = 'hyperactive',
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic'
}

// Type alias for medication status
export type MedicationStatus = keyof typeof MedicationStatusEnum;

// Type for medication status result
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  daysLeft?: number;
  daysOverdue?: number;
  daysActive?: number;
  daysUntilDue?: number | null;
  nextDue?: string | null;
  isActive: boolean;
  isCompleted: boolean;
  isDiscontinued: boolean;
  isScheduled: boolean;
  isMissed: boolean;
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
  prescription_number?: string;
  
  // Examination-specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string | null;
  
  // Surgery-specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
  // Common fields
  vet_clinic?: string;
  performed_by?: string;
  description?: string;
  reminder_sent?: boolean;
}

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit; // Using WeightUnit from common
  date: string;
  notes?: string;
  percent_change?: number;
  puppy_id?: string;
  created_at: string;
  age_days?: number;
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: string;
  energy?: string;
  stool_consistency?: string;
  abnormal?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  alert_generated?: boolean;
}

// Health alert interface
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: string;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Health certificate interface
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

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  created_at: string;
  active: boolean;
  last_administered?: string;
  medication_name?: string;
}

// Medication administration interface
export interface MedicationAdministration {
  id: string;
  dog_id: string;
  medication_id: string;
  administration_date: string;
  administered_by: string;
  notes?: string;
  created_at: string;
  administered_at?: string;
}

// Growth statistics interface
export interface GrowthStats {
  percentChange?: number;
  averageGrowthRate: number;
  projectedWeight?: number;
  weightGoal?: number;
}

// Helper function to map a health record from API to frontend model
export function mapToHealthRecord(record: any): HealthRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    record_type: record.record_type || HealthRecordTypeEnum.EXAMINATION,
    title: record.title || '',
    visit_date: record.visit_date,
    vet_name: record.vet_name || '',
    record_notes: record.record_notes || record.notes || '',
    next_due_date: record.next_due_date,
    document_url: record.document_url,
    created_at: record.created_at,
    
    // Vaccination-specific fields
    vaccine_name: record.vaccine_name,
    manufacturer: record.manufacturer,
    lot_number: record.lot_number,
    expiration_date: record.expiration_date,
    
    // Medication-specific fields
    medication_name: record.medication_name,
    dosage: record.dosage,
    dosage_unit: record.dosage_unit,
    frequency: record.frequency,
    start_date: record.start_date,
    end_date: record.end_date,
    duration: record.duration,
    duration_unit: record.duration_unit,
    administration_route: record.administration_route,
    prescription_number: record.prescription_number,
    
    // Examination-specific fields
    examination_type: record.examination_type,
    findings: record.findings,
    recommendations: record.recommendations,
    follow_up_date: record.follow_up_date,
    
    // Surgery-specific fields
    procedure_name: record.procedure_name,
    surgeon: record.surgeon,
    anesthesia_used: record.anesthesia_used,
    recovery_notes: record.recovery_notes,
    
    // Common fields
    vet_clinic: record.vet_clinic,
    performed_by: record.performed_by,
    description: record.description,
    reminder_sent: record.reminder_sent,
  };
}

// Helper function to map a weight record from API to frontend model
export function mapToWeightRecord(record: any): WeightRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    weight: record.weight,
    weight_unit: record.weight_unit || record.unit || 'lb',
    date: record.date,
    notes: record.notes || '',
    percent_change: record.percent_change,
    puppy_id: record.puppy_id,
    created_at: record.created_at,
    age_days: record.age_days,
  };
}

// Helper function to convert string to HealthRecordType
export function stringToHealthRecordType(value: string): HealthRecordTypeEnum {
  return (HealthRecordTypeEnum as any)[value] || HealthRecordTypeEnum.EXAMINATION;
}

// Export necessary types for external use
export type { WeightUnit };
