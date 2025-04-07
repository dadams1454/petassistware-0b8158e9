
/**
 * Central definition of enums used throughout the application
 * This file aims to standardize enum usage and prevent duplication
 */

// Import the common enum types from their specialized files
import { 
  HealthRecordTypeEnum,
  HealthRecordType,
  MedicationStatusEnum,
  MedicationStatusResult,
  AppetiteEnum,
  AppetiteLevel,
  EnergyEnum,
  EnergyLevel,
  StoolConsistencyEnum,
  StoolConsistency,
  stringToHealthRecordType
} from './health-enums';

// Re-export the health enums
export {
  HealthRecordTypeEnum,
  HealthRecordType,
  MedicationStatusEnum,
  MedicationStatusResult,
  AppetiteEnum,
  AppetiteLevel,
  EnergyEnum,
  EnergyLevel,
  StoolConsistencyEnum,
  StoolConsistency,
  stringToHealthRecordType
};

// Dog Gender Enum
export enum DogGender {
  MALE = 'Male',
  FEMALE = 'Female',
  // Legacy lowercase values for backward compatibility
  MALE_LOWER = 'male',
  FEMALE_LOWER = 'female'
}

// Dog Status Enum
export enum DogStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DECEASED = 'deceased',
  REHOMED = 'rehomed',
  SOLD = 'sold',
  GUARDIAN = 'guardian',
  ARCHIVED = 'archived',
  RETIRED = 'retired'
}

// Puppy Status Enum
export enum PuppyStatus {
  AVAILABLE = 'Available',
  RESERVED = 'Reserved',
  SOLD = 'Sold',
  UNAVAILABLE = 'Unavailable'
}

// Litter Status Enum
export enum LitterStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PLANNED = 'planned',
  ARCHIVED = 'archived'
}

// Document Type Enum
export enum DocumentType {
  HEALTH_RECORD = 'health_record',
  VACCINATION = 'vaccination',
  CERTIFICATE = 'certificate',
  PEDIGREE = 'pedigree',
  REGISTRATION = 'registration',
  CONTRACT = 'contract',
  OTHER = 'other'
}

// Reproductive Status Enum
export enum ReproductiveStatus {
  IN_HEAT = 'in_heat',
  PRE_HEAT = 'pre_heat',
  PREGNANT = 'pregnant',
  WHELPING = 'whelping',
  NURSING = 'nursing',
  AVAILABLE = 'available',
  RESTING = 'resting',
  TOO_YOUNG = 'too_young',
  TOO_OLD = 'too_old',
  SPAYED = 'spayed',
  RECOVERY = 'recovery',
  INTACT = 'intact',
  NOT_IN_HEAT = 'not_in_heat',
  ALTERED = 'altered',
  NEUTERED = 'neutered'
}

// Event Type Enum (from constant array to enum)
export enum EventType {
  VACCINATION = 'vaccination',
  EXAMINATION = 'examination',
  BREEDING = 'breeding',
  HEAT_CYCLE = 'heat_cycle',
  GROOMING = 'grooming',
  SOCIALIZATION = 'socialization',
  TRAINING = 'training',
  APPOINTMENT = 'appointment',
  OTHER = 'other'
}

// Frequency Types for medications and other scheduled events
export enum FrequencyType {
  DAILY = 'daily',
  TWICE_DAILY = 'twice daily',
  THREE_TIMES_DAILY = 'three times daily',
  EVERY_OTHER_DAY = 'every other day',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
  AS_NEEDED = 'as needed',
  ONCE_DAILY = 'once daily'
}

// Helper functions for enum value conversion

/**
 * Converts a string to the corresponding DogGender enum value
 */
export function toDogGender(gender: string): DogGender {
  if (!gender) return DogGender.MALE;
  
  const genderStr = String(gender).toLowerCase();
  if (genderStr === 'male' || genderStr === 'm') {
    return DogGender.MALE;
  } 
  if (genderStr === 'female' || genderStr === 'f') {
    return DogGender.FEMALE;
  }
  
  return DogGender.MALE; // Default
}

/**
 * Converts a string to the corresponding DogStatus enum value
 */
export function toDogStatus(status: string): DogStatus {
  if (!status) return DogStatus.ACTIVE;
  
  const statusStr = String(status).toLowerCase();
  if (Object.values(DogStatus).some(s => s.toLowerCase() === statusStr)) {
    return statusStr as DogStatus;
  }
  
  return DogStatus.ACTIVE; // Default
}

/**
 * Converts a string to the corresponding PuppyStatus enum value
 */
export function toPuppyStatus(status: string): PuppyStatus {
  if (!status) return PuppyStatus.AVAILABLE;
  
  const validStatuses = Object.values(PuppyStatus);
  if (validStatuses.includes(status as PuppyStatus)) {
    return status as PuppyStatus;
  }
  
  return PuppyStatus.AVAILABLE; // Default
}

/**
 * Converts a string to the corresponding LitterStatus enum value
 */
export function toLitterStatus(status: string): LitterStatus {
  if (!status) return LitterStatus.ACTIVE;
  
  const statusStr = String(status).toLowerCase();
  if (Object.values(LitterStatus).some(s => s === statusStr)) {
    return statusStr as LitterStatus;
  }
  
  return LitterStatus.ACTIVE; // Default
}

/**
 * Alias for stringToHealthRecordType to maintain backward compatibility
 */
export const toHealthRecordType = stringToHealthRecordType;
