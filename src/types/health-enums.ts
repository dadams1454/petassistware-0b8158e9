
/**
 * Health record type string literal type
 */
export type HealthRecordType = 
  | 'examination' 
  | 'vaccination' 
  | 'treatment' 
  | 'surgery' 
  | 'diagnostic' 
  | 'medication' 
  | 'injury' 
  | 'allergy' 
  | 'weight' 
  | 'diet' 
  | 'general' 
  | 'other';

/**
 * Health record type enum
 */
export enum HealthRecordTypeEnum {
  EXAMINATION = 'examination',
  VACCINATION = 'vaccination',
  TREATMENT = 'treatment',
  SURGERY = 'surgery',
  DIAGNOSTIC = 'diagnostic',
  MEDICATION = 'medication',
  INJURY = 'injury',
  ALLERGY = 'allergy',
  WEIGHT = 'weight',
  DIET = 'diet',
  GENERAL = 'general',
  OTHER = 'other'
}

/**
 * Medication status enum
 */
export enum MedicationStatusEnum {
  DUE = 'due',
  UPCOMING = 'upcoming',
  OVERDUE = 'overdue',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  UNKNOWN = 'unknown',
  ACTIVE = 'active',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  SCHEDULED = 'scheduled',
  NOT_STARTED = 'not_started',
  DISCONTINUED = 'discontinued'
}

/**
 * Medication status object for referencing as values
 */
export const MedicationStatus = {
  DUE: 'due',
  UPCOMING: 'upcoming',
  OVERDUE: 'overdue',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
  UNKNOWN: 'unknown',
  ACTIVE: 'active',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  SCHEDULED: 'scheduled',
  NOT_STARTED: 'not_started',
  DISCONTINUED: 'discontinued'
} as const;

/**
 * Medication status result type
 */
export type MedicationStatusResult = 
  | MedicationStatusEnum
  | 'due'
  | 'upcoming'
  | 'overdue'
  | 'completed'
  | 'skipped'
  | 'unknown'
  | 'active'
  | 'paused'
  | 'stopped'
  | 'scheduled'
  | 'not_started'
  | 'discontinued';

/**
 * Appetite level string literal type
 */
export type AppetiteLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'none';

/**
 * Appetite enum
 */
export enum AppetiteEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

/**
 * Energy level string literal type
 */
export type EnergyLevel = 'hyperactive' | 'high' | 'normal' | 'low' | 'lethargic';

/**
 * Energy enum
 */
export enum EnergyEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

/**
 * Stool consistency string literal type
 */
export type StoolConsistency = 'normal' | 'soft' | 'loose' | 'watery' | 'hard';

/**
 * Stool consistency enum
 */
export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard'
}

/**
 * Convert string to HealthRecordType
 */
export function stringToHealthRecordType(value: string): HealthRecordType {
  const normalized = value.toLowerCase().trim();
  
  if (Object.values(HealthRecordTypeEnum).includes(normalized as any)) {
    return normalized as HealthRecordType;
  }
  
  return 'other';
}

/**
 * Get display name for a health record type
 */
export function getHealthRecordTypeDisplay(type: HealthRecordType): string {
  const displayNames: Record<HealthRecordType, string> = {
    examination: 'Examination',
    vaccination: 'Vaccination',
    treatment: 'Treatment',
    surgery: 'Surgery',
    diagnostic: 'Diagnostic',
    medication: 'Medication',
    injury: 'Injury',
    allergy: 'Allergy',
    weight: 'Weight Check',
    diet: 'Diet Change',
    general: 'General',
    other: 'Other'
  };
  
  return displayNames[type] || 'Unknown';
}
