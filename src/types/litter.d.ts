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
  name: string;
  gender: string;
  status: 'available' | 'reserved' | 'sold' | 'keeping';
  microchip_number?: string;
  reservation_date?: string;
  buyer_id?: string;
  collar_color?: string;
  akc_number?: string;
  created_at: string;
  updated_at: string;
  birth_weight?: string;
  current_weight?: string;
  color?: string;
  markings?: string;
  notes?: string;
}

interface Litter {
  id: string;
  breeder_id: string;
  sire_id?: string;
  dam_id?: string;
  whelp_date: string;
  count: number;
  description?: string;
  status: 'planned' | 'confirmed' | 'whelped' | 'weaned' | 'completed';
  created_at: string;
  updated_at: string;
  puppies?: Puppy[];
  sire?: Dog;
  dam?: Dog;
  litter_name?: string;
  expected_go_home_date?: string;
  male_count?: number;
  female_count?: number;
  documents_url?: string;
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
