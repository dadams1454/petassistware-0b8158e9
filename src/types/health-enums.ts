
/**
 * Health record type definitions and enums
 */

// Health record types enum
export enum HealthRecordTypeEnum {
  EXAMINATION = 'examination',
  VACCINATION = 'vaccination',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  INJURY = 'injury',
  ALLERGY = 'allergy',
  LAB_RESULT = 'lab_result',
  PARASITE_TREATMENT = 'parasite_treatment',
  DENTAL = 'dental',
  OTHER = 'other'
}

// Type for health record type (string literal type)
export type HealthRecordType = 
  | 'examination'
  | 'vaccination'
  | 'medication'
  | 'surgery'
  | 'injury'
  | 'allergy'
  | 'lab_result'
  | 'parasite_treatment'
  | 'dental'
  | 'other';

// Convert string to health record type
export function stringToHealthRecordType(value: string): HealthRecordType {
  const normalized = value.toLowerCase();
  
  switch (normalized) {
    case HealthRecordTypeEnum.EXAMINATION:
    case HealthRecordTypeEnum.VACCINATION:
    case HealthRecordTypeEnum.MEDICATION:
    case HealthRecordTypeEnum.SURGERY:
    case HealthRecordTypeEnum.INJURY:
    case HealthRecordTypeEnum.ALLERGY:
    case HealthRecordTypeEnum.LAB_RESULT:
    case HealthRecordTypeEnum.PARASITE_TREATMENT:
    case HealthRecordTypeEnum.DENTAL:
    case HealthRecordTypeEnum.OTHER:
      return normalized as HealthRecordType;
    default:
      return 'other';
  }
}

// Get display name for health record type
export function getHealthRecordTypeDisplay(type: HealthRecordType): string {
  switch (type) {
    case HealthRecordTypeEnum.EXAMINATION:
      return 'Examination';
    case HealthRecordTypeEnum.VACCINATION:
      return 'Vaccination';
    case HealthRecordTypeEnum.MEDICATION:
      return 'Medication';
    case HealthRecordTypeEnum.SURGERY:
      return 'Surgery';
    case HealthRecordTypeEnum.INJURY:
      return 'Injury';
    case HealthRecordTypeEnum.ALLERGY:
      return 'Allergy';
    case HealthRecordTypeEnum.LAB_RESULT:
      return 'Lab Result';
    case HealthRecordTypeEnum.PARASITE_TREATMENT:
      return 'Parasite Treatment';
    case HealthRecordTypeEnum.DENTAL:
      return 'Dental';
    case HealthRecordTypeEnum.OTHER:
      return 'Other';
    default:
      return 'Unknown';
  }
}

// Medication status result interface for detailed status information
export interface MedicationStatusResult {
  status: string;
  message?: string;
  daysOverdue?: number;
  daysUntilDue?: number;
  nextDue?: string | Date | null;
}

// More detailed version of medication status
export interface MedicationStatusDetail {
  status: string;
  message?: string;
  daysOverdue?: number;
  daysUntilDue?: number;
  nextDue?: string | Date | null;
}

// Appetite level enum
export enum AppetiteEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// Appetite level type
export type AppetiteLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'none';

// Energy level enum
export enum EnergyEnum {
  VERY_HIGH = 'very_high',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  VERY_LOW = 'very_low'
}

// Energy level type
export type EnergyLevel = 'very_high' | 'high' | 'normal' | 'low' | 'very_low';

// Stool consistency enum
export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard',
  NONE = 'none'
}

// Stool consistency type
export type StoolConsistency = 'normal' | 'soft' | 'loose' | 'watery' | 'hard' | 'none';
