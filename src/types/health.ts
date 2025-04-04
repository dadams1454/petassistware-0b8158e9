
import { WeightUnit } from './common';

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
  
  // Vaccination specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
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
  prescription_number?: string;
  
  // Examination specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string | null;
  
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
  // Additional fields for other record types
  performed_by?: string;
  description?: string;
  vet_clinic?: string;
  reminder_sent?: boolean;
}

// Health record types enum
export enum HealthRecordTypeEnum {
  VACCINATION = 'vaccination',
  EXAMINATION = 'examination',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  OBSERVATION = 'observation',
  DEWORMING = 'deworming',
  GROOMING = 'grooming',
  DENTAL = 'dental',
  ALLERGY = 'allergy',
  TEST = 'test',
  LABORATORY = 'laboratory',
  IMAGING = 'imaging',
  PREVENTIVE = 'preventive',
  PROCEDURE = 'procedure',
  OTHER = 'other'
}

// Helper function to convert string to HealthRecordTypeEnum
export function stringToHealthRecordType(typeString: string): HealthRecordTypeEnum {
  const normalizedString = typeString.toLowerCase();
  
  switch (normalizedString) {
    case 'vaccination':
      return HealthRecordTypeEnum.VACCINATION;
    case 'examination':
      return HealthRecordTypeEnum.EXAMINATION;
    case 'medication':
      return HealthRecordTypeEnum.MEDICATION;
    case 'surgery':
      return HealthRecordTypeEnum.SURGERY;
    case 'observation':
      return HealthRecordTypeEnum.OBSERVATION;
    case 'deworming':
      return HealthRecordTypeEnum.DEWORMING;
    case 'grooming':
      return HealthRecordTypeEnum.GROOMING;
    case 'dental':
      return HealthRecordTypeEnum.DENTAL;
    case 'allergy':
      return HealthRecordTypeEnum.ALLERGY;
    case 'test':
      return HealthRecordTypeEnum.TEST;
    case 'laboratory':
      return HealthRecordTypeEnum.LABORATORY;
    case 'imaging':
      return HealthRecordTypeEnum.IMAGING;
    case 'preventive':
      return HealthRecordTypeEnum.PREVENTIVE;
    case 'procedure':
      return HealthRecordTypeEnum.PROCEDURE;
    default:
      return HealthRecordTypeEnum.OTHER;
  }
}

// Appetite level enum
export enum AppetiteEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// Energy level enum
export enum EnergyEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
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
  birth_date?: string;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  start_date?: string;
  end_date?: string;
  administration_route?: string;
  notes?: string;
  active: boolean;
  last_administered?: string;
  next_due?: string;
  is_preventative?: boolean;
  created_at: string;
  status?: MedicationStatus | MedicationStatusResult;
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
}

// Medication status
export type MedicationStatus = 'active' | 'completed' | 'scheduled' | 'overdue' | 'paused' | 'not_started';

// Medication status enum
export enum MedicationStatusEnum {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  SCHEDULED = 'scheduled',
  OVERDUE = 'overdue',
  PAUSED = 'paused',
  NOT_STARTED = 'not_started'
}

// Medication status with days info
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  daysUntilDue?: number;
  daysOverdue?: number;
}

// Higher level "AppetiteLevel" enum for compatibility with legacy code
export enum AppetiteLevelEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// Higher level "EnergyLevel" enum for compatibility with legacy code
export enum EnergyLevelEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

// Vaccination schedule interface
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  scheduled_date: string;
  vaccination_type: string;
  vaccine_name: string;
  administered: boolean;
  due_date?: string;
  notes?: string;
  created_at: string;
}

// Health certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  certificate_type: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

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
  currentWeight?: number;
  weightUnit?: string;
  projectedWeight?: number;
  weightGoal?: number;
  onTrack?: boolean;
  percentChange?: number;
}

// Helper function to map database record to health record
export function mapToHealthRecord(record: any): HealthRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    record_type: stringToHealthRecordType(record.record_type),
    title: record.title,
    visit_date: record.visit_date,
    vet_name: record.vet_name,
    record_notes: record.record_notes,
    next_due_date: record.next_due_date,
    document_url: record.document_url,
    created_at: record.created_at,
    
    // Additional fields
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
    recovery_notes: record.recovery_notes,
    
    performed_by: record.performed_by,
    description: record.description,
    vet_clinic: record.vet_clinic,
    reminder_sent: record.reminder_sent
  };
}

// Helper function to map database record to weight record
export function mapToWeightRecord(record: any): WeightRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    puppy_id: record.puppy_id,
    weight: record.weight,
    weight_unit: record.weight_unit,
    date: record.date,
    notes: record.notes,
    percent_change: record.percent_change,
    created_at: record.created_at,
    age_days: record.age_days,
    birth_date: record.birth_date
  };
}
