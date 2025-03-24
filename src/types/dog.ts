
export type DogColor = 
  | 'black'
  | 'brown'
  | 'golden'
  | 'cream'
  | 'white'
  | 'gray'
  | 'red'
  | 'merle'
  | 'brindle'
  | 'mixed';

export type DogBreed = 
  | 'newfoundland'
  | 'golden_retriever'
  | 'labrador_retriever'
  | 'german_shepherd'
  | 'bulldog'
  | 'poodle'
  | 'beagle'
  | 'rottweiler'
  | 'yorkshire_terrier'
  | 'boxer'
  | 'dachshund'
  | 'mixed';

export type DogGender = 'male' | 'female';

export type DogSize = 'small' | 'medium' | 'large' | 'giant';

export type DogStatus = 
  | 'active'
  | 'retired'
  | 'deceased'
  | 'rehomed'
  | 'guardian' 
  | 'sold';

export type DocumentType = 
  | 'registration_certificate'
  | 'health_certificate' 
  | 'microchip_registration'
  | 'pedigree'
  | 'dna_test'
  | 'purchase_agreement'
  | 'vaccination_record'
  | 'other';

export type WeightUnit = 'lbs' | 'kg' | 'oz' | 'g';

export type RegistrationOrganization = 
  | 'AKC'
  | 'UKC'
  | 'CKC'
  | 'FCI'
  | 'other';

// Import from health.ts to ensure consistent types
import { HealthRecordType } from '@/types/health';

export interface DogProfile {
  id: string;
  name: string;
  photo_url?: string;
  breed: string;
  gender: DogGender;
  birthdate: string; // ISO date format
  color: string;
  weight: number;
  weight_unit: WeightUnit;
  registration_number?: string;
  registration_organization?: RegistrationOrganization;
  microchip_number?: string;
  microchip_location?: string;
  status: DogStatus;
  notes?: string;
  group_ids?: string[]; // Reference to existing group system
  owner_id?: string; // For future owner relationship
  sire_id?: string; // For pedigree relationship
  dam_id?: string; // For pedigree relationship
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
}

// Import the HealthRecord from health.ts instead of defining it here
import { HealthRecord } from '@/types/health';

// Re-export for backward compatibility
export { HealthRecord };
