
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
}

interface Litter {
  id: string;
  dam_id?: string | null;
  sire_id?: string | null;
  birth_date: string;
  puppy_count?: number | null;
  notes?: string | null;
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
  puppy_count?: number | null;
  notes?: string | null;
}
