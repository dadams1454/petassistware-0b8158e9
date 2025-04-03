
import { WeightUnit } from './common';

// Health Record Types - using const enum for better TypeScript compatibility
export const enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Dental = 'dental',
  Allergy = 'allergy',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Test = 'test',
  Other = 'other'
}

// Export the type for usage in components
export type HealthRecordType = keyof typeof HealthRecordTypeEnum;

// Helper function to convert string to enum
export function stringToHealthRecordType(value: string): HealthRecordTypeEnum {
  switch (value.toLowerCase()) {
    case 'vaccination': return HealthRecordTypeEnum.Vaccination;
    case 'examination': return HealthRecordTypeEnum.Examination;
    case 'medication': return HealthRecordTypeEnum.Medication;
    case 'surgery': return HealthRecordTypeEnum.Surgery;
    case 'dental': return HealthRecordTypeEnum.Dental;
    case 'allergy': return HealthRecordTypeEnum.Allergy;
    case 'observation': return HealthRecordTypeEnum.Observation;
    case 'deworming': return HealthRecordTypeEnum.Deworming;
    case 'grooming': return HealthRecordTypeEnum.Grooming;
    case 'test': return HealthRecordTypeEnum.Test;
    case 'other': return HealthRecordTypeEnum.Other;
    default: return HealthRecordTypeEnum.Examination;
  }
}

// Base Health Record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: string;
  title: string;
  visit_date: string;
  record_notes?: string;
  vet_name: string;
  document_url?: string;
  next_due_date?: string | null;
  created_at?: string;
  
  // Added for compatibility with existing code
  date?: string;
  description?: string;
  performed_by?: string;
  
  // Fields for vaccination records
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Fields for medication records
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
  
  // Fields for examination records
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string | null;
  
  // Fields for surgery records
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Weight tracking interfaces
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  puppy_id?: string;
  age_days?: number;
}

// Health indicator enums
export enum AppetiteEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

export enum EnergyLevelEnum {
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic',
  Hyperactive = 'hyperactive'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard',
  Mucousy = 'mucousy',
  Bloody = 'bloody'
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: AppetiteEnum;
  energy_level: EnergyLevelEnum;
  stool_consistency: StoolConsistencyEnum;
  abnormal: boolean;
  notes?: string;
  alert_generated?: boolean;
  created_at: string;
  created_by?: string;
  water_intake?: string;
  urination?: string;
  
  // For compatibility with existing code
  energy?: string;
}

// Health alert interface
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: 'active' | 'resolved';
  resolved: boolean;
  resolved_at?: string | null;
  created_at: string;
}

// Growth statistics interface
export interface GrowthStats {
  percentChange: number;
  averageGrowthRate: number;
  weightGoal?: number;
  projectedWeight?: number;
  onTrack?: boolean;
  currentWeight?: number;
  weightUnit?: WeightUnit;
  averageGrowth?: number;
  growthRate?: number;
  lastWeekGrowth?: number;
}

// Medication types
export interface Medication {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  administration_route: string;
  notes?: string;
  created_at: string;
  last_administered?: string;
}

export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

export type MedicationFrequency = 
  | 'daily' 
  | 'twice_daily' 
  | 'three_times_daily' 
  | 'every_other_day' 
  | 'weekly' 
  | 'as_needed'
  | 'custom';

export type MedicationAdministrationRoute = 
  | 'oral' 
  | 'injection' 
  | 'topical' 
  | 'eye_drops' 
  | 'ear_drops' 
  | 'rectal'
  | 'other';

export type MedicationStatus = 
  | 'active' 
  | 'completed' 
  | 'discontinued' 
  | 'scheduled'
  | 'missed'
  | 'upcoming'
  | 'due_today'
  | 'overdue';

export interface MedicationStatusResult {
  status: MedicationStatus | string;
  statusLabel: string;
  statusColor: string;
  emoji?: string;
}

// Health certificate types
export interface HealthCertificate {
  id: string;
  puppy_id: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Helper functions to map DB records to TypeScript interfaces
export function mapToHealthRecord(record: any): HealthRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    record_type: record.record_type,
    title: record.title,
    visit_date: record.visit_date,
    record_notes: record.record_notes,
    vet_name: record.vet_name,
    document_url: record.document_url,
    next_due_date: record.next_due_date,
    created_at: record.created_at,
    
    // Type-specific fields
    vaccine_name: record.vaccine_name,
    manufacturer: record.manufacturer,
    lot_number: record.lot_number,
    expiration_date: record.expiration_date,
    
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
    
    examination_type: record.examination_type,
    findings: record.findings,
    recommendations: record.recommendations,
    follow_up_date: record.follow_up_date,
    
    procedure_name: record.procedure_name,
    surgeon: record.surgeon,
    anesthesia_used: record.anesthesia_used,
    recovery_notes: record.record_notes
  };
}

export function mapToWeightRecord(record: any): WeightRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    weight: record.weight,
    weight_unit: standardizeWeightUnit(record.weight_unit || 'lb'),
    date: record.date,
    notes: record.notes,
    percent_change: record.percent_change,
    created_at: record.created_at,
    puppy_id: record.puppy_id,
    age_days: record.age_days
  };
}
