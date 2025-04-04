
import { WeightUnit } from './common';

// Health-related enums
export enum AppetiteEnum {
  Normal = 'normal',
  Increased = 'increased',
  Decreased = 'decreased',
  None = 'none'
}

// Legacy enum values
export const AppetiteLevelEnum = {
  Excellent: 'excellent',
  Good: 'good',
  Fair: 'fair', 
  Poor: 'poor'
};

export enum EnergyEnum {
  Normal = 'normal',
  Increased = 'increased',
  Decreased = 'decreased',
  Lethargic = 'lethargic'
}

// Legacy enum values
export const EnergyLevelEnum = {
  High: 'high',
  Normal: 'normal',
  Low: 'low'
};

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard',
  None = 'none'
}

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
  Other = 'other',
  Procedure = 'procedure'
}

export enum MedicationStatusEnum {
  Active = 'active',
  Completed = 'completed',
  Discontinued = 'discontinued',
  OnHold = 'on_hold'
}

export type MedicationStatus = 'active' | 'completed' | 'discontinued' | 'on_hold';

export interface MedicationStatusResult {
  status: MedicationStatus;
  daysRemaining?: number;
  pastDue?: boolean;
  dueToday?: boolean;
  lastDose?: string;
  nextDose?: string;
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
  expiration_date?: string;
  
  // Vaccination fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  
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
}

// Weight record
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  puppy_id?: string;
}

// Medication
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  active: boolean;
  created_at: string;
  lastAdministered?: string;
  administration_route?: string;
  notes?: string;
  
  // Legacy field mappings
  medication_name?: string;
  is_active?: boolean;
  last_administered?: string;
  puppy_id?: string;
}

// Vaccination schedule
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccine_name: string;
  vaccination_type: string;
  scheduled_date: string;
  due_date: string;
  administered: boolean;
  administered_date?: string;
  notes?: string;
  created_at: string;
}

// Health indicator
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: string;
  energy: string;
  stool_consistency: string;
  abnormal: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  alert_generated?: boolean;
}

// Health alert
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: string;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Health certificate
export interface HealthCertificate {
  id: string;
  dog_id: string;
  certificate_type: string;
  issuing_vet: string;
  issue_date: string;
  expiry_date?: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Growth statistics
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

// Utility functions
export const mapToHealthRecord = (data: any): HealthRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    record_type: data.record_type || HealthRecordTypeEnum.Examination,
    title: data.title,
    visit_date: data.visit_date || data.date || new Date().toISOString().split('T')[0],
    date: data.date || data.visit_date,
    vet_name: data.vet_name || 'Unknown',
    description: data.description,
    document_url: data.document_url,
    record_notes: data.record_notes || data.notes,
    created_at: data.created_at || new Date().toISOString(),
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

export const mapToWeightRecord = (data: any): WeightRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    weight: data.weight,
    weight_unit: data.weight_unit || data.unit || 'lb',
    unit: data.unit || data.weight_unit || 'lb',
    date: data.date,
    notes: data.notes,
    percent_change: data.percent_change,
    created_at: data.created_at || new Date().toISOString(),
    puppy_id: data.puppy_id
  };
};

export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  const normalizedType = type.toLowerCase();
  
  // Map string values to enum
  const typeMap: Record<string, HealthRecordTypeEnum> = {
    'exam': HealthRecordTypeEnum.Examination,
    'examination': HealthRecordTypeEnum.Examination,
    'checkup': HealthRecordTypeEnum.Examination,
    'vaccination': HealthRecordTypeEnum.Vaccination,
    'vaccine': HealthRecordTypeEnum.Vaccination,
    'shot': HealthRecordTypeEnum.Vaccination,
    'medication': HealthRecordTypeEnum.Medication,
    'medicine': HealthRecordTypeEnum.Medication,
    'surgery': HealthRecordTypeEnum.Surgery,
    'procedure': HealthRecordTypeEnum.Procedure,
    'lab': HealthRecordTypeEnum.Laboratory,
    'laboratory': HealthRecordTypeEnum.Laboratory,
    'test': HealthRecordTypeEnum.Test,
    'imaging': HealthRecordTypeEnum.Imaging,
    'dental': HealthRecordTypeEnum.Dental,
    'allergy': HealthRecordTypeEnum.Allergy,
    'emergency': HealthRecordTypeEnum.Emergency,
    'preventive': HealthRecordTypeEnum.Preventive,
    'observation': HealthRecordTypeEnum.Observation,
    'deworming': HealthRecordTypeEnum.Deworming,
    'grooming': HealthRecordTypeEnum.Grooming
  };
  
  return typeMap[normalizedType] || HealthRecordTypeEnum.Other;
};
