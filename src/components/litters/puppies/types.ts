
export interface PuppyFormData {
  name: string | null;
  gender: string | null;
  status: string;
  color: string | null;
  birth_date: Date | null;
  birth_weight: string | null;
  current_weight: string | null;
  microchip_number: string | null;
  sale_price: number | null;
  deworming_dates: string | null;
  vaccination_dates: string | null;
  vet_check_dates: string | null;
  notes: string | null;
  photo_url: string | null;
  birth_time?: string | null;
  akc_litter_number?: string | null;
  akc_registration_number?: string | null;
  transfer_date?: Date | null;
  new_owner_name?: string | null;
  new_owner_address?: string | null;
  contract_url?: string | null;
}

export interface PuppyFormProps {
  litterId: string;
  initialData?: Puppy;
  onSuccess: () => void;
}

export interface Puppy {
  id: string;
  created_at: string;
  name: string | null;
  gender: string | null;
  status: string;
  color: string | null;
  birth_date: string | null;
  birth_weight: string | null;
  current_weight: string | null;
  microchip_number: string | null;
  sale_price: number | null;
  deworming_dates: string | null;
  vaccination_dates: string | null;
  vet_check_dates: string | null;
  notes: string | null;
  photo_url: string | null;
  litter_id: string;
  birth_time?: string | null;
  akc_litter_number?: string | null;
  akc_registration_number?: string | null;
  transfer_date?: string | null;
  new_owner_name?: string | null;
  new_owner_address?: string | null;
  contract_url?: string | null;
}

// Updated Litter interface with all required fields including breeder_id and AKC compliance fields
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
  documents_url: string | null;
  updated_at?: string; // Make this optional since it's not always present
  status?: string; // Add status field for archived/active
  breeder_id: string; // Add breeder_id field to associate litters with users
  
  // AKC compliance fields
  akc_registration_number?: string | null;
  akc_registration_date?: string | null;
  akc_breeder_id?: string | null;
  akc_litter_color?: string | null;
  akc_documents_url?: string | null;
  akc_verified?: boolean | null;
  
  // Breeding details
  first_mating_date?: string | null;
  last_mating_date?: string | null;
  kennel_name?: string | null;
  breeding_notes?: string | null;
  
  // Related records
  puppies?: Puppy[];
  dam?: Dog;
  sire?: Dog;
}

// Add Dog interface for related data with AKC compliance fields
export interface Dog {
  id: string;
  name: string;
  breed: string;
  gender?: string | null;
  color?: string | null;
  photo_url?: string | null;
  litter_number?: number | null;
  registration_number?: string | null;
  microchip_number?: string | null;
  akc_registered_name?: string | null;
  akc_titles?: string | null;
  markings?: string | null;
  pedigree_url?: string | null;
}
