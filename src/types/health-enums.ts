
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
  UNKNOWN = 'unknown',
  ACTIVE = 'active'
}

// Create a type for detailed medication status information
export interface MedicationStatusDetail {
  status: MedicationStatusResult;
  lastAdministered?: string;
  nextDue?: string | Date | null;
  isOverdue?: boolean;
  isPaused?: boolean;
  isActive?: boolean;
  message?: string;
}

export const MedicationStatusEnum = MedicationStatusResult;

// Helper function to convert string to health record type
export function stringToHealthRecordType(value: string): HealthRecordType {
  // Attempt to parse the value directly
  if (Object.values(HealthRecordType).includes(value as HealthRecordType)) {
    return value as HealthRecordType;
  }
  
  // Try to match by uppercasing if needed
  const upperValue = value.toUpperCase();
  if (Object.keys(HealthRecordType).includes(upperValue)) {
    return HealthRecordType[upperValue as keyof typeof HealthRecordType];
  }
  
  // Default to OTHER if not found
  console.warn(`Unknown health record type: ${value}, defaulting to OTHER`);
  return HealthRecordType.OTHER;
}

// Helper function to get display text for record types
export function getHealthRecordTypeDisplay(type: string | HealthRecordType): string {
  // Handle case where type is already capitalized
  if (typeof type === 'string') {
    // Capitalize first letter and lowercase the rest
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
  
  // Handle enum value
  return String(type).charAt(0).toUpperCase() + String(type).slice(1).toLowerCase();
}
