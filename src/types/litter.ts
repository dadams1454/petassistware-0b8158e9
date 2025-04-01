
// Remove import of UserRole that's causing issues
// import { UserRole } from '@/contexts/AuthProvider';

export interface Puppy {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  color: string;
  birth_date: string;
  litter_id: string;
  microchip_number?: string;
  current_weight?: string;
  photo_url?: string;
  status: 'Available' | 'Reserved' | 'Sold' | 'Unavailable';
  birth_order?: number;
  birth_weight?: string;
  birth_time?: string;
  presentation?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  sale_price?: number;
  notes?: string;
  vaccination_dates?: string;
  deworming_dates?: string;
  vet_check_dates?: string;
  akc_litter_number?: string;
  akc_registration_number?: string;
  litter?: {
    birth_date: string;
    dam?: {
      name: string;
    };
    sire?: {
      name: string;
    };
  };
}

export interface SimpleDog {
  id: string;
  name: string;
  gender: string;
  photo_url?: string;
  breed?: string;
  color?: string;
  registration_number?: string;
}

export interface Litter {
  id: string;
  litter_name?: string;
  dam_id?: string;
  sire_id?: string;
  dam?: SimpleDog;
  sire?: SimpleDog;
  birth_date: string;
  status?: string;
  akc_registration_number?: string;
  expected_go_home_date?: string;
  puppy_count?: number;
  male_count?: number;
  female_count?: number;
  notes?: string;
  breeder_id: string;
  puppies?: Puppy[];
  kennel_name?: string;
  akc_registration_date?: string;
  akc_verified?: boolean;
  akc_litter_color?: string;
  breeding_notes?: string;
  documents_url?: string;
  first_mating_date?: string;
  last_mating_date?: string;
  created_at?: string;
}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  gender?: string;
  birthdate?: string;
  color?: string;
  microchip_number?: string;
  registration_number?: string;
  photo_url?: string;
  notes?: string;
  pedigree?: boolean;
  weight?: number;
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  litter_number?: number;
  vaccination_type?: string;
  last_vaccination_date?: string;
  vaccination_notes?: string;
  owner_id?: string;
}

export interface WeightUnit {
  value: string;
  label: string;
}

export type WeightUnitValue = 'oz' | 'g' | 'lbs' | 'kg' | 'both';
