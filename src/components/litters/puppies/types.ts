
export interface Puppy {
  id: string;
  name: string | null;
  gender: string | null;
  color: string | null;
  birth_date: string | null;
  birth_time?: string | null;
  birth_weight: string | number | null;
  current_weight: string | number | null;
  photo_url: string | null;
  notes: string | null;
  litter_id: string;
  status: 'Available' | 'Reserved' | 'Sold' | 'Kept' | 'Deceased' | 'Retained' | string;
  microchip_number: string | null;
  sale_price: number | null;
  created_at: string;
  updated_at?: string;
  
  // Weight tracking fields
  weight_history?: WeightRecord[] | null;
  weight_notes?: string | null;

  // Health monitoring fields
  deworming_dates?: string | null;
  vaccination_dates?: string | null;
  vet_check_dates?: string | null;
  
  // AKC registration fields
  akc_litter_number?: string | null;
  akc_registration_number?: string | null;
  akc_verified?: boolean;
  
  // New fields from database migration
  presentation?: string | null;
  assistance_required?: boolean;
  assistance_notes?: string | null;
  birth_order?: number | null;
  eyes_open_date?: string | null;
  ears_open_date?: string | null;
  first_walk_date?: string | null;
  fully_mobile_date?: string | null;
}

export interface PuppyFormData {
  name: string;
  gender: string;
  status: 'Available' | 'Reserved' | 'Sold' | 'Kept' | 'Deceased';
  color: string;
  birth_date: Date | null;
  birth_weight: string | number | null;
  current_weight: string | number | null;
  weight_notes?: string;
  microchip_number: string;
  sale_price: number | string | null;
  deworming_dates: string;
  vaccination_dates: string;
  vet_check_dates: string;
  notes: string;
  photo_url: string;
  birth_time: string;
  akc_litter_number: string;
  akc_registration_number: string;
  // New fields
  presentation?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  birth_order?: number | string;
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
  updated_at?: string; // Make optional to match expected type
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

export interface WeightRecord {
  date: string;
  weight: number;
  weight_unit: 'lbs' | 'kg' | 'g' | 'oz';
  notes?: string;
}

export interface PuppyFormProps {
  litterId: string;
  initialData?: Puppy;
  onSuccess: () => void;
}
