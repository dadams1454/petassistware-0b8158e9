
/**
 * TypeScript type guards for runtime type checking
 */
import { 
  WeightUnit, 
  HealthRecordType, 
  AppetiteLevel, 
  EnergyLevel, 
  StoolConsistency, 
  GeneticHealthStatus
} from '@/types';
import { PuppyWithAge } from '@/modules/puppies/types';
import { WeightRecord } from '@/modules/weight/types';
import { HealthRecord } from '@/modules/health/types';

/**
 * Type guard for WeightUnit
 */
export function isWeightUnit(value: any): value is WeightUnit {
  return ['oz', 'g', 'lb', 'kg'].includes(value);
}

/**
 * Type guard for HealthRecordType
 */
export function isHealthRecordType(value: any): value is HealthRecordType {
  const validTypes = [
    'vaccination', 'examination', 'treatment', 'medication', 
    'surgery', 'injury', 'allergy', 'test', 'other', 'laboratory',
    'imaging', 'preventive', 'deworming', 'observation', 'procedure',
    'dental', 'grooming'
  ];
  return validTypes.includes(value);
}

/**
 * Type guard for AppetiteLevel
 */
export function isAppetiteLevel(value: any): value is AppetiteLevel {
  return [
    'excellent',
    'good',
    'fair',
    'poor',
    'none'
  ].includes(value);
}

/**
 * Type guard for EnergyLevel
 */
export function isEnergyLevel(value: any): value is EnergyLevel {
  return [
    'hyperactive',
    'high',
    'normal',
    'low',
    'lethargic'
  ].includes(value);
}

/**
 * Type guard for StoolConsistency
 */
export function isStoolConsistency(value: any): value is StoolConsistency {
  return [
    'normal',
    'soft',
    'loose',
    'watery',
    'hard',
    'bloody',
    'mucus'
  ].includes(value);
}

/**
 * Type guard for GeneticHealthStatus
 */
export function isGeneticHealthStatus(value: any): value is GeneticHealthStatus {
  return [
    'clear',
    'carrier',
    'at_risk',
    'affected',
    'unknown'
  ].includes(value);
}

/**
 * Type guard for PuppyWithAge
 */
export function isPuppyWithAge(value: any): value is PuppyWithAge {
  return (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'string' &&
    ('ageInDays' in value || 'age_days' in value || 'age' in value)
  );
}

/**
 * Type guard for WeightRecord
 */
export function isWeightRecord(value: any): value is WeightRecord {
  return (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'string' &&
    'weight' in value &&
    typeof value.weight === 'number' &&
    'weight_unit' in value &&
    isWeightUnit(value.weight_unit) &&
    'date' in value &&
    typeof value.date === 'string'
  );
}

/**
 * Type guard for HealthRecord
 */
export function isHealthRecord(value: any): value is HealthRecord {
  return (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'string' &&
    'record_type' in value &&
    isHealthRecordType(value.record_type) &&
    'date' in value &&
    typeof value.date === 'string'
  );
}

/**
 * Helper function to safely convert unknown values to a specific type
 */
export function safelyConvertValue<T>(value: any, typeGuard: (val: any) => val is T, defaultValue: T): T {
  return typeGuard(value) ? value : defaultValue;
}
