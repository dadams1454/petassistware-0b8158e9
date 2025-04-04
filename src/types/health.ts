// Medication status enum
export enum MedicationStatusEnum {
  Active = 'active',
  Completed = 'completed',
  Discontinued = 'discontinued',
  NotStarted = 'not_started',
  Scheduled = 'scheduled',
  Unknown = 'unknown'
}

// Medication status result interface
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  nextDue?: Date | null;
  daysUntilNextDose?: number;
  isOverdue?: boolean;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date?: string;
  end_date?: string;
  active: boolean;
  last_administered?: string;
  notes?: string;
  created_at: string;
}

// Medication administration interface
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administration_date: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  visit_date: string;
  vet_name: string;
  description?: string;
  notes?: string;
  created_at?: string;
  next_due_date?: string;
}

// Vaccination interface
export interface Vaccination {
  id?: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: Date;
  vaccination_dateStr?: string;
  notes?: string;
  created_at?: string;
}

// Vaccination schedule interface
export interface VaccinationSchedule {
  id: string;
  vaccination_type: string;
  age_in_weeks: number;
  notes?: string;
  created_at?: string;
}

// Growth stats interface
export interface GrowthStats {
  id: string;
  dog_id: string;
  date: string;
  weight: number;
  height: number;
  notes?: string;
  created_at?: string;
}

// Health indicator interface
export interface HealthIndicator {
  id?: string;
  dog_id: string;
  indicator_type: HealthIndicatorType;
  record_date: string | Date;
  value: number;
  notes?: string;
  created_at?: string;
}

// Health indicator type
export type HealthIndicatorType =
  | 'temperature'
  | 'heart_rate'
  | 'respiratory_rate'
  | 'blood_pressure'
  | 'glucose_level'
  | 'hydration_level'
  | 'custom';

// Health alert interface
export interface HealthAlert {
  id: string;
  dog_id: string;
  alert_type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  created_at?: string;
}

// Health certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  issue_date: string;
  expiry_date?: string;
  veterinarian: string;
  notes?: string;
  created_at?: string;
}

// Weight record interface
export interface WeightRecord {
  id?: string;
  puppy_id: string;
  weight: number;
  weight_unit: string;
  record_date: string;
  notes?: string;
  created_at?: string;
}

// Enums
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Other = 'other'
}

export enum AppetiteEnum {
  Normal = 'normal',
  Increased = 'increased',
  Decreased = 'decreased',
  None = 'none'
}

export enum EnergyEnum {
  Normal = 'normal',
  High = 'high',
  Low = 'low',
  Restless = 'restless'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Loose = 'loose',
  Diarrhea = 'diarrhea',
  Constipated = 'constipated'
}

export enum AppetiteLevelEnum {
  Normal = 'normal',
  Good = 'good',
  Poor = 'poor',
  Ravenous = 'ravenous',
  Finicky = 'finicky'
}

export enum EnergyLevelEnum {
  Normal = 'normal',
  High = 'high',
  Low = 'low',
  Energetic = 'energetic',
  Lethargic = 'lethargic'
}

// Helper function to map string to HealthRecordTypeEnum
export const stringToHealthRecordType = (str: string): HealthRecordTypeEnum => {
  switch (str) {
    case 'vaccination':
      return HealthRecordTypeEnum.Vaccination;
    case 'examination':
      return HealthRecordTypeEnum.Examination;
    case 'medication':
      return HealthRecordTypeEnum.Medication;
    default:
      return HealthRecordTypeEnum.Other;
  }
};

// Map to HealthRecord
export const mapToHealthRecord = (data: any): HealthRecord => ({
  id: data.id,
  dog_id: data.dog_id,
  record_type: data.record_type as HealthRecordTypeEnum,
  visit_date: data.visit_date,
  vet_name: data.vet_name,
  description: data.description,
  notes: data.notes,
  created_at: data.created_at,
  next_due_date: data.next_due_date
});

// Map to WeightRecord
export const mapToWeightRecord = (data: any): WeightRecord => ({
  id: data.id,
  puppy_id: data.puppy_id,
  weight: data.weight,
  weight_unit: data.weight_unit,
  record_date: data.record_date,
  notes: data.notes,
  created_at: data.created_at
});
