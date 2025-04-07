
import { HeatIntensity, HeatIntensityType } from './heat-cycles';

/**
 * Health record type enum
 */
export enum HealthRecordTypeEnum {
  EXAMINATION = "examination",
  VACCINATION = "vaccination",
  MEDICATION = "medication",
  SURGERY = "surgery",
  TREATMENT = "treatment",
  EMERGENCY = "emergency",
  DENTAL = "dental",
  ROUTINE = "routine",
  PROCEDURE = "procedure",
  TEST = "test",
  LABORATORY = "laboratory",
  IMAGING = "imaging",
  PREVENTIVE = "preventive",
  OBSERVATION = "observation",
  DEWORMING = "deworming",
  GROOMING = "grooming"
}

/**
 * Health record type for display purposes
 */
export enum HealthRecordType {
  EXAMINATION = "Examination",
  VACCINATION = "Vaccination",
  MEDICATION = "Medication",
  SURGERY = "Surgery",
  TREATMENT = "Treatment",
  EMERGENCY = "Emergency",
  DENTAL = "Dental",
  ROUTINE = "Routine",
  PROCEDURE = "Procedure",
  TEST = "Test",
  LABORATORY = "Laboratory",
  IMAGING = "Imaging",
  PREVENTIVE = "Preventive",
  OBSERVATION = "Observation",
  DEWORMING = "Deworming",
  GROOMING = "Grooming"
}

/**
 * Appetite level enum
 */
export enum AppetiteLevel {
  EXCELLENT = "excellent",
  GOOD = "good",
  FAIR = "fair",
  POOR = "poor",
  NONE = "none"
}

/**
 * Appetite enum for display purposes
 */
export enum AppetiteEnum {
  EXCELLENT = "Excellent",
  GOOD = "Good",
  FAIR = "Fair",
  POOR = "Poor",
  NONE = "None"
}

/**
 * Energy level enum
 */
export enum EnergyLevel {
  HYPERACTIVE = "hyperactive",
  HIGH = "high",
  NORMAL = "normal",
  LOW = "low",
  LETHARGIC = "lethargic"
}

/**
 * Energy enum for display purposes
 */
export enum EnergyEnum {
  HYPERACTIVE = "Hyperactive",
  HIGH = "High",
  NORMAL = "Normal",
  LOW = "Low",
  LETHARGIC = "Lethargic"
}

/**
 * Stool consistency enum
 */
export enum StoolConsistency {
  NORMAL = "normal",
  SOFT = "soft",
  LOOSE = "loose",
  WATERY = "watery",
  HARD = "hard",
  BLOODY = "bloody",
  MUCUS = "mucus"
}

/**
 * Medication status enum
 */
export enum MedicationStatusEnum {
  ACTIVE = "active",
  COMPLETED = "completed",
  PAUSED = "paused",
  STOPPED = "stopped",
  SCHEDULED = "scheduled",
  OVERDUE = "overdue",
  NOT_STARTED = "not_started",
  UNKNOWN = "unknown"
}

/**
 * Maps a health record type enum value to its display name
 */
export const getHealthRecordTypeDisplay = (type: HealthRecordTypeEnum): string => {
  switch (type) {
    case HealthRecordTypeEnum.EXAMINATION:
      return "Examination";
    case HealthRecordTypeEnum.VACCINATION:
      return "Vaccination";
    case HealthRecordTypeEnum.MEDICATION:
      return "Medication";
    case HealthRecordTypeEnum.SURGERY:
      return "Surgery";
    case HealthRecordTypeEnum.TREATMENT:
      return "Treatment";
    case HealthRecordTypeEnum.EMERGENCY:
      return "Emergency";
    case HealthRecordTypeEnum.DENTAL:
      return "Dental";
    case HealthRecordTypeEnum.ROUTINE:
      return "Routine";
    case HealthRecordTypeEnum.PROCEDURE:
      return "Procedure";
    case HealthRecordTypeEnum.TEST:
      return "Test";
    case HealthRecordTypeEnum.LABORATORY:
      return "Laboratory";
    case HealthRecordTypeEnum.IMAGING:
      return "Imaging";
    case HealthRecordTypeEnum.PREVENTIVE:
      return "Preventive";
    case HealthRecordTypeEnum.OBSERVATION:
      return "Observation";
    case HealthRecordTypeEnum.DEWORMING:
      return "Deworming";
    case HealthRecordTypeEnum.GROOMING:
      return "Grooming";
    default:
      return "Unknown";
  }
};

// Additional enums can be added here as needed

// Re-export for easier imports
export { HeatIntensity, HeatIntensityType };
