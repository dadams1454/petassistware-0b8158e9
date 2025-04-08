
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
 * Health record type enum for backward compatibility
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

/**
 * Type for heat intensity
 */
export type HeatIntensityType =
  | 'mild'
  | 'moderate'
  | 'strong'
  | 'severe';

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

// Export AppetiteLevel as a string union type
export type AppetiteLevel = 
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'none';

// Add AppetiteEnum for backward compatibility
export enum AppetiteEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

export type EnergyLevel = 
  | 'hyperactive'
  | 'high'
  | 'normal'
  | 'low'
  | 'lethargic';

// Add EnergyEnum for backward compatibility
export enum EnergyEnum {
  HYPERACTIVE = 'hyperactive',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

export type StoolConsistency = 
  | 'normal'
  | 'soft'
  | 'loose'
  | 'watery'
  | 'hard'
  | 'bloody'
  | 'mucus';

// Add StoolConsistencyEnum for backward compatibility
export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard',
  BLOODY = 'bloody',
  MUCUS = 'mucus'
}

// Helper functions
export function stringToHealthRecordType(str: string): HealthRecordType {
  const normalized = str.toLowerCase().trim();
  
  // Check against all valid health record types
  const validTypes: HealthRecordType[] = [
    'vaccination', 'examination', 'medication', 'surgery', 'laboratory',
    'test', 'imaging', 'preventive', 'deworming', 'other', 'injury',
    'allergy', 'observation', 'procedure', 'dental', 'grooming'
  ];
  
  return validTypes.includes(normalized as HealthRecordType) 
    ? normalized as HealthRecordType 
    : 'other';
}

export function getHealthRecordTypeDisplay(type: HealthRecordType): string {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return capitalize(type);
}
