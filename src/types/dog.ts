
export enum DogGender {
  Male = 'Male',
  Female = 'Female',
  male = 'Male', // For backward compatibility
  female = 'Female' // For backward compatibility
}

export enum DogStatus {
  active = 'active',
  inactive = 'inactive',
  deceased = 'deceased',
  rehomed = 'rehomed',
  sold = 'sold'
}

export type WeightUnit = 'lb' | 'kg' | 'g' | 'oz';

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
}

// Basic Dog information type (used in many places)
export interface Dog {
  id: string;
  name: string;
  breed: string;
  gender: DogGender;
  color?: string;
  birthdate?: string;
  status: DogStatus; // Required
  created_at: string;
  // Additional properties that might be used
  photo_url?: string;
  is_pregnant?: boolean;
  dam_id?: string;
  sire_id?: string;
  reproductive_status?: string;
  registration_number?: string;
  tie_date?: string;
}

// Re-export weight units for compatibility
export { type WeightUnit };

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
