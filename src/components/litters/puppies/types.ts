export interface Puppy {
  id: string;
  name: string | null;
  gender: 'Male' | 'Female' | null;
  color: string | null;
  birth_date: string | null;
  birth_time: string | null;
  birth_weight: number | null;
  current_weight: number | null;
  photo_url: string | null;
  notes: string | null;
  litter_id: string;
  status: 'Available' | 'Reserved' | 'Sold' | 'Kept' | 'Deceased';
  microchip_number: string | null;
  sale_price: number | null;
  created_at: string;
  updated_at?: string;
}

export interface Litter {
  id: string;
  litter_name: string | null;
  birth_date: string;
  dam_id: string | null;
  sire_id: string | null;
  male_count: number | null;
  female_count: number | null;
  puppy_count: number | null;
  expected_go_home_date: string | null;
  notes: string | null;
  documents_url: string | null;
  created_at: string;
  updated_at?: string;
  status?: string;
  breeder_id: string;
  
  // AKC Registration fields
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
  
  // Relationships
  dam?: {
    id: string;
    name: string;
    breed?: string | null;
    color?: string | null;
    photo_url?: string | null;
    gender?: string;
    litter_number?: number;
    registration_number?: string | null;
    microchip_number?: string | null;
  } | null;
  sire?: {
    id: string;
    name: string;
    breed?: string | null;
    color?: string | null;
    photo_url?: string | null;
    gender?: string;
    registration_number?: string | null;
    microchip_number?: string | null;
  } | null;
  puppies?: Puppy[];
}

export interface Dog {
  id: string;
  created_at: string;
  name: string | null;
  breed: string | null;
  gender: string | null;
  color: string | null;
  birth_date: string | null;
  death_date: string | null;
  registration_number: string | null;
  microchip_number: string | null;
  photo_url: string | null;
  notes: string | null;
  litter_number: number | null;
  breeder_id: string | null;
}
