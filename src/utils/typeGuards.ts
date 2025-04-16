
/**
 * TypeScript type guards for runtime type checking
 */
import { 
  WeightUnit, 
  HealthRecord,
  Dog,
  Puppy,
  AnimalGender,
  DogStatus,
  PuppyStatus,
  AppetiteEnum,
  EnergyEnum,
  StoolConsistencyEnum
} from '@/types/unified';

/**
 * Type guard for WeightUnit
 */
export function isWeightUnit(value: any): value is WeightUnit {
  return ['oz', 'g', 'lb', 'kg'].includes(value);
}

/**
 * Type guard for AnimalGender
 */
export function isAnimalGender(value: any): value is AnimalGender {
  return Object.values(AnimalGender).includes(value as AnimalGender);
}

/**
 * Type guard for DogStatus
 */
export function isDogStatus(value: any): value is DogStatus {
  return Object.values(DogStatus).includes(value as DogStatus);
}

/**
 * Type guard for PuppyStatus
 */
export function isPuppyStatus(value: any): value is PuppyStatus {
  return Object.values(PuppyStatus).includes(value as PuppyStatus);
}

/**
 * Type guard for Dog
 */
export function isDog(animal: any): animal is Dog {
  return animal && 
    typeof animal === 'object' && 
    'id' in animal && 
    'name' in animal && 
    'breed' in animal;
}

/**
 * Type guard for Puppy
 */
export function isPuppy(animal: any): animal is Puppy {
  return animal && 
    typeof animal === 'object' && 
    'id' in animal && 
    'name' in animal && 
    'litter_id' in animal;
}

/**
 * Type guard for HealthRecord
 */
export function isHealthRecord(record: any): record is HealthRecord {
  return record && 
    typeof record === 'object' && 
    'id' in record && 
    'record_type' in record;
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
