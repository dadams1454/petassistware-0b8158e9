import type { WeightUnit } from './common';
import { Json } from '../integrations/supabase/types';

export enum HealthRecordTypeEnum {
  VACCINATION = 'VACCINATION',
  EXAMINATION = 'EXAMINATION',
  MEDICATION = 'MEDICATION',
  SURGERY = 'SURGERY',
  OBSERVATION = 'OBSERVATION',
  DEWORMING = 'DEWORMING',
  GROOMING = 'GROOMING',
  DENTAL = 'DENTAL',
  ALLERGY = 'ALLERGY',
  TEST = 'TEST',
  LABORATORY = 'LABORATORY',
  IMAGING = 'IMAGING',
  PREVENTIVE = 'PREVENTIVE',
  PROCEDURE = 'PROCEDURE',
  OTHER = 'OTHER'
}

// For compatibility with legacy code - these should be migrated to use uppercase enum values
export const HealthRecordType = {
  Vaccination: HealthRecordTypeEnum.VACCINATION,
  Examination: HealthRecordTypeEnum.EXAMINATION,
  Medication: HealthRecordTypeEnum.MEDICATION,
  Surgery: HealthRecordTypeEnum.SURGERY,
  Observation: HealthRecordTypeEnum.OBSERVATION,
  Deworming: HealthRecordTypeEnum.DEWORMING,
  Grooming: HealthRecordTypeEnum.GROOMING,
  Dental: HealthRecordTypeEnum.DENTAL,
  Allergy: HealthRecordTypeEnum.ALLERGY,
  Test: HealthRecordTypeEnum.TEST,
  Laboratory: HealthRecordTypeEnum.LABORATORY,
  Imaging: HealthRecordTypeEnum.IMAGING,
  Preventive: HealthRecordTypeEnum.PREVENTIVE,
  Procedure: HealthRecordTypeEnum.PROCEDURE,
  Other: HealthRecordTypeEnum.OTHER
};

export const stringToHealthRecordType = (recordType: string): HealthRecordTypeEnum => {
  // Map legacy lowercase values to enum
  const normalizedType = recordType.toUpperCase();
  
  // Check if it's a valid enum value
  if (Object.values(HealthRecordTypeEnum).includes(normalizedType as HealthRecordTypeEnum)) {
    return normalizedType as HealthRecordTypeEnum;
  }
  
  // Fallback mapping for legacy values
  switch (recordType.toLowerCase()) {
    case 'vaccination': return HealthRecordTypeEnum.VACCINATION;
    case 'examination': return HealthRecordTypeEnum.EXAMINATION;
    case 'medication': return HealthRecordTypeEnum.MEDICATION;
    case 'surgery': return HealthRecordTypeEnum.SURGERY;
    case 'observation': return HealthRecordTypeEnum.OBSERVATION;
    case 'deworming': return HealthRecordTypeEnum.DEWORMING;
    case 'grooming': return HealthRecordTypeEnum.GROOMING;
    case 'dental': return HealthRecordTypeEnum.DENTAL;
    case 'allergy': return HealthRecordTypeEnum.ALLERGY;
    case 'test': return HealthRecordTypeEnum.TEST;
    case 'laboratory': return HealthRecordTypeEnum.LABORATORY;
    case 'imaging': return HealthRecordTypeEnum.IMAGING;
    case 'preventive': return HealthRecordTypeEnum.PREVENTIVE;
    case 'procedure': return HealthRecordTypeEnum.PROCEDURE;
    default: return HealthRecordTypeEnum.OTHER;
  }
};

export enum MedicationStatusEnum {
  ACTIVE = 'ACTIVE',
  SCHEDULED = 'SCHEDULED',
  OVERDUE = 'OVERDUE',
  COMPLETED = 'COMPLETED',
  DISCONTINUED = 'DISCONTINUED',
  NOT_STARTED = 'NOT_STARTED',
  UNKNOWN = 'UNKNOWN'
}

export enum AppetiteLevelEnum {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR', 
  POOR = 'POOR',
  NONE = 'NONE'
}

// For backward compatibility
export const AppetiteEnum = {
  Excellent: AppetiteLevelEnum.EXCELLENT,
  Good: AppetiteLevelEnum.GOOD,
  Fair: AppetiteLevelEnum.FAIR,
  Poor: AppetiteLevelEnum.POOR,
  None: AppetiteLevelEnum.NONE
};

export enum EnergyLevelEnum {
  HYPERACTIVE = 'HYPERACTIVE',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  LETHARGIC = 'LETHARGIC'
}

// For backward compatibility
export const EnergyEnum = {
  Hyperactive: EnergyLevelEnum.HYPERACTIVE,
  High: EnergyLevelEnum.HIGH, 
  Normal: EnergyLevelEnum.NORMAL,
  Low: EnergyLevelEnum.LOW,
  Lethargic: EnergyLevelEnum.LETHARGIC
};

export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard',
  MUCOUSY = 'mucousy',
  BLOODY = 'bloody'
}

// Define type for AppetiteEnum for compatibility
export type AppetiteEnum = AppetiteLevelEnum;
export type EnergyEnum = EnergyLevelEnum;
export type MedicationStatus = MedicationStatusEnum;
export type MedicationStatusResult = {
  status: MedicationStatusEnum;
  daysUntilDue?: number | null;
  daysOverdue?: number | null;
  nextDue?: string | Date | null;
};

// Re-export WeightUnit for use in related components
export type { WeightUnit };

// Health record interface
export interface HealthRecord {
  id?: string;
  dog_id: string;
  visit_date: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  performed_by?: string;
  vet_name: string;
  next_due_date?: string | null;
  created_at: string;
  document_url?: string;
  
  // For backward compatibility
  date?: string;
  record_notes?: string;
  
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
  prescription_number?: string;
  reminder_sent?: boolean;
  
  // Examination-specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  vet_clinic?: string;
  
  // Surgery-specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Update weight record interface
export interface WeightRecord {
  id?: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit; // Using WeightUnit type for type safety
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  puppy_id?: string;
  // Additions made for compatibility
  age_days?: number;
  birth_date?: string;
  unit?: WeightUnit; // For backward compatibility
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  administration_route?: string;
  start_date: string;
  end_date?: string;
  active: boolean;
  notes?: string;
  created_at?: string;
  last_administered?: string;
  status?: MedicationStatusEnum;
  next_due?: string;
  medication_name?: string; // For backward compatibility
}

// Medication administration record
export interface MedicationAdministration {
  id?: string;
  dog_id: string;
  medication_id: string;
  administration_date: string;
  administered_by?: string;
  notes?: string;
  created_at: string;
}

// Health indicator interface
export interface HealthIndicator {
  id?: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteLevelEnum;
  energy?: EnergyLevelEnum;
  stool_consistency?: StoolConsistencyEnum;
  abnormal?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  alert_generated?: boolean;
}

// Health alert interface
export interface HealthAlert {
  id?: string;
  dog_id: string;
  indicator_id: string;
  status: string;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Health certificate interface
export interface HealthCertificate {
  id?: string;
  dog_id: string;
  certificate_type: string;
  issue_date: string;
  issuer: string;
  expiry_date?: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Growth stats interface
export interface GrowthStats {
  currentWeight?: number;
  previousWeight?: number;
  percentChange?: number;
  averageGrowthRate: number;
  projectedWeight: number;
  weightGoal: number;
  onTrack: boolean;
}

// Vaccination schedule interface
export interface VaccinationSchedule {
  id?: string;
  puppy_id: string;
  vaccination_type: string;
  scheduled_date: string;
  due_date: string;
  administered: boolean;
  notes?: string;
  vaccine_name?: string;
  created_at?: string;
}

// Helper functions
export const mapToHealthRecord = (record: any): HealthRecord => {
  return {
    ...record,
    record_type: stringToHealthRecordType(record.record_type || 'other'),
    visit_date: record.visit_date || record.date || new Date().toISOString().split('T')[0],
    date: record.visit_date || record.date || new Date().toISOString().split('T')[0], // For backward compatibility
  };
};

export const mapToWeightRecord = (record: any): WeightRecord => {
  return {
    ...record,
    date: record.date || new Date().toISOString().split('T')[0],
    weight_unit: record.weight_unit || 'lb',
    unit: record.weight_unit || record.unit || 'lb' // For backward compatibility
  };
};
