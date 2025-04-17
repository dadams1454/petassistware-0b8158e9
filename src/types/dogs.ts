
import { WeightUnit } from './common';
import { DogGender, DogStatus } from './dog';

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
  status?: DogStatus;
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
}

// Re-export but don't use star exports
// export * from './dog';
// Instead, explicitly re-export the types:
export { DogGender, DogStatus };
