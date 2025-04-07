
/**
 * This utility file provides functions to ensure compatibility
 * between different type systems used in the codebase
 */

import { 
  DogGender, DogStatus, HealthRecordType, 
  PuppyStatus, LitterStatus, ReproductiveStatus 
} from '@/types/enums';
import { WeightUnit, standardizeWeightUnit } from '@/types/common';
import type { Dog as CoreDog } from '@/types/dog';
import type { Puppy as CorePuppy } from '@/types/puppy';
import type { WeightRecord as CoreWeightRecord } from '@/types/weight';
import type { Litter as CoreLitter } from '@/types/litter';
import type { HealthRecord as CoreHealthRecord } from '@/types/health';

/**
 * Ensures an object's gender property conforms to the DogGender enum
 */
export function ensureValidGender(gender: any): DogGender {
  if (!gender) return DogGender.MALE;
  
  if (typeof gender === 'string') {
    const genderStr = gender.toLowerCase();
    if (genderStr === 'male' || genderStr === 'm') {
      return DogGender.MALE;
    } else if (genderStr === 'female' || genderStr === 'f') {
      return DogGender.FEMALE;
    }
  }
  
  // If it's already a valid enum value, return it
  if (Object.values(DogGender).includes(gender as DogGender)) {
    return gender as DogGender;
  }
  
  return DogGender.MALE; // Default
}

/**
 * Ensures an object's status property conforms to the DogStatus enum
 */
export function ensureValidDogStatus(status: any): DogStatus {
  if (!status) return DogStatus.ACTIVE;
  
  if (typeof status === 'string') {
    const statusStr = status.toLowerCase();
    if (Object.values(DogStatus).includes(statusStr as DogStatus)) {
      return statusStr as DogStatus;
    }
  }
  
  return DogStatus.ACTIVE; // Default
}

/**
 * Ensures an object's status property conforms to the PuppyStatus enum
 */
export function ensureValidPuppyStatus(status: any): PuppyStatus {
  if (!status) return PuppyStatus.AVAILABLE;
  
  if (typeof status === 'string') {
    if (Object.values(PuppyStatus).includes(status as PuppyStatus)) {
      return status as PuppyStatus;
    }
  }
  
  return PuppyStatus.AVAILABLE; // Default
}

/**
 * Ensures an object's weight_unit property is a valid WeightUnit
 */
export function ensureValidWeightUnit(unit: any): WeightUnit {
  if (!unit) return 'lb';
  
  if (typeof unit === 'string') {
    return standardizeWeightUnit(unit);
  }
  
  return 'lb'; // Default
}

/**
 * Ensures an object's record_type property conforms to the HealthRecordType enum
 */
export function ensureValidHealthRecordType(type: any): HealthRecordType {
  if (!type) return HealthRecordType.EXAMINATION;
  
  if (typeof type === 'string') {
    const typeUpper = type.toUpperCase();
    if (Object.keys(HealthRecordType).includes(typeUpper)) {
      return HealthRecordType[typeUpper as keyof typeof HealthRecordType];
    }
  }
  
  return HealthRecordType.EXAMINATION; // Default
}

/**
 * Safely accesses properties of an object that might have inconsistent property names
 * Used to handle different naming conventions across the codebase
 */
export function safeAccess<T>(obj: any, propertyPaths: string[], defaultValue: T): T {
  if (!obj) return defaultValue;
  
  // Try each property path in order
  for (const path of propertyPaths) {
    const keys = path.split('.');
    let value = obj;
    
    // Navigate through nested properties
    for (const key of keys) {
      if (value === null || value === undefined || typeof value !== 'object') {
        value = undefined;
        break;
      }
      value = value[key];
    }
    
    // If we found a value, return it
    if (value !== undefined) {
      return value as T;
    }
  }
  
  return defaultValue;
}

/**
 * Utility to safely transform properties across inconsistent object shapes
 * @param source The source object to extract properties from
 * @param propertyMap An object mapping target properties to arrays of possible source properties
 * @param defaultValues Default values for each property
 * @returns A new object with consistent property names
 */
export function normalizeProperties<T extends object>(
  source: any, 
  propertyMap: Record<keyof T, string[]>,
  defaultValues: T
): T {
  if (!source) return defaultValues;

  const result = { ...defaultValues };
  
  Object.entries(propertyMap).forEach(([targetProp, sourcePaths]) => {
    const defaultValue = defaultValues[targetProp as keyof T];
    result[targetProp as keyof T] = safeAccess(source, sourcePaths, defaultValue);
  });
  
  return result;
}

// Type compatibility utilities for all commonly used entity types

/**
 * Ensures an object conforms to the Dog interface
 */
export function ensureDogType(dog: any): CoreDog {
  if (!dog) return null as unknown as CoreDog;
  
  const propertyMap: Record<keyof CoreDog, string[]> = {
    id: ['id'],
    name: ['name'],
    breed: ['breed'],
    gender: ['gender'],
    birthdate: ['birthdate', 'birth_date'],
    birth_date: ['birth_date', 'birthdate'],
    color: ['color'],
    status: ['status'],
    created_at: ['created_at'],
    photo_url: ['photo_url'],
    is_pregnant: ['is_pregnant'],
    dam_id: ['dam_id'],
    sire_id: ['sire_id'],
    reproductive_status: ['reproductive_status'],
    registration_number: ['registration_number'],
    tie_date: ['tie_date'],
    last_heat_date: ['last_heat_date'],
    next_heat_date: ['next_heat_date'],
    litter_number: ['litter_number'],
    tenant_id: ['tenant_id'],
    pedigree: ['pedigree'],
    weight: ['weight'],
    weight_unit: ['weight_unit', 'unit']
  };
  
  // Default values for a minimal valid Dog object
  const defaultValues: CoreDog = {
    id: '',
    name: '',
    breed: '',
    gender: DogGender.MALE,
    birthdate: '',
    birth_date: '',
    color: '',
    status: DogStatus.ACTIVE,
    created_at: new Date().toISOString(),
    photo_url: '',
    is_pregnant: false,
    weight: 0,
    weight_unit: 'lb'
  } as CoreDog;
  
  const normalized = normalizeProperties<CoreDog>(dog, propertyMap, defaultValues);
  
  // Ensure enum values are valid
  normalized.gender = ensureValidGender(normalized.gender);
  normalized.status = ensureValidDogStatus(normalized.status);
  if (normalized.weight_unit) {
    normalized.weight_unit = ensureValidWeightUnit(normalized.weight_unit);
  }
  
  return normalized;
}

/**
 * Ensures an object conforms to the Puppy interface
 */
export function ensurePuppyType(puppy: any): CorePuppy {
  if (!puppy) return null as unknown as CorePuppy;
  
  const propertyMap: Record<string, string[]> = {
    id: ['id'],
    name: ['name'],
    gender: ['gender'],
    color: ['color'],
    birth_date: ['birth_date', 'birthdate'],
    litter_id: ['litter_id'],
    status: ['status'],
    created_at: ['created_at'],
    // Add other properties...
  };
  
  // Default values for a minimal valid Puppy object
  const defaultPuppy: Partial<CorePuppy> = {
    id: '',
    name: '',
    gender: 'Male',
    color: '',
    birth_date: '',
    litter_id: '',
    status: 'Available',
    created_at: new Date().toISOString()
  } as any;
  
  const normalized = normalizeProperties(puppy, propertyMap, defaultPuppy);
  
  // Ensure enum values are valid
  normalized.status = ensureValidPuppyStatus(normalized.status);
  if (normalized.weight_unit) {
    normalized.weight_unit = ensureValidWeightUnit(normalized.weight_unit);
  }
  
  return normalized as CorePuppy;
}

/**
 * Ensures an object conforms to the WeightRecord interface
 */
export function ensureWeightRecordType(record: any): CoreWeightRecord {
  if (!record) return null as unknown as CoreWeightRecord;
  
  // Handle unit vs weight_unit compatibility
  const unit = record.weight_unit || record.unit || 'lb';
  const weightUnit = standardizeWeightUnit(unit);
  
  const normalized: CoreWeightRecord = {
    id: record.id || '',
    dog_id: record.dog_id || '',
    puppy_id: record.puppy_id || undefined,
    weight: typeof record.weight === 'number' ? record.weight : 0,
    weight_unit: weightUnit,
    date: record.date || new Date().toISOString().split('T')[0],
    notes: record.notes || '',
    percent_change: record.percent_change !== undefined ? record.percent_change : 0,
    created_at: record.created_at || new Date().toISOString(),
    age_days: record.age_days || undefined,
    birth_date: record.birth_date || undefined
  };
  
  return normalized;
}

/**
 * Ensures an object conforms to the HealthRecord interface
 */
export function ensureHealthRecordType(record: any): CoreHealthRecord {
  if (!record) return null as unknown as CoreHealthRecord;
  
  // Normalize record type
  const recordType = ensureValidHealthRecordType(record.record_type);
  
  // Basic properties that should be present on all health records
  const normalized: Partial<CoreHealthRecord> = {
    id: record.id || '',
    dog_id: record.dog_id || '',
    record_type: recordType,
    title: record.title || '',
    visit_date: record.visit_date || record.date || new Date().toISOString().split('T')[0],
    vet_name: record.vet_name || '',
    description: record.description || '',
    document_url: record.document_url || undefined,
    record_notes: record.record_notes || record.notes || '',
    created_at: record.created_at || new Date().toISOString(),
  };
  
  // Add specific properties based on type
  return normalized as CoreHealthRecord;
}

