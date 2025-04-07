
/**
 * Type guards for runtime safety when working with the PetAssistWare type system
 */
import { 
  AppetiteLevel, 
  EnergyLevel, 
  StoolConsistency, 
  HealthRecordType,
  MedicationStatusEnum
} from '@/types';

/**
 * Type guard for AppetiteLevel
 */
export function isAppetiteLevel(value: unknown): value is AppetiteLevel {
  if (typeof value !== 'string') return false;
  
  return ['excellent', 'good', 'fair', 'poor', 'none'].includes(value);
}

/**
 * Type guard for EnergyLevel
 */
export function isEnergyLevel(value: unknown): value is EnergyLevel {
  if (typeof value !== 'string') return false;
  
  return ['hyperactive', 'high', 'normal', 'low', 'lethargic'].includes(value);
}

/**
 * Type guard for StoolConsistency
 */
export function isStoolConsistency(value: unknown): value is StoolConsistency {
  if (typeof value !== 'string') return false;
  
  return ['normal', 'soft', 'loose', 'watery', 'hard', 'bloody', 'mucus'].includes(value);
}

/**
 * Type guard for HealthRecordType
 */
export function isHealthRecordType(value: unknown): value is HealthRecordType {
  if (typeof value !== 'string') return false;
  
  return [
    'vaccination', 
    'examination', 
    'treatment', 
    'medication', 
    'surgery', 
    'injury', 
    'allergy', 
    'test', 
    'other'
  ].includes(value);
}

/**
 * Type guard for MedicationStatusEnum
 */
export function isMedicationStatus(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  
  const validStatuses = [
    'due', 'upcoming', 'overdue', 'completed', 'skipped', 'unknown',
    'active', 'paused', 'stopped', 'scheduled', 'not_started', 'discontinued'
  ];
  
  return validStatuses.includes(value);
}

/**
 * Safely convert to a standard health indicator value
 * @param value Any value that needs conversion to a safe type
 * @param defaultValue Default value to use if conversion fails
 * @param validator Type guard function to validate the value
 * @returns Safe value for the given type
 */
export function safelyConvertValue<T extends string>(
  value: unknown, 
  defaultValue: T,
  validator: (val: unknown) => val is T
): T {
  if (validator(value)) {
    return value;
  }
  
  return defaultValue;
}
