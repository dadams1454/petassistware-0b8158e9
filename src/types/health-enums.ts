
/**
 * Health Record Type Enums
 */

/**
 * String literal type for health record types
 */
export type HealthRecordType = 
  | 'vaccination'
  | 'examination'
  | 'medication'
  | 'surgery'
  | 'laboratory'
  | 'test'
  | 'imaging'
  | 'preventive'
  | 'deworming'
  | 'other'
  | 'injury'
  | 'allergy'
  | 'observation'
  | 'procedure'
  | 'dental'
  | 'grooming';

/**
 * Enum for health record types
 * This provides both string literals and an enum for flexibility
 */
export enum HealthRecordTypeEnum {
  VACCINATION = 'vaccination',
  EXAMINATION = 'examination',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  LABORATORY = 'laboratory',
  TEST = 'test',
  IMAGING = 'imaging',
  PREVENTIVE = 'preventive',
  DEWORMING = 'deworming',
  OTHER = 'other',
  INJURY = 'injury',
  ALLERGY = 'allergy',
  OBSERVATION = 'observation',
  PROCEDURE = 'procedure',
  DENTAL = 'dental',
  GROOMING = 'grooming'
}

// Medication Status Enums
export enum MedicationStatusEnum {
  DUE = 'due',
  UPCOMING = 'upcoming',
  OVERDUE = 'overdue',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  UNKNOWN = 'unknown',
  // For backward compatibility
  ACTIVE = 'active',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  SCHEDULED = 'scheduled',
  NOT_STARTED = 'not_started',
  DISCONTINUED = 'discontinued'
}

// Define MedicationStatusResult as a string union type
export type MedicationStatusResult = 
  | 'due'
  | 'upcoming'
  | 'overdue'
  | 'completed'
  | 'skipped'
  | 'unknown'
  | {
      status: string;
      message: string;
      nextDue?: Date | string | null;
      daysOverdue?: number;
      daysUntilDue?: number;
    };

// Appetite Level Enums
export enum AppetiteEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

// Export AppetiteLevel as a string union type
export type AppetiteLevel = 
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'none';

// Energy Level Enums
export enum EnergyEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

export type EnergyLevel = 
  | 'hyperactive'
  | 'high'
  | 'normal'
  | 'low'
  | 'lethargic';

// Stool Consistency Enums
export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard',
  BLOODY = 'bloody',
  MUCUS = 'mucus'
}

export type StoolConsistency = 
  | 'normal'
  | 'soft'
  | 'loose'
  | 'watery'
  | 'hard'
  | 'bloody'
  | 'mucus';

// Helper functions
export function stringToHealthRecordType(str: string): HealthRecordType {
  const normalized = str.toLowerCase().trim();
  
  // Check if it's a valid health record type
  for (const key in HealthRecordTypeEnum) {
    if (HealthRecordTypeEnum[key as keyof typeof HealthRecordTypeEnum].toLowerCase() === normalized) {
      return HealthRecordTypeEnum[key as keyof typeof HealthRecordTypeEnum] as HealthRecordType;
    }
  }
  
  // Default to 'other' if not found
  return 'other';
}

export function getHealthRecordTypeDisplay(type: HealthRecordType): string {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return capitalize(type);
}
