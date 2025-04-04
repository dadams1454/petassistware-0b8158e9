
import { WeightUnit } from './common';

// Health record types
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
  Procedure = 'procedure',
  Other = 'other'
}

// Appetite level enum
export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good', 
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

// Energy level enum
export enum EnergyLevelEnum {
  Hyperactive = 'hyperactive',
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic'
}

// Stool consistency enum
export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard',
  Mucousy = 'mucousy',
  Bloody = 'bloody'
}

// Compatible with legacy AppetiteEnum for backward compatibility
export enum AppetiteEnum {
  Excellent = 'excellent',
  Good = 'good', 
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

// Compatible with legacy EnergyEnum for backward compatibility
export enum EnergyEnum {
  Hyperactive = 'hyperactive',
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic'
}

// Medication status enum
export enum MedicationStatusEnum {
  Active = 'active',
  Completed = 'completed',
  Discontinued = 'discontinued',
  OnHold = 'on-hold',
  Scheduled = 'scheduled',
  NotStarted = 'not_started'
}

// Type for medication status (string based)
export type MedicationStatus = 
  | 'active'
  | 'completed'
  | 'discontinued'
  | 'on-hold'
  | 'scheduled'
  | 'not_started'
  | 'overdue'
  | 'upcoming';

// Interface for medication status result
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  nextDue?: string;
  lastAdministered?: string;
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  date?: string;
  visit_date?: string; 
  vet_name?: string;
  vet_clinic?: string;
  findings?: string;
  recommendations?: string;
  next_due_date?: string;
  follow_up_date?: string;
  document_url?: string;
  created_at: string;
  
  // Medication specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  
  // Vaccination specific fields
  vaccine_name?: string;
  lot_number?: string;
  manufacturer?: string;
  expiration_date?: string;
  
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  duration?: number;
  duration_unit?: string;
  recovery_notes?: string;
  
  // Additional fields
  record_notes?: string;
  performed_by?: string;
  reminder_sent?: boolean;
  prescription_number?: string;
  examination_type?: string;
}

// Converts a string to HealthRecordTypeEnum safely
export function stringToHealthRecordType(type: string): HealthRecordTypeEnum {
  if (Object.values(HealthRecordTypeEnum).includes(type as HealthRecordTypeEnum)) {
    return type as HealthRecordTypeEnum;
  }
  return HealthRecordTypeEnum.Other;
}

// Maps data from API to HealthRecord type
export function mapToHealthRecord(data: any): HealthRecord {
  return {
    id: data.id,
    dog_id: data.dog_id,
    record_type: stringToHealthRecordType(data.record_type),
    title: data.title || '',
    description: data.description || '',
    date: data.date || data.visit_date,
    visit_date: data.visit_date || data.date,
    vet_name: data.vet_name || '',
    vet_clinic: data.vet_clinic || '',
    findings: data.findings || '',
    recommendations: data.recommendations || '',
    next_due_date: data.next_due_date || '',
    follow_up_date: data.follow_up_date || '',
    document_url: data.document_url || '',
    created_at: data.created_at || new Date().toISOString(),
    
    medication_name: data.medication_name || '',
    dosage: data.dosage ? Number(data.dosage) : undefined,
    dosage_unit: data.dosage_unit || '',
    frequency: data.frequency || '',
    administration_route: data.administration_route || '',
    start_date: data.start_date || '',
    end_date: data.end_date || '',
    
    vaccine_name: data.vaccine_name || '',
    lot_number: data.lot_number || '',
    manufacturer: data.manufacturer || '',
    expiration_date: data.expiration_date || '',
    
    procedure_name: data.procedure_name || '',
    surgeon: data.surgeon || '',
    anesthesia_used: data.anesthesia_used || '',
    duration: data.duration ? Number(data.duration) : undefined,
    duration_unit: data.duration_unit || '',
    recovery_notes: data.recovery_notes || '',
    
    record_notes: data.record_notes || '',
    performed_by: data.performed_by || '',
    reminder_sent: !!data.reminder_sent,
    prescription_number: data.prescription_number || '',
    examination_type: data.examination_type || ''
  };
}

// Growth statistics interface
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

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteLevelEnum;
  energy?: EnergyLevelEnum;
  stool_consistency?: StoolConsistencyEnum;
  temperature?: number;
  heart_rate?: number;
  respiration_rate?: number;
  abnormal: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Health alert interface
export interface HealthAlert {
  id: string;
  dog_id: string;
  alert_type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  indicator_id?: string;
}

// Medication interface
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
  status: MedicationStatus;
  notes?: string;
  created_at: string;
}

// Medication administration log
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
  skipped: boolean;
  skip_reason?: string;
}

// Vaccination schedule interface
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  scheduled_date: string;
  due_date: string;
  administered?: boolean;
  administered_date?: string;
  notes?: string;
  created_at: string;
  vaccine_name?: string;
}

// Health certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  issue_date: string;
  expiry_date?: string;
  certificate_type: string;
  certificate_number?: string;
  issuing_vet: string;
  issuing_clinic?: string;
  document_url?: string;
  notes?: string;
  created_at: string;
}

// Map function to convert from database record to weight record
export function mapToWeightRecord(dbRecord: any): WeightRecord {
  return {
    id: dbRecord.id,
    dog_id: dbRecord.dog_id,
    puppy_id: dbRecord.puppy_id || null,
    weight: Number(dbRecord.weight),
    weight_unit: dbRecord.weight_unit as WeightUnit,
    date: dbRecord.date,
    notes: dbRecord.notes || '',
    percent_change: dbRecord.percent_change ? Number(dbRecord.percent_change) : 0,
    created_at: dbRecord.created_at,
    age_days: dbRecord.age_days || null,
    birth_date: dbRecord.birth_date || null
  };
}
