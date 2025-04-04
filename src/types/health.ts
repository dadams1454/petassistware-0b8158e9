
import { WeightUnit } from './common';

// Health record types
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title?: string;
  date: string; // Important for backward compatibility
  visit_date: string;
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

// Health Record Type Enum
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
  Procedure = 'procedure',
  Test = 'test',
  Other = 'other'
}

// Helper to convert string to enum
export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  return type as HealthRecordTypeEnum;
};

// Vaccination Schedule
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name?: string;
  scheduled_date: string;
  due_date?: string;
  administered: boolean;
  notes?: string;
  created_at: string;
}

// Vaccination Records
export interface Vaccination {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
  created_at: string;
}

// Growth Statistics
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

// Weight Records
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  unit?: string; // For backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number; // For puppy weight tracking
  birth_date?: string; // For age calculation
}

// Health Indicator enums
export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

export enum EnergyLevelEnum {
  Hyperactive = 'hyperactive',
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
  Hard = 'hard',
  Mucousy = 'mucousy',
  Bloody = 'bloody'
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteLevelEnum;
  energy?: EnergyLevelEnum;
  stool_consistency?: StoolConsistencyEnum;
  abnormal: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  alert_generated?: boolean;
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

// Health certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  notes?: string;
  file_url?: string;
  created_at: string;
}

// Medication types
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
  active: boolean;
  last_administered?: string;
  notes?: string;
  created_at: string;
}

// Medication administration
export interface MedicationAdministration {
  id: string;
  dog_id: string;
  medication_id: string;
  administration_date: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Medication status enum
export enum MedicationStatusEnum {
  Active = 'active',
  Completed = 'completed',
  Discontinued = 'discontinued',
  NotStarted = 'not_started',
  Scheduled = 'scheduled'
}

// Medication status type
export type MedicationStatus = MedicationStatusEnum | string;

// Medication status result
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  nextDue?: string | Date;
  daysUntilNextDose?: number;
  isOverdue?: boolean;
}

// Helper to map data to health record
export const mapToHealthRecord = (data: any): HealthRecord => {
  return {
    ...data,
    date: data.visit_date, // Ensure date field exists for backward compatibility
    record_type: stringToHealthRecordType(data.record_type)
  };
};

// Helper to map data to weight record
export const mapToWeightRecord = (data: any): WeightRecord => {
  return {
    ...data,
    unit: data.weight_unit // Ensure unit field exists for backward compatibility
  };
};
