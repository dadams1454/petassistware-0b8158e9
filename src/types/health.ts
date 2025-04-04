
import { WeightUnit } from './common';

// Export AppetiteEnum
export enum AppetiteEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// For compatibility
export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

// Export EnergyEnum
export enum EnergyEnum {
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  VERY_LOW = 'very_low',
  HYPERACTIVE = 'hyperactive', // Added missing items
  LETHARGIC = 'lethargic'
}

// For compatibility
export enum EnergyLevelEnum {
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  VeryLow = 'very_low',
  Hyperactive = 'hyperactive', // Added missing items
  Lethargic = 'lethargic'
}

// Export StoolConsistencyEnum
export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  LOOSE = 'loose',
  DIARRHEA = 'diarrhea',
  CONSTIPATED = 'constipated',
  BLOODY = 'bloody',
  SOFT = 'soft', // Added missing items
  WATERY = 'watery',
  HARD = 'hard',
  MUCOUSY = 'mucousy'
}

// Define MedicationStatus enum
export enum MedicationStatusEnum {
  Active = 'active',
  Completed = 'completed',
  Scheduled = 'scheduled',
  Discontinued = 'discontinued',
  NotStarted = 'not_started',
  Overdue = 'overdue',
  Unknown = 'unknown'
}

// Define MedicationStatus type
export type MedicationStatus = 'active' | 'completed' | 'scheduled' | 'discontinued' | 'not_started' | 'overdue' | 'unknown';

// Define MedicationStatusResult interface
export interface MedicationStatusResult {
  status: MedicationStatus;
  nextDue?: Date | string | null;
  overdue?: boolean;
  daysUntilNext?: number;
}

// Define Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage?: number; // Changed to optional for compatibility
  dosage_unit?: string;
  frequency: string;
  administration_route?: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  active: boolean;
  created_at: string;
  status?: MedicationStatusEnum | MedicationStatus | MedicationStatusResult;
  last_administered?: string;
  next_due?: string;
  medication_name?: string; // For compatibility
  last_administered_date?: string; // For compatibility
}

// Define MedicationAdministration interface
export interface MedicationAdministration {
  id: string;
  dog_id: string;
  medication_id: string;
  administration_date: string;
  administered_by: string;
  notes?: string;
  created_at: string;
  administered_at?: string;
}

// Define VaccinationSchedule interface
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  scheduled_date: string;
  due_date?: string;
  administered: boolean;
  notes?: string;
  created_at: string;
  vaccine_name?: string;
}

// Define WeightRecord interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number; // For puppy weight tracking
  birth_date?: string; // For age calculation
}

// Define GrowthStats interface
export interface GrowthStats {
  currentWeight?: number;
  weightUnit?: string;
  percentChange: number;
  averageGrowthRate: number;
  growthRate?: number;
  weightGoal: number | null;
  onTrack: boolean | null;
  totalGrowth?: number | null;
  averageGrowth?: number;
  lastWeekGrowth?: number;
  projectedWeight?: number;
}

// Define HealthIndicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: string;
  energy: string;
  stool_consistency: string;
  abnormal: boolean;
  notes?: string;
  alert_generated: boolean;
  created_by: string;
  created_at: string;
}

// Define HealthAlert interface
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: string;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Define HealthCertificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  veterinarian: string;
  notes?: string;
  file_url?: string;
  created_at: string;
}

// Health record type enum (moved from dog.ts)
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

// Health record interface (moved from dog.ts)
export interface HealthRecord {
  id: string;
  dog_id: string;
  visit_date: string;
  record_type: string;
  title: string;
  vet_name: string;
  description?: string;
  performed_by?: string;
  next_due_date?: string;
  document_url?: string;
  record_notes?: string;
  created_at?: string;
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

// Helper function to map data to HealthRecord
export const mapToHealthRecord = (data: any) => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    visit_date: data.visit_date,
    record_type: data.record_type,
    title: data.title,
    vet_name: data.vet_name,
    description: data.description,
    performed_by: data.performed_by,
    next_due_date: data.next_due_date,
    document_url: data.document_url,
    record_notes: data.record_notes,
    created_at: data.created_at,
    // Vaccination-specific fields
    vaccine_name: data.vaccine_name,
    manufacturer: data.manufacturer,
    lot_number: data.lot_number,
    expiration_date: data.expiration_date,
    // Medication-specific fields
    medication_name: data.medication_name,
    dosage: data.dosage,
    dosage_unit: data.dosage_unit,
    frequency: data.frequency,
    start_date: data.start_date,
    end_date: data.end_date,
    duration: data.duration,
    duration_unit: data.duration_unit,
    administration_route: data.administration_route,
    // Examination-specific fields
    examination_type: data.examination_type,
    findings: data.findings,
    recommendations: data.recommendations,
    follow_up_date: data.follow_up_date,
    // Surgery-specific fields
    procedure_name: data.procedure_name,
    surgeon: data.surgeon,
    anesthesia_used: data.anesthesia_used,
    recovery_notes: data.recovery_notes
  };
};

// Helper function to map data to WeightRecord
export const mapToWeightRecord = (data: any): WeightRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    puppy_id: data.puppy_id,
    weight: data.weight,
    weight_unit: data.weight_unit || data.unit || 'lb',
    unit: data.unit || data.weight_unit || 'lb', // For backward compatibility
    date: data.date,
    notes: data.notes,
    percent_change: data.percent_change,
    created_at: data.created_at,
    age_days: data.age_days,
    birth_date: data.birth_date
  };
};

// Helper function to convert string to HealthRecordType
export const stringToHealthRecordType = (type: string) => {
  const typeKey = type.toUpperCase().replace(/\s+/g, '_');
  return typeKey as keyof typeof AppetiteEnum; // This is just for typecasting
};
