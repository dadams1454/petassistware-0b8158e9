
/**
 * Health record type enums
 */
import { HeatIntensity, HeatIntensityType } from './heat-cycles';

// HealthRecordType as a union type
export type HealthRecordType = 
  | 'VACCINATION'
  | 'EXAMINATION'
  | 'MEDICATION'
  | 'SURGERY'
  | 'INJURY'
  | 'ALLERGY'
  | 'LAB_RESULT'
  | 'PARASITE_TREATMENT'
  | 'DENTAL'
  | 'OTHER';

// Health record type enum - using uppercase for consistency
export enum HealthRecordTypeEnum {
  VACCINATION = 'VACCINATION',
  EXAMINATION = 'EXAMINATION',
  MEDICATION = 'MEDICATION',
  SURGERY = 'SURGERY',
  INJURY = 'INJURY',
  ALLERGY = 'ALLERGY',
  LAB_RESULT = 'LAB_RESULT',
  PARASITE_TREATMENT = 'PARASITE_TREATMENT',
  DENTAL = 'DENTAL',
  OTHER = 'OTHER'
}

// MedicationStatus as a union type
export type MedicationStatus = 
  | 'active'
  | 'upcoming' 
  | 'scheduled'
  | 'overdue'
  | 'completed'
  | 'discontinued'
  | 'expired';

// Medication status enum
export enum MedicationStatusEnum {
  ACTIVE = 'active',
  UPCOMING = 'upcoming',
  SCHEDULED = 'scheduled',
  OVERDUE = 'overdue',
  COMPLETED = 'completed',
  DISCONTINUED = 'discontinued',
  EXPIRED = 'expired'
}

// AppetiteLevel as a union type
export type AppetiteLevel = 
  | 'excellent' 
  | 'good' 
  | 'fair' 
  | 'poor' 
  | 'none';

// Appetite level enum
export enum AppetiteLevelEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// EnergyLevel as a union type
export type EnergyLevel = 
  | 'hyperactive' 
  | 'high' 
  | 'normal' 
  | 'low' 
  | 'lethargic';

// Energy level enum
export enum EnergyLevelEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

// StoolConsistency as a union type
export type StoolConsistency = 
  | 'normal' 
  | 'soft' 
  | 'loose' 
  | 'watery' 
  | 'hard';

// Stool consistency enum
export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard'
}

// Re-export HeatIntensity enum and type from heat-cycles for backward compatibility
export { HeatIntensity, HeatIntensityType };

// Helper function to convert string to HealthRecordType
export function stringToHealthRecordType(value: string): HealthRecordType {
  // Normalize the input to uppercase
  const normalizedValue = value.toUpperCase();
  
  // Check if the value is a valid HealthRecordType
  if (Object.values(HealthRecordTypeEnum).includes(normalizedValue as HealthRecordType)) {
    return normalizedValue as HealthRecordType;
  }
  
  // Default to OTHER if not valid
  return HealthRecordTypeEnum.OTHER;
}

// Helper function to get display name for health record type
export function getHealthRecordTypeDisplayName(type: HealthRecordType): string {
  switch (type) {
    case HealthRecordTypeEnum.VACCINATION:
      return 'Vaccination';
    case HealthRecordTypeEnum.EXAMINATION:
      return 'Examination';
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
