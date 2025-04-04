
import { WeightUnit } from './common';

// Health record type enum
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Diagnostic = 'diagnostic',
  LabWork = 'labwork',
  Other = 'other'
}

// Appetite enum
export enum AppetiteEnum {
  Normal = 'normal',
  Increased = 'increased',
  Decreased = 'decreased',
  None = 'none',
  Picky = 'picky'
}

// Energy enum
export enum EnergyEnum {
  Normal = 'normal',
  High = 'high',
  Low = 'low',
  Lethargic = 'lethargic',
  Hyperactive = 'hyperactive'
}

// Stool consistency enum
export enum StoolConsistencyEnum {
  Normal = 'normal',
  Hard = 'hard',
  Loose = 'loose',
  Diarrhea = 'diarrhea',
  Soft = 'soft',
  Watery = 'watery',
  Mucousy = 'mucousy'
}

// For backward compatibility
export const AppetiteLevelEnum = AppetiteEnum;
export const EnergyLevelEnum = EnergyEnum;

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  visit_date: string;
  vet_name: string;
  document_url?: string;
  record_notes?: string;
  next_due_date?: string;
  created_at: string;
  
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
  follow_up_date?: string;
  
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  temperature?: number;
  heart_rate?: number;
  respiration_rate?: number;
  weight?: number;
  weight_unit?: string;
  appetite?: string;
  energy_level?: string;
  stool_consistency?: string;
  hydration?: string;
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
  health_indicator_id?: string;
}

// Growth stats interface
export interface GrowthStats {
  currentWeight: number;
  weightUnit: WeightUnit;
  averageGrowth: number;
  growthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
  percentChange: number;
  averageGrowthRate: number;
  weightGoal?: number;
  onTrack: boolean;
}

// Health certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuing_vet: string;
  certificate_number?: string;
  document_url?: string;
  notes?: string;
  created_at: string;
}

// Medication status enum
export interface MedicationStatus {
  id: string;
  name: string;
  color: string;
}

// Medication status result
export interface MedicationStatusResult {
  status: MedicationStatus;
  nextDue?: Date;
  daysUntilNext?: number;
  isOverdue: boolean;
}

// Medication administration
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  actual_dose?: number;
  notes?: string;
  created_at: string;
}

// Vaccination schedule
export interface VaccinationSchedule {
  id: string;
  dog_id: string;
  vaccination_type: string;
  due_date: string;
  administered: boolean;
  administered_date?: string;
  notes?: string;
}

// Weight record
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at: string;
  percent_change?: number;
  puppy_id?: string;
}

// Helper function to map to health record
export function mapToHealthRecord(data: any): HealthRecord {
  return {
    id: data.id,
    dog_id: data.dog_id,
    record_type: data.record_type,
    title: data.title,
    visit_date: data.visit_date,
    vet_name: data.vet_name,
    document_url: data.document_url,
    record_notes: data.record_notes,
    next_due_date: data.next_due_date,
    created_at: data.created_at,
    
    // Vaccination specific
    vaccine_name: data.vaccine_name,
    manufacturer: data.manufacturer,
    lot_number: data.lot_number,
    
    // Medication specific
    medication_name: data.medication_name,
    dosage: data.dosage,
    dosage_unit: data.dosage_unit,
    frequency: data.frequency,
    start_date: data.start_date,
    end_date: data.end_date,
    duration: data.duration,
    duration_unit: data.duration_unit,
    administration_route: data.administration_route,
    
    // Examination specific
    examination_type: data.examination_type,
    findings: data.findings,
    recommendations: data.recommendations,
    follow_up_date: data.follow_up_date,
    
    // Surgery specific
    procedure_name: data.procedure_name,
    surgeon: data.surgeon,
    anesthesia_used: data.anesthesia_used,
    recovery_notes: data.recovery_notes
  };
}

// Helper function to map to weight record
export function mapToWeightRecord(data: any): WeightRecord {
  return {
    id: data.id,
    dog_id: data.dog_id,
    weight: data.weight,
    weight_unit: data.weight_unit,
    date: data.date,
    notes: data.notes,
    created_at: data.created_at,
    percent_change: data.percent_change,
    puppy_id: data.puppy_id
  };
}

// Helper function to convert string type to HealthRecordTypeEnum
export function stringToHealthRecordType(recordType: string): HealthRecordTypeEnum {
  switch (recordType) {
    case 'vaccination':
      return HealthRecordTypeEnum.Vaccination;
    case 'examination':
      return HealthRecordTypeEnum.Examination;
    case 'medication':
      return HealthRecordTypeEnum.Medication;
    case 'surgery':
      return HealthRecordTypeEnum.Surgery;
    case 'diagnostic':
      return HealthRecordTypeEnum.Diagnostic;
    case 'labwork':
      return HealthRecordTypeEnum.LabWork;
    default:
      return HealthRecordTypeEnum.Other;
  }
}

// Export the weight unit type
export type { WeightUnit };
