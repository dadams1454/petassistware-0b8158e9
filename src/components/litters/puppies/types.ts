
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
}
