
import { WeightUnit } from './common';

// Health record types
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
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
  Procedure = 'procedure',
  Other = 'other'
}

// Medication status enum
export enum MedicationStatusEnum {
  Active = 'active',
  Completed = 'completed',
  Discontinued = 'discontinued',
  OnHold = 'on-hold',
  Scheduled = 'scheduled',
  NotStarted = 'not_started'
}

// Type for medication status (string based)
export type MedicationStatus = 
  | 'active'
  | 'completed'
  | 'discontinued'
  | 'on-hold'
  | 'scheduled'
  | 'not_started'
  | 'overdue'
  | 'upcoming';

// Interface for medication status result
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  nextDue?: string;
  lastAdministered?: string;
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  date?: string;
  visit_date?: string; 
  vet_name?: string;
  vet_clinic?: string;
  findings?: string;
  recommendations?: string;
  next_due_date?: string;
  follow_up_date?: string;
  document_url?: string;
  created_at: string;
  
  // Medication specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  
  // Vaccination specific fields
  vaccine_name?: string;
  lot_number?: string;
  manufacturer?: string;
  expiration_date?: string;
  
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  duration?: number;
  duration_unit?: string;
  recovery_notes?: string;
  
  // Additional fields
  record_notes?: string;
  performed_by?: string;
  reminder_sent?: boolean;
  prescription_number?: string;
  examination_type?: string;
}

// Growth statistics interface
export interface GrowthStats {
  currentWeight: number;
  weightUnit: WeightUnit;
  percentChange: number;
  averageGrowth: number;
  growthRate: number;
  averageGrowthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
  weightGoal: number;
  onTrack: boolean;
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

// Map function to convert from database record to weight record
export function mapToWeightRecord(dbRecord: any): WeightRecord {
  return {
    id: dbRecord.id,
    dog_id: dbRecord.dog_id,
    puppy_id: dbRecord.puppy_id || null,
    weight: Number(dbRecord.weight),
    weight_unit: dbRecord.weight_unit as WeightUnit,
    date: dbRecord.date,
    notes: dbRecord.notes || '',
    percent_change: dbRecord.percent_change ? Number(dbRecord.percent_change) : 0,
    created_at: dbRecord.created_at,
    age_days: dbRecord.age_days || null,
    birth_date: dbRecord.birth_date || null
  };
}
