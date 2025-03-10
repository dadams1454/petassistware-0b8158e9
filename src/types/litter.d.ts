
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
  updated_at: string;
  sale_price?: number | null;
  photo_url?: string | null;
  // Add the missing properties
  birth_weight?: string | null;
  current_weight?: string | null;
  color?: string | null;
  markings?: string | null;
  notes?: string | null;
}

interface Litter {
  id: string;
  breeder_id: string;
  sire_id?: string | null;
  dam_id?: string | null;
  birth_date: string;
  whelp_date: string;
  count: number;
  description?: string | null;
  status: 'planned' | 'confirmed' | 'whelped' | 'weaned' | 'completed';
  created_at: string;
  updated_at: string;
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
