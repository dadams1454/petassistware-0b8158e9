
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
 * Stool consistency enum for display
 */
export enum StoolConsistencyEnum {
  NORMAL = "Normal",
  SOFT = "Soft",
  LOOSE = "Loose",
  WATERY = "Watery",
  HARD = "Hard",
  BLOODY = "Bloody",
  MUCUS = "Mucus"
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
 * Medication status enum for display
 */
export enum MedicationStatus {
  ACTIVE = "Active",
  COMPLETED = "Completed",
  PAUSED = "Paused",
  STOPPED = "Stopped",
  SCHEDULED = "Scheduled",
  OVERDUE = "Overdue",
  NOT_STARTED = "Not Started",
  UNKNOWN = "Unknown"
}

/**
 * Maps a string to the corresponding HealthRecordType enum value
 * @param type - Type of health record as a string
 * @returns The corresponding HealthRecordType enum value
 */
export function stringToHealthRecordType(type: string): HealthRecordTypeEnum {
  const normalizedType = type.toLowerCase();
  
  switch (normalizedType) {
    case 'examination':
      return HealthRecordTypeEnum.EXAMINATION;
    case 'vaccination':
      return HealthRecordTypeEnum.VACCINATION;
    case 'medication':
      return HealthRecordTypeEnum.MEDICATION;
    case 'surgery':
      return HealthRecordTypeEnum.SURGERY;
    case 'treatment':
      return HealthRecordTypeEnum.TREATMENT;
    case 'emergency':
      return HealthRecordTypeEnum.EMERGENCY;
    case 'dental':
      return HealthRecordTypeEnum.DENTAL;
    case 'routine':
      return HealthRecordTypeEnum.ROUTINE;
    case 'procedure':
      return HealthRecordTypeEnum.PROCEDURE;
    case 'test':
      return HealthRecordTypeEnum.TEST;
    case 'laboratory':
      return HealthRecordTypeEnum.LABORATORY;
    case 'imaging':
      return HealthRecordTypeEnum.IMAGING;
    case 'preventive':
      return HealthRecordTypeEnum.PREVENTIVE;
    case 'observation':
      return HealthRecordTypeEnum.OBSERVATION;
    case 'deworming':
      return HealthRecordTypeEnum.DEWORMING;
    case 'grooming':
      return HealthRecordTypeEnum.GROOMING;
    default:
      return HealthRecordTypeEnum.EXAMINATION; // Default fallback
  }
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

// Re-export for easier imports
export { HeatIntensity, HeatIntensityType };
