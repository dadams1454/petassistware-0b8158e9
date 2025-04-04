
import { WeightUnit } from './common';

// Health record type enum
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Laboratory = 'laboratory',
  Imaging = 'imaging',
  Dental = 'dental',
  Allergy = 'allergy',
  Emergency = 'emergency',
  Preventive = 'preventive',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Test = 'test',
  Other = 'other',
  Procedure = 'procedure'
}

// Helper function to convert string to HealthRecordTypeEnum
export function stringToHealthRecordType(recordType: string): HealthRecordTypeEnum {
  if (Object.values(HealthRecordTypeEnum).includes(recordType as HealthRecordTypeEnum)) {
    return recordType as HealthRecordTypeEnum;
  }
  return HealthRecordTypeEnum.Other;
}

// Health Record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title?: string;
  visit_date: string;
  date?: string; // For compatibility
  vet_name: string;
  description?: string;
  document_url?: string;
  record_notes?: string;
  created_at: string;
  next_due_date?: string;
  performed_by?: string;
  expiration_date?: string;
  
  // Field groups for specific record types
  // Vaccination
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  
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
  
  // Examination
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // Surgery
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Medication status enum
export enum MedicationStatusEnum {
  Active = 'active',
  Completed = 'completed',
  Discontinued = 'discontinued',
  OnHold = 'on-hold',
  Scheduled = 'scheduled',
  NotStarted = 'not_started',
  Unknown = 'unknown'
}

// Define the MedicationStatus type as a string that can be one of the enum values
export type MedicationStatus = string;

// Define MedicationStatusResult interface
export interface MedicationStatusResult {
  status: MedicationStatusEnum | string;
  nextDue?: string;
  lastAdministered?: string;
}

// Medication status interface
export interface MedicationStatusInfo {
  id: string;
  medication_id: string;
  status: MedicationStatusEnum;
  start_date?: string;
  end_date?: string;
  reason?: string;
  created_at: string;
  created_by?: string;
}

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  puppy_id?: string; // Added for compatibility with puppy weight records
  age_days?: number; // Added for puppy weight tracking
  birth_date?: string; // Added for puppy weight reference
}

// Health indicator status enum
export enum HealthIndicatorStatusEnum {
  Normal = 'normal',
  Abnormal = 'abnormal',
  Critical = 'critical',
  Unknown = 'unknown'
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: string;
  energy?: string;
  stool_consistency?: string;
  abnormal: boolean;
  notes?: string;
  alert_generated: boolean;
  created_at: string;
  created_by?: string;
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

// Vaccination interface
export interface Vaccination {
  id: string;
  dog_id: string;
  puppy_id?: string;
  vaccination_type: string;
  vaccination_date: string;
  lot_number?: string;
  administered_by?: string;
  notes?: string;
  created_at: string;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  puppy_id?: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
  is_active?: boolean;
  last_administered?: string;
  notes?: string;
  created_at: string;
}

// Medication administration interface
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_date: string;
  administered_at?: string; // For backward compatibility
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Health Certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuing_authority: string;
  issuer?: string; // For backward compatibility
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Re-export WeightUnit for use in other modules
export type { WeightUnit };

// Helper functions
export function mapToHealthRecord(data: any): HealthRecord {
  return {
    id: data.id,
    dog_id: data.dog_id,
    record_type: stringToHealthRecordType(data.record_type),
    title: data.title,
    visit_date: data.visit_date || data.date,
    date: data.date || data.visit_date,
    vet_name: data.vet_name,
    description: data.description,
    document_url: data.document_url,
    record_notes: data.record_notes || data.notes,
    created_at: data.created_at,
    next_due_date: data.next_due_date,
    performed_by: data.performed_by,
    vaccine_name: data.vaccine_name,
    manufacturer: data.manufacturer,
    lot_number: data.lot_number,
    medication_name: data.medication_name,
    dosage: data.dosage,
    dosage_unit: data.dosage_unit,
    frequency: data.frequency,
    start_date: data.start_date,
    end_date: data.end_date,
    duration: data.duration,
    duration_unit: data.duration_unit,
    administration_route: data.administration_route,
    examination_type: data.examination_type,
    findings: data.findings,
    recommendations: data.recommendations,
    follow_up_date: data.follow_up_date,
    procedure_name: data.procedure_name,
    surgeon: data.surgeon,
    anesthesia_used: data.anesthesia_used,
    recovery_notes: data.recovery_notes,
    expiration_date: data.expiration_date,
  };
}

// Add the mapToWeightRecord function
export function mapToWeightRecord(data: any): WeightRecord {
  return {
    id: data.id,
    dog_id: data.dog_id,
    weight: Number(data.weight),
    weight_unit: data.weight_unit as WeightUnit,
    unit: data.weight_unit as WeightUnit, // For compatibility
    date: data.date,
    notes: data.notes || '',
    percent_change: data.percent_change,
    created_at: data.created_at,
    puppy_id: data.puppy_id,
    age_days: data.age_days,
    birth_date: data.birth_date
  };
}

// Growth stats interface
export interface GrowthStats {
  currentWeight: number;
  weightUnit: WeightUnit;
  percentChange: number;
  averageGrowth: number;
  growthRate: number;
  averageGrowthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
  weightGoal: number | null;
  onTrack: boolean | null;
}

// Appetite level enum
export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none',
  Hyperactive = 'hyperactive'
}

// Energy level enum
export enum EnergyLevelEnum {
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic',
  Hyperactive = 'hyperactive'
}

// Stool consistency enum
export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard',
  None = 'none',
  Mucousy = 'mucousy',
  Bloody = 'bloody'
}

// For backward compatibility
export const AppetiteEnum = AppetiteLevelEnum;
export const EnergyEnum = EnergyLevelEnum;

// Vaccination schedule
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name?: string;
  scheduled_date: string;
  due_date?: string;
  notes?: string;
  administered: boolean;
  created_at: string;
}
