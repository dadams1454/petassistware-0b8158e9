
/**
 * Health-related enums used throughout the application
 */

// Health record type enum (using uppercase for consistency)
export enum HealthRecordType {
  VACCINATION = 'vaccination',
  EXAMINATION = 'examination', 
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  LABORATORY = 'laboratory',
  IMAGING = 'imaging',
  DENTAL = 'dental',
  ALLERGY = 'allergy',
  EMERGENCY = 'emergency',
  PREVENTIVE = 'preventive',
  OBSERVATION = 'observation',
  DEWORMING = 'deworming',
  GROOMING = 'grooming',
  TEST = 'test',
  OTHER = 'other',
  PROCEDURE = 'procedure'
}

// Helper function to convert string to health record type
export function stringToHealthRecordType(type: string): HealthRecordType {
  const upperType = type.toUpperCase();
  if (Object.keys(HealthRecordType).includes(upperType)) {
    return HealthRecordType[upperType as keyof typeof HealthRecordType];
  }
  return HealthRecordType.EXAMINATION;
}

// Medication status enum
export enum MedicationStatus {
  ACTIVE = 'active',
  OVERDUE = 'overdue',
  SCHEDULED = 'scheduled',
  DISCONTINUED = 'discontinued',
  COMPLETED = 'completed',
  NOT_STARTED = 'not_started',
  UNKNOWN = 'unknown',
  UPCOMING = 'upcoming' // Added for compatibility with existing code
}

// Health indicator enums
export enum AppetiteLevel {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

export enum EnergyLevel {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

export enum StoolConsistency {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard',
  MUCOUSY = 'mucousy', // Added for compatibility with existing code
  BLOODY = 'bloody'    // Added for compatibility with existing code
}

// Backwards compatibility aliases - explicitly exported
export type HealthRecordTypeEnum = HealthRecordType;
export type MedicationStatusEnum = MedicationStatus;
export type AppetiteLevelEnum = AppetiteLevel;
export type EnergyLevelEnum = EnergyLevel;
export type StoolConsistencyEnum = StoolConsistency;
