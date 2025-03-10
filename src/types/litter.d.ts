
interface Dog {
  id: string;
  name: string;
  breed: string;
  gender?: string;
  birthdate?: string | null;
  photo_url?: string | null;
}

interface Puppy {
  id: string;
  litter_id: string;
  name?: string | null;
  gender?: string | null;
  status?: string;
  microchip_number?: string | null;
  photo_url?: string | null;
  sale_price?: number | null;
  reservation_date?: string | null;
  created_at?: string;
  
  // New fields
  birth_date?: string | null;
  birth_time?: string | null;
  color?: string | null;
  birth_weight?: string | null;
  current_weight?: string | null;
  deworming_dates?: string | null;
  vaccination_dates?: string | null;
  vet_check_dates?: string | null;
  notes?: string | null;
}

interface Litter {
  id: string;
  dam_id?: string | null;
  sire_id?: string | null;
  birth_date: string;
  expected_go_home_date?: string | null;
  litter_name?: string | null;
  puppy_count?: number | null;
  male_count?: number | null;
  female_count?: number | null;
  notes?: string | null;
  documents_url?: string | null;
  created_at?: string;
  
  // Joined data
  dam?: Dog | null;
  sire?: Dog | null;
  puppies?: Puppy[];
}

interface NewLitter {
  dam_id: string | null;
  sire_id: string | null;
  birth_date: string;
  expected_go_home_date?: string | null;
  litter_name?: string | null;
  puppy_count?: number | null;
  male_count?: number | null;
  female_count?: number | null;
  notes?: string | null;
  documents_url?: string | null;
}
