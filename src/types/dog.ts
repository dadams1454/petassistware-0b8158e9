
import { WeightUnit } from './common';

// Base dog interface
export interface Dog {
  id: string;
  name: string;
  breed: string;
  gender: 'Male' | 'Female';
  color?: string;
  birthdate?: string;
  weight?: number;
  weight_unit?: WeightUnit;
  registration_number?: string;
  microchip_number?: string;
  owner_id?: string;
  notes?: string;
  photo_url?: string;
  created_at?: string;
  pedigree?: boolean;
  // Health & breeding fields
  last_vaccination_date?: string;
  vaccination_type?: string;
  last_heat_date?: string;
  tie_date?: string;
  is_pregnant?: boolean;
  litter_number?: number;
  // Potty tracking fields
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  requires_special_handling?: boolean;
}

// Expanded dog profile with additional data
export interface DogProfile extends Dog {
  owner?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  health_records?: HealthRecord[];
  vaccinations?: Vaccination[];
  weight_records?: WeightRecord[];
  heat_cycles?: HeatCycle[];
  litters?: Litter[];
  // Gallery
  photos?: { id: string; url: string }[];
}

// Health record interface for dogs
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: string;
  title: string;
  date: string;
  description?: string;
  vet_name?: string;
  performed_by?: string;
  document_url?: string;
  notes?: string;
  follow_up_date?: string;
  created_at?: string;
  // Custom fields based on record type
  vaccination_type?: string;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  expiration_date?: string;
}

// Vaccination record
export interface Vaccination {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
  created_at?: string;
}

// Weight record
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
}

// Heat cycle record
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_length?: number;
  intensity?: string;
  notes?: string;
  created_at: string;
}

// Litter record
export interface Litter {
  id: string;
  dam_id: string;
  sire_id?: string;
  whelp_date?: string;
  birth_date: string;
  puppy_count?: number;
  litter_name: string;
  status: 'active' | 'completed' | 'planned' | 'archived';
  notes?: string;
  created_at?: string;
}

// Dog status type
export type DogStatus = 'active' | 'inactive' | 'deceased' | 'sold' | 'transferred';
