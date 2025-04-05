
// Dog-related type definitions

// Dog status enumeration
export enum DogStatus {
  active = 'active',
  inactive = 'inactive',
  deceased = 'deceased',
  transferred = 'transferred',
  breeding = 'breeding',
  retired = 'retired'
}

// Dog gender enumeration
export enum DogGender {
  Male = 'Male',
  Female = 'Female'
}

// Document type enumeration
export enum DocumentType {
  medical = 'medical',
  registration = 'registration',
  pedigree = 'pedigree',
  contract = 'contract',
  other = 'other'
}

// Dog interface
export interface Dog {
  id: string;
  name: string;
  gender: DogGender;
  breed: string;
  birthdate?: string;
  color?: string;
  registration_number?: string;
  microchip_number?: string;
  last_vaccination_date?: string;
  last_heat_date?: string;
  tie_date?: string;
  is_pregnant?: boolean;
  notes?: string;
  photo_url?: string;
  litter_number?: number;
  weight?: number;
  created_at: string;
  owner_id?: string;
  tenant_id?: string;
  pedigree?: boolean;
  status: DogStatus; // Added required status property
}

// Dog profile interface (extended dog information)
export interface DogProfile extends Dog {
  vaccination_type?: string;
  vaccination_notes?: string;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  requires_special_handling?: boolean;
}

// Vaccination record interface
export interface Vaccination {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
  created_at: string;
}

