
// Health Record Types
export enum HealthRecordTypeEnum {
  VACCINATION = 'VACCINATION',
  EXAMINATION = 'EXAMINATION',
  MEDICATION = 'MEDICATION',
  SURGERY = 'SURGERY',
  TEST = 'TEST',
  IMAGING = 'IMAGING',
  PROCEDURE = 'PROCEDURE',
  OBSERVATION = 'OBSERVATION',
  DEWORMING = 'DEWORMING',
  GROOMING = 'GROOMING',
  DENTAL = 'DENTAL',
  ALLERGY = 'ALLERGY',
  OTHER = 'OTHER'
}

// For backward compatibility with camelCase versions
export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  if (Object.values(HealthRecordTypeEnum).includes(type as HealthRecordTypeEnum)) {
    return type as HealthRecordTypeEnum;
  }
  
  // Convert camelCase or other formats to enum
  const upperType = type.toUpperCase();
  if (Object.values(HealthRecordTypeEnum).includes(upperType as HealthRecordTypeEnum)) {
    return upperType as HealthRecordTypeEnum;
  }
  
  // Legacy conversions
  switch(type) {
    case 'Vaccination': return HealthRecordTypeEnum.VACCINATION;
    case 'Examination': return HealthRecordTypeEnum.EXAMINATION;
    case 'Medication': return HealthRecordTypeEnum.MEDICATION;
    case 'Surgery': return HealthRecordTypeEnum.SURGERY;
    default: return HealthRecordTypeEnum.OTHER;
  }
};

// Health Record Interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  visit_date: string;
  date?: string; // Alias for visit_date for compatibility
  vet_name: string;
  record_notes?: string;
  next_due_date?: string | null;
  document_url?: string;
  created_at: string;
  
  // Vaccination specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
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
  
  // Common fields
  performed_by?: string;
  description?: string;
}

// Medication Status Enum
export enum MedicationStatusEnum {
  ACTIVE = 'ACTIVE',
  OVERDUE = 'OVERDUE',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  DISCONTINUED = 'DISCONTINUED',
  NOT_STARTED = 'NOT_STARTED',
  MISSED = 'MISSED',
  UNKNOWN = 'UNKNOWN'
}

// Medication Status Result
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  isActive: boolean;
  isOverdue: boolean;
  isScheduled: boolean;
  nextDue?: Date | null;
  daysUntilDue?: number;
  daysOverdue?: number;
}

// Weight Record
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

// Stool Consistency Enum
export enum StoolConsistencyEnum {
  NORMAL = 'NORMAL',
  HARD = 'HARD',
  SOFT = 'SOFT',
  LOOSE = 'LOOSE',
  WATERY = 'WATERY',
  DIARRHEA = 'DIARRHEA',
  MUCOUSY = 'MUCOUSY',
  BLOODY = 'BLOODY'
}

// Appetite Level Enum
export enum AppetiteLevelEnum {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  NONE = 'NONE'
}

// Energy Level Enum
export enum EnergyLevelEnum {
  HYPERACTIVE = 'HYPERACTIVE',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  LETHARGIC = 'LETHARGIC'
}

// Re-export WeightUnit type for code that imports from this file
export type { WeightUnit, WeightUnitInfo };
