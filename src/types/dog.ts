
import type { WeightUnit } from './common';
import { HealthRecordTypeEnum } from './health';

export interface Dog {
  id: string;
  name: string;
  breed?: string;
  gender?: DogGender;
  created_at: string;
  birth_date?: string;
  color?: string;
  registration_number?: string;
  markings?: string;
  microchip_number?: string;
  status: string; // Make status required
  notes?: string;
  owner_id?: string;
  is_breeding?: boolean;
  dam_id?: string;
  sire_id?: string;
  owner_name?: string;
  // Reproductive properties
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  reproductive_status?: string;
  // Weight fields
  weight?: number;
  weight_unit?: WeightUnit;
  // Additional fields for extended dog profiles
  birthdate?: string; // For compatibility with API
  photo_url?: string;
  pedigree?: boolean;
  requires_special_handling?: boolean;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  litter_number?: number;
  vaccination_type?: string;
  vaccination_notes?: string;
  last_vaccination_date?: string;
  tenant_id?: string;
  registration_organization?: string;
  microchip_location?: string;
  group_ids?: string[];
  last_medical_check?: string;
  next_vaccination_due?: string;
}

export interface DogProfile extends Dog {
  // Additional fields for dog profiles
  reproductive_status?: string;
}

export enum DogGender {
  Male = 'Male',
  Female = 'Female'
}

export enum DogStatus {
  active = 'active',
  inactive = 'inactive',
  deceased = 'deceased',
  rehomed = 'rehomed',
  sold = 'sold'
}

export enum DocumentType {
  Registration = 'registration',
  Pedigree = 'pedigree',
  Health = 'health',
  Vaccination = 'vaccination',
  Contract = 'contract',
  Other = 'other'
}

export interface Vaccination {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
  created_at: string;
}

// Export WeightUnit type for external use
export type { WeightUnit };
