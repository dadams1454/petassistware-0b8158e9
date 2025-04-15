
// Health Record Types
export type HealthRecordType = 
  | 'EXAMINATION'
  | 'VACCINATION'
  | 'MEDICATION'
  | 'SURGERY'
  | 'INJURY'
  | 'PARASITE_TREATMENT'
  | 'LAB_WORK'
  | 'X_RAY'
  | 'DENTAL'
  | 'ALLERGY'
  | 'OTHER';

export const HealthRecordTypeEnum: Record<string, HealthRecordType> = {
  EXAMINATION: 'EXAMINATION',
  VACCINATION: 'VACCINATION',
  MEDICATION: 'MEDICATION',
  SURGERY: 'SURGERY',
  INJURY: 'INJURY',
  PARASITE_TREATMENT: 'PARASITE_TREATMENT',
  LAB_WORK: 'LAB_WORK',
  X_RAY: 'X_RAY',
  DENTAL: 'DENTAL',
  ALLERGY: 'ALLERGY',
  OTHER: 'OTHER'
};

export function stringToHealthRecordType(value: string): HealthRecordType {
  // Try to match directly first
  if (Object.values(HealthRecordTypeEnum).includes(value as HealthRecordType)) {
    return value as HealthRecordType;
  }
  
  // Try to match by normalizing case
  const normalizedValue = value.toUpperCase();
  const match = Object.keys(HealthRecordTypeEnum).find(key => key === normalizedValue);
  
  if (match) {
    return HealthRecordTypeEnum[match];
  }
  
  // Default fallback
  return HealthRecordTypeEnum.OTHER;
}

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
    case HealthRecordTypeEnum.PARASITE_TREATMENT:
      return 'Parasite Treatment';
    case HealthRecordTypeEnum.LAB_WORK:
      return 'Lab Work';
    case HealthRecordTypeEnum.X_RAY:
      return 'X-Ray';
    case HealthRecordTypeEnum.DENTAL:
      return 'Dental';
    case HealthRecordTypeEnum.ALLERGY:
      return 'Allergy';
    case HealthRecordTypeEnum.OTHER:
      return 'Other';
    default:
      return 'Unknown';
  }
}

// Medication Status
export type MedicationStatusResult = 'due' | 'overdue' | 'upcoming' | 'completed' | 'skipped' | 'unknown';

export const MedicationStatusEnum = {
  DUE: 'due',
  OVERDUE: 'overdue',
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
  UNKNOWN: 'unknown'
} as const;

export type MedicationStatus = typeof MedicationStatusEnum[keyof typeof MedicationStatusEnum];

// Appetite Level
export type AppetiteLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'none';

export const AppetiteEnum = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
  NONE: 'none'
} as const;

// Energy Level
export type EnergyLevel = 'hyperactive' | 'high' | 'normal' | 'low' | 'lethargic';

export const EnergyEnum = {
  HYPERACTIVE: 'hyperactive',
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low',
  LETHARGIC: 'lethargic'
} as const;

// Stool Consistency
export type StoolConsistency = 'normal' | 'soft' | 'loose' | 'watery' | 'hard' | 'bloody' | 'mucus';

export const StoolConsistencyEnum = {
  NORMAL: 'normal',
  SOFT: 'soft',
  LOOSE: 'loose',
  WATERY: 'watery',
  HARD: 'hard',
  BLOODY: 'bloody',
  MUCUS: 'mucus'
} as const;
