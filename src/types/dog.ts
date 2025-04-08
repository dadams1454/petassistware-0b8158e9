
/**
 * Dog-related type definitions
 */
import { WeightUnit } from './weight-units';

// Gender enum for dogs
export enum DogGender {
  MALE = 'Male',
  FEMALE = 'Female',
  // Legacy lowercase values for backward compatibility
  MALE_LOWER = 'male',
  FEMALE_LOWER = 'female'
}

// Status enum for dogs
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

// Dog profile interface with comprehensive details
export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  gender: DogGender | string; // Allow string for backward compatibility
  birthdate: string;
  color: string;
  weight?: number;
  weight_unit?: WeightUnit;
  status: DogStatus | string; // Allow string for backward compatibility
  photo_url?: string;
  microchip_number?: string;
  registration_number?: string;
  notes?: string;
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  litter_number?: number;
  created_at: string;
  pedigree?: boolean;
  requires_special_handling?: boolean;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  vaccination_type?: string;
  vaccination_notes?: string;
  last_vaccination_date?: string;
  owner_id?: string;
  sire_id?: string | null;
  dam_id?: string | null;
  registration_organization?: string;
  microchip_location?: string;
  group_ids?: string[];
  reproductive_status?: string;
  tenant_id?: string;
}

// Basic Dog information type (used in many places)
export interface Dog {
  id: string;
  name: string;
  breed: string;
  gender: DogGender | string; // Allow string for backward compatibility
  color?: string;
  birthdate?: string;
  birth_date?: string; // For backward compatibility
  status: DogStatus | string; // Required field, allow string for compatibility
  created_at: string;
  // Additional properties that might be used
  photo_url?: string;
  is_pregnant?: boolean;
  dam_id?: string;
  sire_id?: string;
  reproductive_status?: string;
  registration_number?: string;
  tie_date?: string;
  last_heat_date?: string;
  next_heat_date?: string;
  litter_number?: number;
  tenant_id?: string;
  pedigree?: boolean; // Added for compatibility with components
  // Compatibility properties
  weight?: number;
  weight_unit?: WeightUnit;
}

// Check if a value is a valid dog gender
export function isValidDogGender(value: any): value is DogGender {
  return Object.values(DogGender).includes(value as DogGender);
}

// Convert any gender value to proper DogGender enum
export function normalizeDogGender(gender: any): DogGender {
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

// Check if a value is a valid dog status
export function isValidDogStatus(value: any): value is DogStatus {
  return Object.values(DogStatus).includes(value as DogStatus);
}

// Convert any status value to proper DogStatus enum
export function normalizeDogStatus(status: any): DogStatus {
  if (!status) return DogStatus.ACTIVE;
  
  const statusStr = String(status).toLowerCase();
  if (Object.values(DogStatus).some(s => s.toLowerCase() === statusStr)) {
    return statusStr as DogStatus;
  }
  
  return DogStatus.ACTIVE; // Default
}

// Document type enum
export enum DocumentType {
  HEALTH_RECORD = 'health_record',
  VACCINATION = 'vaccination',
  CERTIFICATE = 'certificate',
  PEDIGREE = 'pedigree',
  REGISTRATION = 'registration',
  CONTRACT = 'contract',
  OTHER = 'other'
}

// Vaccination type for compatibility
export interface Vaccination {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  veterinarian?: string;
  notes?: string;
  created_at: string;
}

// Care status type for a dog
export interface DogCareStatus {
  dog_id: string;
  last_meal_time?: string;
  last_potty_time?: string;
  last_exercise_time?: string;
  last_medication_time?: string;
  potty_alert_threshold?: number;
  is_in_heat?: boolean;
  heat_start_date?: string;
  special_notes?: string;
  created_at: string;
  updated_at: string;
}

// Helper function to create a minimal dog object
export function createMinimalDog(id: string, name: string): Dog {
  return {
    id,
    name,
    breed: 'Unknown',
    gender: DogGender.MALE,
    status: DogStatus.ACTIVE,
    created_at: new Date().toISOString()
  };
}
