
import { WeightUnit } from './common';

// Health record type enum
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Procedure = 'procedure',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Test = 'test',
  Imaging = 'imaging',
  Laboratory = 'laboratory',
  Preventive = 'preventive',
  Other = 'other'
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  visit_date: string;
  date: string; // For backward compatibility
  vet_name: string;
  title?: string;
  description?: string;
  next_due_date?: string;
  document_url?: string;
  created_at: string;
  notes?: string;
  record_notes?: string;
  
  // Examination specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // Procedure specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
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
  prescription_number?: string;
  
  // Vaccination specific fields
  vaccine_name?: string;
  lot_number?: string;
  manufacturer?: string;
  expiration_date?: string;
  
  // Lab test specific fields
  test_name?: string;
  results?: string;
  reference_range?: string;
  
  // Additional fields
  performed_by?: string;
}

// Medication status enum
export enum MedicationStatusEnum {
  Active = 'active',
  Completed = 'completed',
  Discontinued = 'discontinued',
  NotStarted = 'not_started',
  Scheduled = 'scheduled',
  Overdue = 'overdue',
  UpcomingDue = 'upcoming_due'
}

export type MedicationStatus = string;

// Medication status result
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  nextDue?: Date | string;
  lastAdministered?: Date | string;
  daysOverdue?: number;
}

// Appetite level enum
export enum AppetiteLevelEnum {
  Poor = 'poor',
  Reduced = 'reduced',
  Normal = 'normal',
  Increased = 'increased',
  Excessive = 'excessive'
}

// Energy level enum
export enum EnergyLevelEnum {
  Lethargic = 'lethargic',
  Low = 'low',
  Normal = 'normal',
  High = 'high',
  Hyperactive = 'hyperactive'
}

// Stool consistency enum
export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Hard = 'hard',
  Loose = 'loose',
  Watery = 'watery',
  Mucousy = 'mucousy',
  Bloody = 'bloody'
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: string;
  energy: string;
  stool_consistency: string;
  abnormal: boolean;
  alert_generated: boolean;
  notes?: string;
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

// Health certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  certificate_number?: string;
  issue_date: string;
  expiry_date?: string;
  expiration_date?: string;
  issuer: string;
  vet_name?: string;
  vet_license?: string;
  notes?: string;
  file_url?: string;
  created_at: string;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  puppy_id?: string;
  name: string;
  medication_name?: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
  is_active?: boolean;
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
  administered_by: string;
  administered_at?: string;
  administration_date: string;
  notes?: string;
  created_at: string;
}

// Vaccination interface
export interface Vaccination {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  lot_number?: string;
  notes?: string;
  created_at: string;
}

// Vaccination schedule interface
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name?: string;
  scheduled_date: string;
  due_date?: string; // For backward compatibility
  administered: boolean;
  administration_date?: string;
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
  unit?: WeightUnit; // For backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number; // For puppy weight tracking
  birth_date?: string; // For age calculation
}

// Growth stats interface
export interface GrowthStats {
  currentWeight: number;
  weightUnit: string;
  averageGrowth: number;
  growthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
  percentChange: number;
  averageGrowthRate: number;
  weightGoal: number | null;
  onTrack: boolean | null;
}

// Helper functions
export function mapToHealthRecord(data: any): HealthRecord {
  return {
    ...data,
    date: data.visit_date || data.date,
    record_type: data.record_type || HealthRecordTypeEnum.Examination
  } as HealthRecord;
}

export function mapToWeightRecord(data: any): WeightRecord {
  return {
    ...data,
    unit: data.weight_unit || data.unit
  } as WeightRecord;
}

export function stringToHealthRecordType(type: string): HealthRecordTypeEnum {
  const validTypes = Object.values(HealthRecordTypeEnum);
  if (validTypes.includes(type as HealthRecordTypeEnum)) {
    return type as HealthRecordTypeEnum;
  }
  return HealthRecordTypeEnum.Other;
}
