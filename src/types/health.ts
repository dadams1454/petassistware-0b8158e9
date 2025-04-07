
import { WeightUnit } from './common';

// Health Record Type Enum
export enum HealthRecordTypeEnum {
  VACCINATION = 'vaccination',
  MEDICATION = 'medication',
  EXAMINATION = 'examination',
  SURGERY = 'surgery',
  DENTAL = 'dental',
  WELLNESS = 'wellness',
  DIAGNOSTIC = 'diagnostic',
  INJURY = 'injury',
  EMERGENCY = 'emergency',
  OTHER = 'other',
  LABORATORY = 'laboratory',
  PREVENTIVE = 'preventive',
  TEST = 'test',
  IMAGING = 'imaging',
  DEWORMING = 'deworming',
  GROOMING = 'grooming',
  PROCEDURE = 'procedure',
  OBSERVATION = 'observation',
  ALLERGY = 'allergy'
}

// Appetite Level Enum
export enum AppetiteLevelEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// Energy Level Enum
export enum EnergyLevelEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

// Stool Consistency Enum
export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard',
  MUCOUSY = 'mucousy',
  BLOODY = 'bloody'
}

// For backward compatibility
export const AppetiteEnum = AppetiteLevelEnum;
export const EnergyEnum = EnergyLevelEnum;

// Medication Status Enum
export enum MedicationStatusEnum {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DISCONTINUED = 'discontinued',
  UPCOMING = 'upcoming',
  OVERDUE = 'overdue',
  SCHEDULED = 'scheduled',
  NOT_STARTED = 'not_started',
  MISSED = 'missed',
  UNKNOWN = 'unknown'
}

export type MedicationStatusResult = {
  status: MedicationStatusEnum;
  daysUntilDue?: number;
  daysOverdue?: number;
  nextDue?: string;
  daysTillDue?: number; // For backward compatibility
};

// Helper function to convert string to enum
export function stringToHealthRecordType(type: string): HealthRecordTypeEnum {
  return type as HealthRecordTypeEnum;
}

// Basic Health Record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  date?: string; // For compatibility with older code
  visit_date: string;
  vet_name: string;
  performed_by?: string;
  record_notes?: string;
  description?: string;
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
  vet_clinic?: string;
  
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Health Certificate for puppies or dogs
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

// Medication for tracking ongoing treatments
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
  active?: boolean; // For backward compatibility
  name?: string; // For backward compatibility
  created_at: string;
  last_administered?: string;
}

// Medication administration records
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at?: string;
}

// Health indicator (daily health checks)
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: string;
  energy?: string;
  stool_consistency?: string;
  abnormal?: boolean;
  alert_generated?: boolean;
  notes?: string;
  created_by?: string;
  created_at: string;
}

// Health Alert for dashboard display
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: string;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Export WeightUnit for use in health records
export type { WeightUnit };

// Weight record interface (moved to weight.ts)
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

// Health mapping functions
export function mapToHealthRecord(record: any): HealthRecord {
  return {
    id: record.id || '',
    dog_id: record.dog_id || '',
    record_type: stringToHealthRecordType(record.record_type || 'examination'),
    title: record.title || '',
    visit_date: record.visit_date || record.date || new Date().toISOString().split('T')[0],
    date: record.visit_date || record.date || new Date().toISOString().split('T')[0],
    vet_name: record.vet_name || '',
    performed_by: record.performed_by || '',
    record_notes: record.record_notes || '',
    description: record.description || '',
    next_due_date: record.next_due_date || null,
    document_url: record.document_url || '',
    created_at: record.created_at || new Date().toISOString(),
    // Additional fields based on record type
    vaccine_name: record.vaccine_name || '',
    manufacturer: record.manufacturer || '',
    lot_number: record.lot_number || '',
    expiration_date: record.expiration_date || '',
    medication_name: record.medication_name || '',
    dosage: record.dosage || 0,
    dosage_unit: record.dosage_unit || '',
    frequency: record.frequency || '',
    start_date: record.start_date || '',
    end_date: record.end_date || '',
    duration: record.duration || 0,
    duration_unit: record.duration_unit || '',
    administration_route: record.administration_route || '',
    prescription_number: record.prescription_number || '',
    examination_type: record.examination_type || '',
    findings: record.findings || '',
    recommendations: record.recommendations || '',
    follow_up_date: record.follow_up_date || null,
    vet_clinic: record.vet_clinic || '',
    procedure_name: record.procedure_name || '',
    surgeon: record.surgeon || '',
    anesthesia_used: record.anesthesia_used || '',
    recovery_notes: record.recovery_notes || ''
  };
}

// Weight mapping function
export function mapToWeightRecord(record: any): WeightRecord {
  return {
    id: record.id || '',
    dog_id: record.dog_id || '',
    weight: typeof record.weight === 'number' ? record.weight : 0,
    weight_unit: record.weight_unit || 'lb',
    date: record.date || new Date().toISOString().split('T')[0],
    notes: record.notes || '',
    created_at: record.created_at || new Date().toISOString(),
    percent_change: record.percent_change || 0
  };
}
