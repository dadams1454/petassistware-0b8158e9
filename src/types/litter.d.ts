
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
  name: string | null;
  gender: string | null;
  status: string;
  microchip_number?: string | null;
  reservation_date?: string | null;
  buyer_id?: string | null;
  collar_color?: string | null;
  akc_number?: string | null;
  created_at: string;
  updated_at?: string;  // Make this optional to match the data structure
  sale_price?: number | null;
  photo_url?: string | null;
  birth_weight?: string | null;  // Keep as string to match form data
  current_weight?: string | null;  // Keep as string to match form data
  color?: string | null;
  markings?: string | null;
  notes?: string | null;
}

interface Litter {
  id: string;
  breeder_id?: string;  // Make this optional to match actual data
  sire_id?: string | null;
  dam_id?: string | null;
  birth_date: string;
  whelp_date?: string;  // Make this optional to match actual data
  count?: number;       // Make this optional to match actual data
  description?: string | null;
  status?: string;      // Make this optional to match actual data
  created_at: string | null;
  updated_at?: string;  // Make this optional to match actual data
  puppies?: Puppy[];
  sire?: Dog;
  dam?: Dog;
  litter_name?: string | null;
  expected_go_home_date?: string | null;
  puppy_count?: number | null;
  male_count?: number | null;
  female_count?: number | null;
  notes?: string | null;
  documents_url?: string | null;
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
