
import { Status } from '@/types/common';

export interface Dog {
  id: string;
  name: string;
  gender?: 'Male' | 'Female';
  breed?: string;
  birthdate?: string;
  microchip_number?: string;
  registration_number?: string;
  color?: string;
  weight?: number;
  weight_unit?: string;
  height?: number;
  height_unit?: string;
  status: Status;
  health_status?: string;
  reproductive_status?: string;
  is_pregnant?: boolean;
  last_heat_date?: string;
  next_heat_date?: string;
  litter_number?: number;
  last_vaccination_date?: string;
  next_vaccine_due?: string;
  last_deworming_date?: string;
  next_deworming_due?: string;
  profile_image?: string;
  breeder_id?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  
  // Additional fields for compatibility with other parts of the system
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  photo_url?: string;
  vaccination_type?: string;
  vaccination_notes?: string;
  requires_special_handling?: boolean;
  pedigree?: boolean;
  owner_id?: string;
  tie_date?: string;
}

export type DogInput = Omit<Dog, 'id' | 'created_at' | 'updated_at'>;

export interface DogWithLitter extends Dog {
  puppies?: any[];
  litters_as_dam?: any[];
  litters_as_sire?: any[];
}

// Define the DogProfile type for compatibility
export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  color?: string;
  gender?: string;
  birthdate?: string;
  photo_url?: string;
  weight?: number;
  weight_unit?: string;
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  vaccination_type?: string;
  vaccination_notes?: string;
  last_vaccination_date?: string;
  requires_special_handling?: boolean;
  pedigree?: boolean;
  litter_number?: number;
  owner_id?: string;
  notes?: string;
  microchip_number?: string;
  registration_number?: string;
  registration_organization?: string;
  microchip_location?: string;
  reproductive_status?: string;
  status?: DogStatus;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  group_ids?: string[];
}

// Define enums for Dog gender and status
export enum DogGender {
  Male = 'male',
  Female = 'female'
}

export enum DogStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deceased = 'deceased',
  Sold = 'sold',
  Rehomed = 'rehomed',
  Guardian = 'guardian'
}

// Document type enum
export enum DocumentType {
  Registration = 'registration',
  Microchip = 'microchip',
  HealthCertificate = 'health_certificate',
  Pedigree = 'pedigree',
  Contract = 'contract',
  Other = 'other'
}

// Re-export HealthRecord for backward compatibility
export type { HealthRecord, Vaccination } from '@/types/health';
export { HealthRecordTypeEnum } from '@/types/health';
