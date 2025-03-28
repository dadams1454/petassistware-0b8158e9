
interface Dog {
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

interface Puppy {
  id: string;
  created_at: string;
  name: string;
  gender: string;
  status: string;
  color: string;
  birth_date: string;
  birth_weight: string | number; // Accept string or number
  current_weight: string | number; // Accept string or number
  microchip_number: string;
  sale_price: number;
  deworming_dates?: string; // Make optional
  vaccination_dates?: string; // Make optional
  vet_check_dates?: string; // Make optional
  notes: string;
  photo_url: string;
  litter_id: string;
  birth_time?: string;
  akc_litter_number?: string;
  akc_registration_number?: string;
}

interface Litter {
  id: string;
  created_at: string;
  litter_name: string;
  dam_id: string;
  sire_id: string;
  birth_date: string;
  expected_go_home_date: string;
  puppy_count: number;
  male_count: number;
  female_count: number;
  notes: string;
  updated_at?: string; // Make optional to match the puppies/types.ts definition
  documents_url: string;
  puppies?: Puppy[];
  dam?: Dog;
  sire?: Dog;
  // AKC compliance fields
  akc_registration_number?: string;
  akc_registration_date?: string;
  akc_breeder_id?: string;
  akc_litter_color?: string;
  akc_documents_url?: string;
  akc_verified?: boolean;
  // Breeding details
  first_mating_date?: string;
  last_mating_date?: string;
  kennel_name?: string;
  breeding_notes?: string;
}
