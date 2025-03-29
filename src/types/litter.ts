
import { WeightRecord } from './puppyTracking';

export interface Dog {
  id: string;
  created_at: string;
  name: string;
  breed: string;
  gender: string;
  color: string;
  birth_date: string;
  registration_number: string;
  microchip_number: string;
  notes: string;
  photo_url: string;
  updated_at?: string; // Make optional
  litter_number: number;
}

export type WeightUnit = 'oz' | 'g' | 'lbs' | 'kg';

export interface Puppy {
  id: string;
  created_at: string;
  name: string | null;
  gender: string | null;
  status: string;
  color: string | null;
  birth_date: string | null;
  birth_weight: string | number | null;
  current_weight: string | number | null;
  microchip_number: string | null;
  sale_price: number | null;
  deworming_dates?: string | null;
  vaccination_dates?: string | null;
  vet_check_dates?: string | null;
  notes: string | null;
  photo_url: string | null;
  litter_id: string;
  birth_time?: string | null;
  akc_litter_number?: string | null;
  akc_registration_number?: string | null;
  updated_at?: string;
  assistance_required?: boolean;
  assistance_notes?: string | null;
  birth_order?: number | null;
  eyes_open_date?: string | null;
  ears_open_date?: string | null;
  first_walk_date?: string | null;
  fully_mobile_date?: string | null;
  presentation?: string | null;
  weight_notes?: string | null;
  weight_history?: Array<{
    date: string;
    weight: number;
    weight_unit: WeightUnit; // Using the string literal type
    notes?: string;
  }> | null;
}

export interface Litter {
  id: string;
  created_at: string;
  litter_name: string | null;
  dam_id: string | null;
  sire_id: string | null;
  birth_date: string;
  expected_go_home_date: string | null;
  puppy_count: number | null;
  male_count: number | null;
  female_count: number | null;
  notes: string | null;
  updated_at?: string; // Make optional
  documents_url: string | null;
  puppies?: Puppy[];
  breeder_id: string; // Add breeder_id to match the type in puppies/types.ts
  dam?: Dog | null;
  sire?: Dog | null;
  // AKC compliance fields
  akc_registration_number?: string | null;
  akc_registration_date?: string | null;
  akc_breeder_id?: string | null;
  akc_litter_color?: string | null;
  akc_documents_url?: string | null;
  akc_verified?: boolean;
  // Breeding details
  first_mating_date?: string | null;
  last_mating_date?: string | null;
  kennel_name?: string | null;
  breeding_notes?: string | null;
  status?: string;
}
