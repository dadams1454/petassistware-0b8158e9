
import { WeightUnit } from '@/types/common';

// Medication status enum
export enum MedicationStatusEnum {
  Active = 'Active',
  Upcoming = 'Upcoming',
  Overdue = 'Overdue',
  Completed = 'Completed',
  Unknown = 'Unknown'
}

// Medication status type for compatibility
export type MedicationStatus = MedicationStatusEnum | string;

// Result type for medication status processing
export interface MedicationStatusResult {
  status: MedicationStatus;
  statusLabel: string;
  statusColor: string;
  nextDue?: string;
  emoji?: string;
}

// Health record type enum
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Test = 'test',
  Other = 'other',
  Laboratory = 'laboratory',
  Imaging = 'imaging',
  Dental = 'dental',
  Allergy = 'allergy',
  Emergency = 'emergency',
  Preventive = 'preventive',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming'
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  visit_date: string;
  date?: string; // For backward compatibility
  vet_name: string;
  record_notes?: string;
  description?: string; // For backward compatibility
  next_due_date?: string | null;
  document_url?: string;
  created_at: string;
  updated_at?: string;
  performed_by?: string; // Added for compatibility
  
  // Vaccination specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  
  // Medication specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  
  // Examination specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string | null;
  
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Helper function to convert string to HealthRecordTypeEnum
export function stringToHealthRecordType(value: string): HealthRecordTypeEnum {
  switch (value) {
    case 'examination':
      return HealthRecordTypeEnum.Examination;
    case 'vaccination':
      return HealthRecordTypeEnum.Vaccination;
    case 'medication':
      return HealthRecordTypeEnum.Medication;
    case 'surgery':
      return HealthRecordTypeEnum.Surgery;
    case 'test':
      return HealthRecordTypeEnum.Test;
    case 'laboratory':
      return HealthRecordTypeEnum.Laboratory;
    case 'imaging':
      return HealthRecordTypeEnum.Imaging;
    case 'dental':
      return HealthRecordTypeEnum.Dental;
    case 'allergy':
      return HealthRecordTypeEnum.Allergy;
    case 'emergency':
      return HealthRecordTypeEnum.Emergency;
    case 'preventive':
      return HealthRecordTypeEnum.Preventive;
    case 'observation':
      return HealthRecordTypeEnum.Observation;
    case 'deworming':
      return HealthRecordTypeEnum.Deworming;
    case 'grooming':
      return HealthRecordTypeEnum.Grooming;
    default:
      return HealthRecordTypeEnum.Other;
  }
}

// Appetite level enum
export enum AppetiteLevelEnum {
  Excellent = 'Excellent',
  Good = 'Good',
  Normal = 'Normal',
  Fair = 'Fair',
  Poor = 'Poor',
  None = 'None'
}

// Energy level enum
export enum EnergyLevelEnum {
  High = 'High',
  Normal = 'Normal',
  Low = 'Low',
  Lethargic = 'Lethargic',
  Hyperactive = 'Hyperactive'
}

// Stool consistency enum
export enum StoolConsistencyEnum {
  Normal = 'Normal',
  Hard = 'Hard',
  Soft = 'Soft',
  Loose = 'Loose',
  Watery = 'Watery',
  Mucousy = 'Mucousy',
  Bloody = 'Bloody'
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: string;
  energy: string;
  stool_consistency: string;
  water_intake?: string;
  vomiting?: boolean;
  coughing?: boolean;
  sneezing?: boolean;
  breathing_issues?: boolean;
  abnormal?: boolean;
  alert_generated?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
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
  age_days?: number;
  birth_date?: string;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  administration_route?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  prescription_number?: string;
  prescribing_vet?: string;
  refills_remaining?: number;
  last_administered?: string;
  next_due?: string;
  is_chronic?: boolean;
  status?: MedicationStatus;
}

// Medication administration
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_date: string;
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
  issuing_authority: string;
  certificate_number?: string;
  document_url?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// Health alert interface
export interface HealthAlert {
  id: string;
  dog_id: string;
  alert_type: string;
  alert_message: string;
  alert_date: string;
  is_active: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

// Growth statistics interface
export interface GrowthStats {
  currentWeight: number;
  weightUnit: WeightUnit;
  percentChange: number;
  averageGrowth: number;
  averageGrowthRate: number;
  growthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
  weightGoal?: number;
  onTrack: boolean;
}

// Medication frequency types
export const MedicationFrequencyTypes = {
  DAILY: 'daily',
  TWICE_DAILY: 'twice_daily',
  THREE_TIMES_DAILY: 'three_times_daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUAL: 'annual',
  AS_NEEDED: 'as_needed'
};

// Helper function to map DB record to HealthRecord type
export function mapToHealthRecord(record: any): HealthRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    record_type: stringToHealthRecordType(record.record_type),
    title: record.title || '',
    visit_date: record.visit_date || record.date || new Date().toISOString().split('T')[0],
    date: record.visit_date || record.date,
    vet_name: record.vet_name || '',
    record_notes: record.record_notes || record.notes || '',
    description: record.record_notes || record.notes || '',
    next_due_date: record.next_due_date,
    document_url: record.document_url,
    created_at: record.created_at || new Date().toISOString(),
    updated_at: record.updated_at,
    performed_by: record.performed_by || record.vet_name,
    
    // Additional fields based on record type
    ...record
  };
}

// Helper function to map DB record to WeightRecord type
export function mapToWeightRecord(record: any): WeightRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    puppy_id: record.puppy_id,
    weight: record.weight,
    weight_unit: record.weight_unit || record.unit || 'lb',
    unit: record.weight_unit || record.unit || 'lb', // For backward compatibility
    date: record.date,
    notes: record.notes,
    percent_change: record.percent_change,
    created_at: record.created_at || new Date().toISOString(),
    age_days: record.age_days,
    birth_date: record.birth_date
  };
}

// Export type for proper TypeScript isolation mode compatibility
export type { WeightUnit };
