
import { WeightUnit } from './common';

// Enums
export enum AppetiteEnum {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor',
  None = 'None'
}

export enum EnergyEnum {
  High = 'High',
  Normal = 'Normal',
  Low = 'Low',
  Hyperactive = 'Hyperactive',
  Lethargic = 'Lethargic'
}

export enum StoolConsistencyEnum {
  Normal = 'Normal',
  Loose = 'Loose',
  Watery = 'Watery',
  Hard = 'Hard',
  Mucousy = 'Mucousy',
  Bloody = 'Bloody'
}

export enum MedicationStatusEnum {
  Active = 'active',
  Upcoming = 'upcoming',
  Overdue = 'overdue',
  Completed = 'completed',
  Unknown = 'unknown'
}

export type AppetiteLevelEnum = keyof typeof AppetiteEnum;
export type EnergyLevelEnum = keyof typeof EnergyEnum;
export type StoolConsistencyType = keyof typeof StoolConsistencyEnum;
export type MedicationStatus = keyof typeof MedicationStatusEnum;

// Interfaces
export interface MedicationStatusResult {
  status: MedicationStatus;
  nextDue?: Date | string | null;
  statusLabel?: string;
  statusColor?: string;
}

export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  administration_route: string;
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface MedicationAdministration {
  id: string;
  medication_id: string;
  given_date: string;
  given_time: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccine_name: string;
  scheduled_date: string;
  administered: boolean;
  due_date?: string;
  vaccination_type?: string;
  notes?: string;
}

export interface GrowthStats {
  percentChange: number;
  averageGrowthRate: number;
  weightGoal: number | null;
  onTrack: boolean | null;
  totalGrowth?: number | null;
  currentWeight?: number;
  weightUnit?: string;
  averageGrowth?: number;
  growthRate?: number;
  lastWeekGrowth?: number;
  projectedWeight?: number;
}

export interface HealthIndicator {
  id?: string;
  dog_id: string;
  date: string;
  appetite: AppetiteLevelEnum;
  energy: EnergyLevelEnum;
  stool_consistency: StoolConsistencyType;
  water_intake: 'Normal' | 'Low' | 'High';
  vomiting: boolean;
  coughing: boolean;
  sneezing: boolean;
  breathing_issues: boolean;
  notes?: string;
  created_at?: string;
  created_by?: string;
}

export interface HealthAlert {
  id: string;
  dog_id: string;
  alert_type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
  resolved: boolean;
  resolved_date?: string;
  notes?: string;
}

export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuing_vet: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Health Record Mapping Functions
export const mapToHealthRecord = (data: any) => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    record_type: data.record_type,
    title: data.title,
    visit_date: data.visit_date || data.date,
    date: data.date || data.visit_date,
    vet_name: data.vet_name,
    description: data.description,
    document_url: data.document_url,
    record_notes: data.record_notes,
    created_at: data.created_at,
    next_due_date: data.next_due_date,
    performed_by: data.performed_by,
    expiration_date: data.expiration_date,
    
    // Vaccination fields
    vaccine_name: data.vaccine_name,
    manufacturer: data.manufacturer,
    lot_number: data.lot_number,
    
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

export const mapToWeightRecord = (data: any) => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    puppy_id: data.puppy_id,
    weight: data.weight,
    weight_unit: data.weight_unit || data.unit,
    date: data.date,
    notes: data.notes,
    percent_change: data.percent_change,
    created_at: data.created_at
  };
};

export const stringToHealthRecordType = (type: string) => {
  const validTypes = Object.values(HealthRecordTypeEnum);
  if (validTypes.includes(type as any)) {
    return type as HealthRecordTypeEnum;
  }
  return HealthRecordTypeEnum.Other;
};

// Export WeightRecord from here as well to resolve circular dependencies
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
}
