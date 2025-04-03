import { WeightUnit } from './common';

// Medication status options
export type MedicationStatus = 'active' | 'completed' | 'paused' | 'discontinued' | 'scheduled';

// Medication frequency options
export type MedicationFrequency = 'once' | 'daily' | 'twice_daily' | 'three_times_daily' | 'weekly' | 'monthly' | 'as_needed';

// Medication administration route options
export type MedicationAdministrationRoute = 'oral' | 'topical' | 'injection' | 'inhaled' | 'rectal' | 'ophthalmic' | 'otic';

// Medication record
export interface Medication {
  id: string;
  dog_id: string;
  puppy_id?: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: MedicationFrequency;
  administration_route: MedicationAdministrationRoute;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  last_administered?: string;
}

// Medication log entry
export interface MedicationLog {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Medication administration record
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Result object for medication status UI
export interface MedicationStatusResult {
  status: MedicationStatus;
  statusLabel: string;
  statusColor: string;
  dueIn?: number;
  overdue?: boolean;
}

// Health certificate for puppies
export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  notes?: string;
  file_url?: string;
  created_at: string;
}

// Health record type enum
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Allergy = 'allergy',
  LabTest = 'lab_test',
  Dental = 'dental',
  Injury = 'injury',
  ChronicCondition = 'chronic_condition',
  Wellness = 'wellness'
}

// Helper function to convert string to HealthRecordTypeEnum
export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  const normalizedType = type.toLowerCase();
  
  switch (normalizedType) {
    case 'examination': return HealthRecordTypeEnum.Examination;
    case 'vaccination': return HealthRecordTypeEnum.Vaccination;
    case 'medication': return HealthRecordTypeEnum.Medication;
    case 'surgery': return HealthRecordTypeEnum.Surgery;
    case 'allergy': return HealthRecordTypeEnum.Allergy;
    case 'lab_test': return HealthRecordTypeEnum.LabTest;
    case 'dental': return HealthRecordTypeEnum.Dental;
    case 'injury': return HealthRecordTypeEnum.Injury;
    case 'chronic_condition': return HealthRecordTypeEnum.ChronicCondition;
    case 'wellness': return HealthRecordTypeEnum.Wellness;
    default: return HealthRecordTypeEnum.Examination;
  }
};

// Health record type
export interface HealthRecord {
  id: string;
  dog_id?: string;
  record_type?: string;
  title?: string;
  visit_date: string;
  vet_name?: string;
  vet_clinic?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  record_notes?: string;
  document_url?: string;
  next_due_date?: string;
  
  // Medication specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  
  // Vaccination specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Procedure specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
  // Examination specific fields
  examination_type?: string;
  
  // Common fields
  created_at?: string;
  description?: string;
  performed_by?: string;
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
}

// Helper function to map database record to WeightRecord
export const mapToWeightRecord = (record: any): WeightRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    puppy_id: record.puppy_id || null,
    weight: record.weight,
    weight_unit: record.weight_unit as WeightUnit,
    date: record.date,
    notes: record.notes || '',
    percent_change: record.percent_change || 0,
    created_at: record.created_at,
    age_days: record.age_days || 0
  };
};

// Helper function to map database record to HealthRecord 
export const mapToHealthRecord = (record: any): HealthRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    record_type: record.record_type,
    title: record.title || '',
    visit_date: record.visit_date,
    vet_name: record.vet_name || '',
    vet_clinic: record.vet_clinic || '',
    findings: record.findings || '',
    recommendations: record.recommendations || '',
    follow_up_date: record.follow_up_date,
    record_notes: record.record_notes || '',
    document_url: record.document_url,
    next_due_date: record.next_due_date,
    created_at: record.created_at,
    description: record.description || '',
    performed_by: record.performed_by || ''
  };
};

// Growth statistics
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

// Health indicator enums
export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

export enum EnergyLevelEnum {
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard'
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: AppetiteLevelEnum;
  energy_level: EnergyLevelEnum;
  stool_consistency: StoolConsistencyEnum;
  water_intake: string;
  urination: string;
  notes: string;
  created_at: string;
  created_by?: string;
}
