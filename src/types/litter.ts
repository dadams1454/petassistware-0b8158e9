
// Basic types for core puppy/litter management

export interface SimpleDog {
  id: string;
  name: string;
  breed?: string;
  color?: string;
  gender?: 'Male' | 'Female';
  photo_url?: string;
  birthdate?: Date | string;
}

export interface Dog extends SimpleDog {
  // Additional dog properties
  weight?: number;
  microchip_number?: string;
  registration_number?: string;
  pedigree?: boolean;
  notes?: string;
  vaccination_type?: string;
  last_vaccination_date?: Date | string;
  owner_id?: string;
  created_at?: Date | string;
}

export interface Puppy {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  color: string;
  birth_date: string;
  litter_id: string;
  microchip_number?: string;
  photo_url?: string;
  current_weight?: string;
  status: 'Available' | 'Reserved' | 'Sold' | 'Unavailable';
  birth_order?: number;
  birth_weight?: string;
  birth_time?: string;
  presentation?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  sale_price?: number;
  notes?: string;
  vaccination_dates?: string;
  deworming_dates?: string;
  vet_check_dates?: string;
  akc_litter_number?: string;
  akc_registration_number?: string;
  health_notes?: string;
  weight_notes?: string;
}

export interface PuppyWithAge extends Puppy {
  age_in_weeks: number;
  age_days: number;
  // For backward compatibility
  ageInDays?: number;
  age_weeks?: number;
  litters?: {
    id: string;
    name?: string;
    birth_date: string;
  };
  birth_order?: number;
}

export interface Litter {
  id: string;
  litter_name?: string;
  dam_id: string;
  sire_id: string;
  birth_date: string;
  expected_go_home_date?: string;
  status?: 'active' | 'completed' | 'planned';
  male_count?: number;
  female_count?: number;
  puppy_count?: number;
  akc_litter_number?: string;
  akc_registration_number?: string;
  akc_registration_date?: string;
  akc_verified?: boolean;
  notes?: string;
  breeding_notes?: string;
  created_at?: string;
}

export interface LitterWithDogs extends Litter {
  dam?: Dog;
  sire?: Dog;
  puppies?: Puppy[];
}

export type WeightUnitValue = 'oz' | 'g' | 'lbs' | 'kg' | 'lb';
