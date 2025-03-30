
export interface Litter {
  id: string;
  litter_name?: string | null;
  dam_id?: string | null;
  sire_id?: string | null;
  dam?: {
    id: string;
    name: string;
    gender: string;
    photo_url?: string | null;
  } | null;
  sire?: {
    id: string;
    name: string;
    gender: string;
    photo_url?: string | null;
  } | null;
  birth_date: string;
  expected_go_home_date?: string | null;
  puppy_count?: number | null;
  male_count?: number | null;
  female_count?: number | null;
  notes?: string | null;
  documents_url?: string | null;
  status?: string;
  // AKC compliance fields
  akc_registration_number?: string | null;
  akc_registration_date?: string | null;
  akc_litter_color?: string | null;
  akc_verified?: boolean | null;
  // Breeding details
  first_mating_date?: string | null;
  last_mating_date?: string | null;
  kennel_name?: string | null;
  breeding_notes?: string | null;
  breeder_id: string;
  created_at?: string;
}

export interface Puppy {
  id: string;
  litter_id?: string;
  name?: string;
  gender?: string;
  color?: string;
  birth_date?: string;
  birth_weight?: string;
  current_weight?: string;
  status?: string;
  microchip_number?: string;
  photo_url?: string;
  notes?: string;
  sale_price?: number;
  reservation_date?: string;
  birth_order?: number;
  birth_time?: string;
  eyes_open_date?: string;
  ears_open_date?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  presentation?: string;
  fully_mobile_date?: string;
  first_walk_date?: string;
  akc_litter_number?: string;
  akc_registration_number?: string;
  deworming_dates?: string;
  vaccination_dates?: string;
  vet_check_dates?: string;
}
