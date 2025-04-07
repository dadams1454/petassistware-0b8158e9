
// Health Record Type Enums
export enum HealthRecordTypeEnum {
  VACCINATION = 'vaccination',
  EXAMINATION = 'examination',
  TREATMENT = 'treatment',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  INJURY = 'injury',
  ALLERGY = 'allergy',
  TEST = 'test',
  OTHER = 'other'
}

// String value type for TypeScript safety
export type HealthRecordType = 
  | 'vaccination'
  | 'examination'
  | 'treatment'
  | 'medication'
  | 'surgery'
  | 'injury'
  | 'allergy'
  | 'test'
  | 'other';

// Medication Status Enums
export enum MedicationStatusEnum {
  DUE = 'due',
  UPCOMING = 'upcoming',
  OVERDUE = 'overdue',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  UNKNOWN = 'unknown'
}

// Define MedicationStatusResult as a string union type
export type MedicationStatusResult = 
  | 'due'
  | 'upcoming'
  | 'overdue'
  | 'completed'
  | 'skipped';

// Appetite Level Enums
export enum AppetiteEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

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
  if (Object.values(HealthRecordTypeEnum).includes(normalized as HealthRecordTypeEnum)) {
    return normalized as HealthRecordType;
  }
  return 'other';
}

export function getHealthRecordTypeDisplay(type: HealthRecordType): string {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return capitalize(type);
}
