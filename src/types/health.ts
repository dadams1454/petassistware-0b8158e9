
import { type WeightUnit } from '@/types/common';

// Health record types
export enum HealthRecordTypeEnum {
  EXAMINATION = 'examination',
  VACCINATION = 'vaccination',
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
  PROCEDURE = 'procedure'
}

// Helper function to convert string to HealthRecordTypeEnum
export function stringToHealthRecordType(type: string): HealthRecordTypeEnum {
  const upperType = type.toUpperCase();
  
  // Check each enum value
  for (const key in HealthRecordTypeEnum) {
    if (key === upperType) {
      return HealthRecordTypeEnum[key as keyof typeof HealthRecordTypeEnum];
    }
  }
  
  // If not found, try case-insensitive matching
  for (const key in HealthRecordTypeEnum) {
    const enumValue = HealthRecordTypeEnum[key as keyof typeof HealthRecordTypeEnum];
    if (typeof enumValue === 'string' && enumValue.toLowerCase() === type.toLowerCase()) {
      return enumValue as HealthRecordTypeEnum;
    }
  }
  
  // Default to OTHER if no match found
  return HealthRecordTypeEnum.OTHER;
}

// Health record interface
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

// Appetite level enum
export enum AppetiteLevelEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// Energy level enum
export enum EnergyLevelEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

// Simplified version for compatibility
export enum AppetiteEnum {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor',
  NONE = 'None'
}

// Simplified version for compatibility
export enum EnergyEnum {
  HYPERACTIVE = 'Hyperactive',
  HIGH = 'High',
  NORMAL = 'Normal',
  LOW = 'Low',
  LETHARGIC = 'Lethargic'
}

// Stool consistency enum
export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard',
  NONE = 'none',
  MUCOUSY = 'mucousy',
  BLOODY = 'bloody'
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

// Helper function to convert a database row to a WeightRecord
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
    age_days: row.age_days,
    birth_date: row.birth_date
  };
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: AppetiteLevelEnum;
  energy: EnergyLevelEnum;
  stool_consistency: StoolConsistencyEnum;
  notes?: string;
  abnormal: boolean;
  alert_generated: boolean;
  created_at: string;
  created_by?: string;
}

// Growth statistics interface
export interface GrowthStats {
  percentChange?: number;
  averageGrowthRate: number;
  weightGoal: number | null;
  onTrack: boolean | null;
  totalGrowth?: number | null;
  currentWeight?: number;
  weightUnit?: WeightUnit;
  lastWeekGrowth?: number;
  projectedWeight?: number;
}

// Medication status enum
export enum MedicationStatusEnum {
  ACTIVE = 'active',
  OVERDUE = 'overdue',
  UPCOMING = 'upcoming',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  DISCONTINUED = 'discontinued',
  NOT_STARTED = 'not_started',
  MISSED = 'missed',
  UNKNOWN = 'unknown',
  DUE = 'due',
  NONE = 'none'
}

// Medication status result type
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  daysOverdue?: number;
  daysTillDue?: number;
  nextDue?: string | Date;
  isActive?: boolean;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  medication_name: string;
  name?: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  is_active: boolean;
  active?: boolean;
  created_at: string;
  last_administered?: string;
}

// Medication administration interface
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
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

// Helper function to convert a database row to a HealthRecord
export function mapToHealthRecord(row: any): HealthRecord {
  return {
    id: row.id,
    dog_id: row.dog_id,
    record_type: stringToHealthRecordType(row.record_type),
    title: row.title,
    visit_date: row.visit_date || row.date, // Handle both field names
    date: row.visit_date || row.date, // For backward compatibility
    vet_name: row.vet_name,
    description: row.description,
    document_url: row.document_url,
    record_notes: row.record_notes,
    created_at: row.created_at,
    next_due_date: row.next_due_date,
    performed_by: row.performed_by,
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
    examination_type: row.examination_type,
    findings: row.findings,
    recommendations: row.recommendations,
    follow_up_date: row.follow_up_date,
    procedure_name: row.procedure_name,
    surgeon: row.surgeon,
    anesthesia_used: row.anesthesia_used,
    recovery_notes: row.recovery_notes
  };
}

// Re-export WeightUnit
export type { WeightUnit };
