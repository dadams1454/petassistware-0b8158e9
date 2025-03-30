
export interface PuppyFormProps {
  litterId: string;
  initialData?: Puppy | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface Puppy {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  color: string;
  birth_date: string;
  litter_id: string;
  microchip_number?: string;
  current_weight?: string;
  photo_url?: string;
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
}

export interface PuppyWithAge extends Puppy {
  age_in_weeks: number;
  ageInDays: number;
  litters?: {
    id: string;
    name?: string;
    birth_date: string;
  };
}

export interface PuppyFormData {
  name?: string;
  gender: 'Male' | 'Female';
  color: string;
  birth_date?: string | Date;
  current_weight?: string;
  microchip_number?: string;
  birth_order?: number;
  status: 'Available' | 'Reserved' | 'Sold' | 'Unavailable';
  birth_weight?: string;
  birth_time?: string;
  presentation?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  sale_price?: number;
  notes?: string;
}

export interface SocializationCategory {
  id: string;
  name: string;
}

export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface SocializationCategoryOption {
  id: string;
  name: string;
  value: string;
  label: string;
  examples: string[];
}

export interface SocializationReactionOption {
  id: string;
  name: string;
  value: string;
  label: string;
  color: string;
}

export interface WeightChartData {
  date: string;
  weight: number;
}

export interface WeightTrackerProps {
  puppyId: string;
  onWeightAdded?: () => void;
  onAddSuccess?: () => void;
}
