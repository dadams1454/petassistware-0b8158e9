
import { WeightUnit } from './common';

// Health record type enum
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
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

// String to HealthRecordType converter
export const stringToHealthRecordType = (str: string): HealthRecordTypeEnum => {
  const type = Object.values(HealthRecordTypeEnum).find(
    value => value.toLowerCase() === str.toLowerCase()
  );
  return type || HealthRecordTypeEnum.Other;
};

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum | string;
  title?: string;
  visit_date: string;
  date?: string; // Alias for visit_date to support legacy code
  vet_name: string;
  description?: string;
  document_url?: string;
  record_notes?: string;
  created_at: string;
  next_due_date?: string;
  performed_by?: string;
  
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

// Convert data to health record
export const mapToHealthRecord = (data: any): HealthRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    record_type: data.record_type,
    title: data.title,
    visit_date: data.visit_date,
    date: data.visit_date, // Set date alias to visit_date
    vet_name: data.vet_name,
    description: data.description,
    document_url: data.document_url,
    record_notes: data.record_notes,
    created_at: data.created_at,
    next_due_date: data.next_due_date,
    performed_by: data.performed_by,
    vaccine_name: data.vaccine_name,
    manufacturer: data.manufacturer,
    lot_number: data.lot_number,
    expiration_date: data.expiration_date,
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
  };
};

// Appetite enum for health indicators
export enum AppetiteEnum {
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
  NONE = "NONE"
}

// User-friendly appetite levels
export enum AppetiteLevelEnum {
  Excellent = "excellent",
  Good = "good",
  Fair = "fair",
  Poor = "poor",
  None = "none"
}

// Energy enum for health indicators
export enum EnergyEnum {
  HIGH = "HIGH",
  NORMAL = "NORMAL",
  LOW = "LOW",
  LETHARGIC = "LETHARGIC"
}

// User-friendly energy levels
export enum EnergyLevelEnum {
  Hyperactive = "hyperactive",
  High = "high",
  Normal = "normal",
  Low = "low",
  Lethargic = "lethargic"
}

// Stool consistency enum for health indicators
export enum StoolConsistencyEnum {
  NORMAL = "NORMAL",
  SOFT = "SOFT",
  LOOSE = "LOOSE",
  WATERY = "WATERY",
  HARD = "HARD",
  MUCOUSY = "MUCOUSY",
  BLOODY = "BLOODY"
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
  created_by: string;
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
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
  created_at: string;
  veterinarian: string;
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

// Convert data to weight record
export const mapToWeightRecord = (data: any): WeightRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    puppy_id: data.puppy_id,
    weight: data.weight,
    weight_unit: data.weight_unit || data.unit,
    date: data.date,
    notes: data.notes,
    percent_change: data.percent_change,
    created_at: data.created_at,
    age_days: data.age_days,
    birth_date: data.birth_date,
  };
};

// Growth statistics interface
export interface GrowthStats {
  currentWeight: number;
  weightUnit: string;
  averageGrowth: number;
  growthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
  percentChange: number;
  averageGrowthRate: number;
  weightGoal: number | null;
  onTrack: boolean | null;
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
  active: boolean;
  notes?: string;
  created_at: string;
  last_administered?: string;
}

// Medication status enum
export enum MedicationStatusEnum {
  Active = 'active',
  Completed = 'completed',
  Overdue = 'overdue',
  UpToDate = 'up_to_date',
  Unknown = 'unknown'
}

// Medication status type
export type MedicationStatus = 'active' | 'completed' | 'overdue' | 'up_to_date' | 'unknown';

// Medication status result
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  overdue: boolean;
  daysUntilNext: number | null;
  nextDueDate: Date | null;
  message: string;
}

// Medication administration record
export interface MedicationAdministration {
  id: string;
  dog_id: string;
  medication_id: string;
  administration_date: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Vaccination schedule interface
export interface VaccinationSchedule {
  id: string;
  dog_id: string;
  puppy_id?: string;
  vaccine_name: string;
  scheduled_date: string;
  due_date?: string;
  administered: boolean;
  administered_date?: string;
  notes?: string;
  created_at: string;
}
