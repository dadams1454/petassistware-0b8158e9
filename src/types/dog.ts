
// Import WeightUnit from common
import type { WeightUnit } from '@/types/common';

export enum DogGender {
  Male = 'Male',
  Female = 'Female',
  male = 'Male', // For backward compatibility
  female = 'Female' // For backward compatibility
}

export enum DogStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deceased = 'deceased',
  Rehomed = 'rehomed',
  Sold = 'sold',
  Guardian = 'guardian',
  Archived = 'archived',
  Retired = 'retired'
}

export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  gender: DogGender;
  birthdate: string;
  color: string;
  weight: number;
  weight_unit: WeightUnit;
  status: DogStatus; // Required
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
  gender: DogGender;
  color?: string;
  birthdate?: string;
  status: DogStatus; // Required field
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
  potty_alert_threshold?: number; // Adding this field to match usage
  is_in_heat?: boolean;
  heat_start_date?: string;
  special_notes?: string;
  created_at: string;
  updated_at: string;
}

// Export WeightUnit type for compatibility
export type { WeightUnit };
