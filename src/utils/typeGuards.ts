
/**
 * TypeScript type guards for runtime type checking
 */
import { 
  WeightUnit, 
  HealthRecordTypeEnum,
  AppetiteEnum,
  EnergyEnum,
  StoolConsistencyEnum
} from '@/types';

/**
 * Type guard for WeightUnit
 */
export function isWeightUnit(value: any): value is WeightUnit {
  return ['oz', 'g', 'lb', 'kg'].includes(value);
}

/**
 * Type guard for HealthRecordTypeEnum
 */
export function isHealthRecordType(value: any): value is HealthRecordTypeEnum {
  return Object.values(HealthRecordTypeEnum).includes(value);
}

/**
 * Type guard for AppetiteEnum
 */
export function isAppetiteLevel(value: any): value is AppetiteEnum {
  return Object.values(AppetiteEnum).includes(value);
}

/**
 * Type guard for EnergyEnum
 */
export function isEnergyLevel(value: any): value is EnergyEnum {
  return Object.values(EnergyEnum).includes(value);
}

/**
 * Type guard for StoolConsistencyEnum
 */
export function isStoolConsistency(value: any): value is StoolConsistencyEnum {
  return Object.values(StoolConsistencyEnum).includes(value);
}

/**
 * Type guard to check if a value is a valid date
 */
export function isValidDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Type guard to check if a value is a valid ISO date string
 */
export function isValidISODateString(value: any): boolean {
  if (typeof value !== 'string') return false;
  
  // ISO date strings are in the format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS.sssZ
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;
  
  return isoDateRegex.test(value) && !isNaN(Date.parse(value));
}

/**
 * Type guard to check if a value is a valid UUID
 */
export function isValidUUID(value: any): boolean {
  if (typeof value !== 'string') return false;
  
  // UUID v4 regex pattern
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  return uuidRegex.test(value);
}
