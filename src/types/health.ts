import { WeightUnit } from './common';
import { type Dog } from '@/types/dog';

// Health record types
export enum HealthRecordTypeEnum {
  VACCINATION = 'vaccination',
  EXAMINATION = 'examination',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  LABORATORY = 'laboratory',
  IMAGING = 'imaging',
  DENTAL = 'dental',
  ALLERGY = 'allergy',
  EMERGENCY = 'emergency',
  PREVENTIVE = 'preventive',
  OBSERVATION = 'observation',
  DEWORMING = 'deworming',
  GROOMING = 'grooming',
  TEST = 'test',
  OTHER = 'other',
  PROCEDURE = 'procedure',
  UNKNOWN = 'unknown' // Added for default cases
}

// Appetit level values
export enum AppetiteLevelEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// Alias for backward compatibility
export enum AppetiteEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// Energy level values
export enum EnergyLevelEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

// Alias for backward compatibility
export enum EnergyEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

// Stool consistency values
export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard',
  MUCOUSY = 'mucousy', // Added missing values
  BLOODY = 'bloody'    // Added missing values
}

// Medication status values
export enum MedicationStatusEnum {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DISCONTINUED = 'discontinued',
  PAUSED = 'paused',
  SCHEDULED = 'scheduled',
  OVERDUE = 'overdue',       // Added missing values
  MISSED = 'missed',         // Added missing values
  NOT_STARTED = 'not_started', // Added missing values
  UPCOMING = 'upcoming',     // Added missing values
  UNKNOWN = 'unknown'        // Added missing values
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteLevelEnum;
  energy?: EnergyLevelEnum;
  stool_consistency?: StoolConsistencyEnum;
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
  created_at: string;
  resolved?: boolean;
  resolved_at?: string;
  status: 'active' | 'resolved';
}

// Health certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  title: string;
  certificate_type: string;
  file_url?: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  notes?: string;
  created_at: string;
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title?: string;
  visit_date: string;
  date?: string; // For backward compatibility
  vet_name: string;
  description?: string;
  document_url?: string;
  record_notes?: string;
  next_due_date?: string;
  performed_by?: string;
  created_at: string;
  
  // Vaccination fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Medication fields
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
  
  // Examination fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // Surgery fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
  // For backward compatibility
  vet_clinic?: string;
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
  notes?: string;
  is_active: boolean;
  created_at: string;
  last_administered?: string;
}

// Medication administration interface
export interface MedicationAdministration {
  id: string;
  dog_id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Medication status result interface
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  daysRemaining?: number;
  lastDose?: string;
  nextDose?: string;
  started?: boolean;
  completed?: boolean;
  isActive?: boolean;
  message?: string;
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
}

// Convert string to health record type
export function stringToHealthRecordType(type: string): HealthRecordTypeEnum {
  const normalizedType = type.toLowerCase();
  
  const typeMap: Record<string, HealthRecordTypeEnum> = {
    'vaccination': HealthRecordTypeEnum.VACCINATION,
    'exam': HealthRecordTypeEnum.EXAMINATION,
    'examination': HealthRecordTypeEnum.EXAMINATION,
    'medication': HealthRecordTypeEnum.MEDICATION,
    'surgery': HealthRecordTypeEnum.SURGERY,
    'lab': HealthRecordTypeEnum.LABORATORY,
    'laboratory': HealthRecordTypeEnum.LABORATORY,
    'imaging': HealthRecordTypeEnum.IMAGING,
    'dental': HealthRecordTypeEnum.DENTAL,
    'allergy': HealthRecordTypeEnum.ALLERGY,
    'emergency': HealthRecordTypeEnum.EMERGENCY,
    'preventive': HealthRecordTypeEnum.PREVENTIVE,
    'prevention': HealthRecordTypeEnum.PREVENTIVE,
    'observation': HealthRecordTypeEnum.OBSERVATION,
    'deworming': HealthRecordTypeEnum.DEWORMING,
    'deworm': HealthRecordTypeEnum.DEWORMING,
    'grooming': HealthRecordTypeEnum.GROOMING,
    'groom': HealthRecordTypeEnum.GROOMING,
    'test': HealthRecordTypeEnum.TEST,
    'procedure': HealthRecordTypeEnum.PROCEDURE
  };
  
  return typeMap[normalizedType] || HealthRecordTypeEnum.OTHER;
}

// Map raw data to health record
export function mapToHealthRecord(data: any): HealthRecord {
  return {
    id: data.id,
    dog_id: data.dog_id,
    record_type: stringToHealthRecordType(data.record_type),
    title: data.title || '',
    visit_date: data.visit_date || data.date || new Date().toISOString().split('T')[0],
    date: data.date || data.visit_date,
    vet_name: data.vet_name || '',
    description: data.description || '',
    document_url: data.document_url,
    record_notes: data.record_notes || data.notes,
    next_due_date: data.next_due_date,
    performed_by: data.performed_by,
    created_at: data.created_at,
    
    // Copy other fields as is
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
    prescription_number: data.prescription_number,
    examination_type: data.examination_type,
    findings: data.findings,
    recommendations: data.recommendations,
    follow_up_date: data.follow_up_date,
    procedure_name: data.procedure_name,
    surgeon: data.surgeon,
    anesthesia_used: data.anesthesia_used,
    recovery_notes: data.recovery_notes,
    vet_clinic: data.vet_clinic
  };
}

// Map raw data to weight record
export function mapToWeightRecord(data: any): WeightRecord {
  return {
    id: data.id,
    dog_id: data.dog_id,
    weight: data.weight,
    weight_unit: data.weight_unit,
    date: data.date,
    notes: data.notes,
    created_at: data.created_at,
    percent_change: data.percent_change
  };
}

// Export types for compatibility
export type { WeightUnit, Dog };
