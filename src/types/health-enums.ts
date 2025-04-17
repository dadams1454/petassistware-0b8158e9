/**
 * Enums for health record types
 */

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

// For backward compatibility, keep the old enum name
export const HealthRecordTypeEnum = HealthRecordType;

// Health status enums
export enum AppetiteLevel {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// Alias for backward compatibility
export const AppetiteEnum = AppetiteLevel;

export enum EnergyLevel {
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

// Add similar aliases for other enums
export const EnergyEnum = EnergyLevel;

export enum StoolConsistency {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard',
  BLOODY = 'bloody',
  MUCUS = 'mucus',
  OTHER = 'other'
}

export const StoolConsistencyEnum = StoolConsistency;

export enum MedicationStatusResult {
  DUE = 'due',
  OVERDUE = 'overdue',
  ADMINISTERED = 'administered',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  PENDING = 'pending',
  UPCOMING = 'upcoming',
  SKIPPED = 'skipped',
  UNKNOWN = 'unknown'
}

export const MedicationStatusEnum = MedicationStatusResult;
