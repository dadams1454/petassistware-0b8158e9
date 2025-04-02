
export interface Puppy {
  id: string;
  name: string;
  gender: string;
  color: string;
  birth_date?: string;
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
  weight_unit?: string;
  created_at: string;
  updated_at?: string;
  is_test_data?: boolean;
}

export interface PuppyWeight {
  id: string;
  puppy_id: string;
  weight_grams: number;
  weight_unit: string;
  weight_date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PuppyCareLogProps {
  puppyId: string;
  puppyName: string;
  puppyGender: string;
  puppyColor: string;
  puppyAge: number;
  onSuccess?: () => void;
  onRefresh?: () => void;
}
