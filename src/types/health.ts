
import { WeightUnit } from './common';

// Health record type enum
export enum HealthRecordTypeEnum {
  EXAMINATION = 'examination',
  VACCINATION = 'vaccination',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  TEST = 'test',
  OTHER = 'other'
}

// Helper function to convert string to HealthRecordTypeEnum
export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  switch (type.toLowerCase()) {
    case 'examination': return HealthRecordTypeEnum.EXAMINATION;
    case 'vaccination': return HealthRecordTypeEnum.VACCINATION;
    case 'medication': return HealthRecordTypeEnum.MEDICATION;
    case 'surgery': return HealthRecordTypeEnum.SURGERY;
    case 'test': return HealthRecordTypeEnum.TEST;
    default: return HealthRecordTypeEnum.OTHER;
  }
};

// Appetite enum
export enum AppetiteEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// Appetite level enum - modern version
export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

// Energy enum
export enum EnergyEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

// Energy level enum - modern version
export enum EnergyLevelEnum {
  Hyperactive = 'hyperactive',
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic'
}

// Stool consistency enum
export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard',
  MUCOUSY = 'mucousy',
  BLOODY = 'bloody'
}

// Medication status enum
export enum MedicationStatusEnum {
  Active = 'active',
  Scheduled = 'scheduled',
  Overdue = 'overdue',
  Completed = 'completed',
  Discontinued = 'discontinued',
  NotStarted = 'not_started',
  Unknown = 'unknown'
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id?: string;
  visit_date: string;
  date?: string; // alias for visit_date in some contexts
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  vet_name: string;
  vet_clinic?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  next_due_date?: string;
  document_url?: string;
  record_notes?: string;
  created_at: string;
  performed_by?: string;
  
  // Medication specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  prescription_number?: string;
  
  // Vaccination specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
  // Examination specific fields
  examination_type?: string;
  reminder_sent?: boolean;
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
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  veterinarian?: string;
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
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  active: boolean;
  notes?: string;
  created_at: string;
  last_administered?: string;
  medication_name?: string; // For compatibility with API
}

// Medication status type
export type MedicationStatus = 
  | 'active'
  | 'scheduled' 
  | 'overdue'
  | 'completed'
  | 'discontinued'
  | 'not_started'
  | 'unknown';

// Medication status result
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  overdue: boolean;
  daysUntilNext?: number;
  daysSinceLastDose?: number;
  nextDue?: string | Date;
}

// Medication administration
export interface MedicationAdministration {
  id: string;
  dog_id: string;
  medication_id: string;
  administration_date: string;
  administered_by: string;
  notes?: string;
  created_at: string;
  administered_at?: string; // For backward compatibility
}

// Weight record mapping function
export const mapToWeightRecord = (data: any): WeightRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    puppy_id: data.puppy_id,
    weight: data.weight,
    weight_unit: data.weight_unit,
    date: data.date,
    notes: data.notes,
    percent_change: data.percent_change,
    created_at: data.created_at,
    age_days: data.age_days,
    birth_date: data.birth_date
  };
};

// Growth stats interface
export interface GrowthStats {
  averageGrowthRate: number;
  maxGrowthRate: number;
  minGrowthRate: number;
  dailyGrowthAverage: number;
  weeklyGrowthAverage: number;
  lastWeight: number;
  firstWeight: number;
  totalGain: number;
  percentGain: number;
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

// Map database record to HealthRecord
export const mapToHealthRecord = (data: any): HealthRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    visit_date: data.visit_date,
    date: data.visit_date, // Add alias for backward compatibility
    record_type: stringToHealthRecordType(data.record_type),
    title: data.title || '',
    description: data.description,
    vet_name: data.vet_name || '',
    vet_clinic: data.vet_clinic,
    findings: data.findings,
    recommendations: data.recommendations,
    follow_up_date: data.follow_up_date,
    next_due_date: data.next_due_date,
    document_url: data.document_url,
    record_notes: data.record_notes,
    created_at: data.created_at,
    performed_by: data.performed_by,
    medication_name: data.medication_name,
    dosage: data.dosage,
    dosage_unit: data.dosage_unit,
    frequency: data.frequency,
    administration_route: data.administration_route,
    start_date: data.start_date,
    end_date: data.end_date,
    duration: data.duration,
    duration_unit: data.duration_unit,
    prescription_number: data.prescription_number,
    vaccine_name: data.vaccine_name,
    manufacturer: data.manufacturer,
    lot_number: data.lot_number,
    expiration_date: data.expiration_date,
    procedure_name: data.procedure_name,
    surgeon: data.surgeon,
    anesthesia_used: data.anesthesia_used,
    recovery_notes: data.recovery_notes,
    examination_type: data.examination_type,
    reminder_sent: data.reminder_sent
  };
};
