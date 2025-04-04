
// This file defines types for health-related data structures

import { Dog } from './dog';

// Health Record Enums
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Deworming = 'deworming',
  Test = 'test',
  Observation = 'observation'
}

export enum AppetiteEnum {
  Normal = 'normal',
  Increased = 'increased',
  Decreased = 'decreased',
  None = 'none'
}

export enum EnergyEnum {
  Normal = 'normal',
  Hyperactive = 'hyperactive',
  Lethargic = 'lethargic',
  Depressed = 'depressed'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Firm = 'firm',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard',
  Mucousy = 'mucousy',
  Bloody = 'bloody'
}

export enum MedicationStatus {
  active = 'active',
  overdue = 'overdue',
  upcoming = 'upcoming',
  completed = 'completed'
}

export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

// Health Record type
export interface HealthRecord {
  id: string;
  dog_id: string;
  title: string;
  record_type: HealthRecordTypeEnum;
  date: string;
  visit_date?: string;
  vet_name?: string;
  description?: string;
  findings?: string;
  recommendations?: string;
  document_url?: string;
  notes?: string;
  created_at?: string;
  record_notes?: string;
  follow_up_date?: string;
  performed_by?: string;
  
  // Medication fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  prescription_number?: string;
  
  // Vaccination fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  next_due_date?: string;
  
  // Surgery fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
  // Duration
  duration?: number;
  duration_unit?: string;
  
  // For reminder notifications
  reminder_sent?: boolean;

  // For completion status
  is_completed?: boolean;
  completion_date?: string;
}

// Health Indicator
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteEnum;
  energy?: EnergyEnum;
  stool_consistency?: StoolConsistencyEnum;
  abnormal?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  alert_generated?: boolean;
}

// Weight Record
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit;
  date: string;
  notes?: string;
  created_at: string;
  percent_change?: number;
  puppy_id?: string;
  age_days?: number;
  birth_date?: string;
}

// Health Alert
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: 'active' | 'resolved';
  created_at: string;
  resolved?: boolean;
  resolved_at?: string;
}

// Growth Stats
export interface GrowthStats {
  currentWeight: number;
  weightUnit: WeightUnit;
  averageGrowth: number;
  growthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
  percentChange?: number;
  averageGrowthRate?: number;
  weightGoal?: number;
  onTrack?: boolean;
}

// Medication Status Result
export interface MedicationStatusResult {
  status: MedicationStatus;
  nextDue?: string;
  lastAdministered?: string;
}

// Helper function to map database record to Health Record
export const mapToHealthRecord = (record: any): HealthRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    title: record.title || 'Health Record',
    record_type: record.record_type || HealthRecordTypeEnum.Examination,
    date: record.date || record.visit_date,
    visit_date: record.visit_date,
    vet_name: record.vet_name,
    description: record.description,
    findings: record.findings,
    recommendations: record.recommendations,
    document_url: record.document_url,
    notes: record.notes || record.record_notes,
    record_notes: record.record_notes,
    created_at: record.created_at,
    follow_up_date: record.follow_up_date,
    medication_name: record.medication_name,
    dosage: record.dosage,
    dosage_unit: record.dosage_unit,
    frequency: record.frequency,
    administration_route: record.administration_route,
    start_date: record.start_date,
    end_date: record.end_date,
    prescription_number: record.prescription_number,
    vaccine_name: record.vaccine_name,
    manufacturer: record.manufacturer,
    lot_number: record.lot_number,
    expiration_date: record.expiration_date,
    next_due_date: record.next_due_date,
    procedure_name: record.procedure_name,
    surgeon: record.surgeon,
    anesthesia_used: record.anesthesia_used,
    recovery_notes: record.recovery_notes,
    duration: record.duration,
    duration_unit: record.duration_unit,
    reminder_sent: record.reminder_sent,
    performed_by: record.performed_by
  };
};

// Helper function to map database record to Weight Record
export const mapToWeightRecord = (record: any): WeightRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    weight: record.weight,
    weight_unit: record.weight_unit || record.unit,
    unit: record.unit || record.weight_unit,
    date: record.date,
    notes: record.notes,
    created_at: record.created_at,
    percent_change: record.percent_change,
    puppy_id: record.puppy_id,
    age_days: record.age_days
  };
};

// Helper function to convert string to HealthRecordType enum
export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  switch (type.toLowerCase()) {
    case 'examination':
      return HealthRecordTypeEnum.Examination;
    case 'vaccination':
      return HealthRecordTypeEnum.Vaccination;
    case 'medication':
      return HealthRecordTypeEnum.Medication;
    case 'surgery':
      return HealthRecordTypeEnum.Surgery;
    case 'deworming':
      return HealthRecordTypeEnum.Deworming;
    case 'test':
      return HealthRecordTypeEnum.Test;
    case 'observation':
      return HealthRecordTypeEnum.Observation;
    default:
      return HealthRecordTypeEnum.Examination;
  }
};
