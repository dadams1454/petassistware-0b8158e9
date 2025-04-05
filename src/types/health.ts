
// Health-related types and enums

import { WeightUnit } from './common';

// Health record type enumeration with standardized naming
export enum HealthRecordTypeEnum {
  VACCINATION = 'vaccination',
  EXAMINATION = 'examination',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  LABORATORY = 'laboratory',
  PREVENTIVE = 'preventive'
}

// For backward compatibility with lowercase versions
export const HealthRecordType = {
  Vaccination: HealthRecordTypeEnum.VACCINATION,
  Examination: HealthRecordTypeEnum.EXAMINATION,
  Medication: HealthRecordTypeEnum.MEDICATION,
  Surgery: HealthRecordTypeEnum.SURGERY,
  Laboratory: HealthRecordTypeEnum.LABORATORY,
  Preventive: HealthRecordTypeEnum.PREVENTIVE
};

// Function to convert string to health record type
export function stringToHealthRecordType(type: string): HealthRecordTypeEnum {
  switch (type.toLowerCase()) {
    case 'vaccination':
      return HealthRecordTypeEnum.VACCINATION;
    case 'examination':
      return HealthRecordTypeEnum.EXAMINATION;
    case 'medication':
      return HealthRecordTypeEnum.MEDICATION;
    case 'surgery':
      return HealthRecordTypeEnum.SURGERY;
    case 'laboratory':
      return HealthRecordTypeEnum.LABORATORY;
    case 'preventive':
      return HealthRecordTypeEnum.PREVENTIVE;
    default:
      return HealthRecordTypeEnum.EXAMINATION;
  }
}

// Enum for medication status
export enum MedicationStatusEnum {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DISCONTINUED = 'discontinued'
}

// Enum for appetite level
export enum AppetiteLevelEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// Backwards compatibility
export const AppetiteEnum = {
  Excellent: AppetiteLevelEnum.EXCELLENT,
  Good: AppetiteLevelEnum.GOOD,
  Fair: AppetiteLevelEnum.FAIR,
  Poor: AppetiteLevelEnum.POOR,
  None: AppetiteLevelEnum.NONE
};

// Enum for energy level
export enum EnergyLevelEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

// Backwards compatibility
export const EnergyEnum = {
  Hyperactive: EnergyLevelEnum.HYPERACTIVE,
  High: EnergyLevelEnum.HIGH,
  Normal: EnergyLevelEnum.NORMAL,
  Low: EnergyLevelEnum.LOW,
  Lethargic: EnergyLevelEnum.LETHARGIC
};

// Enum for stool consistency
export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  LOOSE = 'loose',
  DIARRHEA = 'diarrhea',
  CONSTIPATED = 'constipated',
  HARD = 'hard'
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  visit_date: string;
  date?: string; // Alias for visit_date for compatibility
  vet_name: string;
  vet_clinic?: string;
  record_notes?: string;
  next_due_date?: string;
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
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  prescription_number?: string;
  performed_by?: string;
  
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
  
  // General fields
  description?: string;
  created_at: string;
}

// Interface for medication status results
export interface MedicationStatusResult {
  status: string;
  daysLeft?: number;
  nextDose?: Date;
  isOverdue?: boolean;
  lastAdministered?: Date;
}

export interface MedicationStatus {
  dueTime?: Date;
  isOverdue: boolean;
  status: string;
  lastGiven?: Date;
  daysRemaining?: number;
  active: boolean;
}

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
}

// Growth statistics interface
export interface GrowthStats {
  currentWeight?: number;
  previousWeight?: number;
  weight_unit?: WeightUnit;
  percentChange?: number;
  averageGrowthRate?: number;
  projectedWeight?: number;
  weightGoal?: number;
  onTrack?: boolean;
  trend?: 'up' | 'down' | 'stable';
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
  alert_generated?: boolean;
  created_by?: string;
  created_at: string;
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
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  active: boolean;
  last_administered?: string;
  created_at: string;
}

// Medication administration interface
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administration_date: string;
  administered_by: string;
  administered_at: string;
  notes?: string;
  created_at: string;
}

// Helper function to map database row to health record
export function mapToHealthRecord(row: any): HealthRecord {
  return {
    id: row.id,
    dog_id: row.dog_id,
    record_type: stringToHealthRecordType(row.record_type),
    title: row.title || '',
    visit_date: row.visit_date,
    date: row.visit_date, // Alias for compatibility
    vet_name: row.vet_name || '',
    vet_clinic: row.vet_clinic,
    record_notes: row.record_notes,
    next_due_date: row.next_due_date,
    document_url: row.document_url,
    vaccine_name: row.vaccine_name,
    manufacturer: row.manufacturer,
    lot_number: row.lot_number,
    expiration_date: row.expiration_date,
    medication_name: row.medication_name,
    dosage: row.dosage,
    dosage_unit: row.dosage_unit,
    frequency: row.frequency,
    start_date: row.start_date,
    end_date: row.end_date,
    duration: row.duration,
    duration_unit: row.duration_unit,
    administration_route: row.administration_route,
    prescription_number: row.prescription_number,
    performed_by: row.performed_by,
    examination_type: row.examination_type,
    findings: row.findings,
    recommendations: row.recommendations,
    follow_up_date: row.follow_up_date,
    procedure_name: row.procedure_name,
    surgeon: row.surgeon,
    anesthesia_used: row.anesthesia_used,
    recovery_notes: row.recovery_notes,
    description: row.description,
    created_at: row.created_at
  };
}

// Helper function to map database row to weight record
export function mapToWeightRecord(row: any): WeightRecord {
  return {
    id: row.id,
    dog_id: row.dog_id,
    puppy_id: row.puppy_id,
    weight: row.weight,
    weight_unit: row.weight_unit,
    date: row.date,
    notes: row.notes,
    percent_change: row.percent_change,
    created_at: row.created_at,
    age_days: row.age_days
  };
}
