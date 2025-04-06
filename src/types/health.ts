
import type { WeightUnit } from './common';

// Health record type enum
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
  PROCEDURE = 'procedure'
}

// Helper function to convert string to health record type
export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  const uppercaseType = type.toUpperCase();
  return (HealthRecordTypeEnum[uppercaseType as keyof typeof HealthRecordTypeEnum]) || HealthRecordTypeEnum.OTHER;
};

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

// Helper function to map data to HealthRecord
export const mapToHealthRecord = (data: any): HealthRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    record_type: stringToHealthRecordType(data.record_type),
    title: data.title || '',
    visit_date: data.visit_date,
    vet_name: data.vet_name,
    description: data.description || '',
    document_url: data.document_url,
    record_notes: data.record_notes || '',
    created_at: data.created_at,
    next_due_date: data.next_due_date,
    performed_by: data.performed_by,
    
    // Vaccination fields
    vaccine_name: data.vaccine_name,
    manufacturer: data.manufacturer,
    lot_number: data.lot_number,
    expiration_date: data.expiration_date,
    
    // Medication fields
    medication_name: data.medication_name,
    dosage: data.dosage,
    dosage_unit: data.dosage_unit,
    frequency: data.frequency,
    start_date: data.start_date,
    end_date: data.end_date,
    duration: data.duration,
    duration_unit: data.duration_unit,
    administration_route: data.administration_route,
    
    // Examination fields
    examination_type: data.examination_type,
    findings: data.findings,
    recommendations: data.recommendations,
    follow_up_date: data.follow_up_date,
    
    // Surgery fields
    procedure_name: data.procedure_name,
    surgeon: data.surgeon,
    anesthesia_used: data.anesthesia_used,
    recovery_notes: data.recovery_notes
  };
};

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  medication_name: string;
  name?: string; // For compatibility with display components
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  is_active: boolean;
  active?: boolean; // For compatibility
  created_at: string;
  last_administered?: string;
}

// Medication status enum - updating to add missing values
export enum MedicationStatusEnum {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  UPCOMING = 'upcoming',
  OVERDUE = 'overdue',
  SCHEDULED = 'scheduled',
  NOT_STARTED = 'not_started',
  DISCONTINUED = 'discontinued',
  MISSED = 'missed',
  UNKNOWN = 'unknown'
}

// Medication status result - updating to include the missing properties
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  daysTillDue: number | null;
  nextDue: Date | null;
  nextDose?: Date | null; // For compatibility
  daysUntilDue?: number | null; // For compatibility
  isOverdue?: boolean; // For compatibility
  isActive?: boolean; // For compatibility with existing code
}

// Medication administration
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

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For compatibility with older code
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}

// Export the calculatePercentChange function for external use
export const calculatePercentChange = (
  oldWeight: number, 
  newWeight: number
): number => {
  if (oldWeight === 0) return 0; // Prevent division by zero
  // Calculate percentage change
  const change = ((newWeight - oldWeight) / oldWeight) * 100;
  // Return the rounded value to 1 decimal place
  return Math.round(change * 10) / 10;
};

// Helper function to map data to WeightRecord
export const mapToWeightRecord = (data: any): WeightRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    puppy_id: data.puppy_id,
    weight: data.weight,
    weight_unit: data.weight_unit,
    unit: data.weight_unit, // Add unit for compatibility
    date: data.date,
    notes: data.notes || '',
    percent_change: data.percent_change || 0,
    created_at: data.created_at,
    age_days: data.age_days,
    birth_date: data.birth_date
  };
};

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

// Simplified enums for better compatibility
export enum AppetiteEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

export enum EnergyEnum {
  Hyperactive = 'hyperactive',
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic'
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
  alert_generated?: boolean;
  created_at: string;
  created_by?: string;
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

// Growth stats interface
export interface GrowthStats {
  currentWeight?: number;
  weightUnit?: string;
  averageGrowthRate: number;
  maxGrowthRate: number;
  minGrowthRate: number;
  dailyGrowthAverage: number;
  weeklyGrowthAverage: number;
  lastWeight: number;
  firstWeight: number;
  totalGain: number;
  percentGain: number;
  projectedWeight?: number;
  weightGoal?: number | null;
  onTrack?: boolean | null;
  percentChange?: number;
  growthRate?: number;
  lastWeekGrowth?: number;
  totalGrowth?: number | null;
}

// Export WeightUnit from health.ts for backward compatibility
export type { WeightUnit } from './common';
