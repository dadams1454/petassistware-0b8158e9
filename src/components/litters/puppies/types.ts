
import { WeightUnit } from '@/types/common';
import { SocializationCategory, SocializationReactionType, SocializationReaction } from '@/types/puppyTracking';

// Puppy interface for PuppyForm component
export interface Puppy {
  id: string;
  name: string;
  litter_id?: string;
  birth_date: string;
  birth_weight?: string;
  birth_order?: number;
  gender: string;
  color: string;
  status: 'Available' | 'Reserved' | 'Sold' | 'Unavailable';
  microchip_number?: string;
  akc_registration_number?: string;
  akc_litter_number?: string;
  notes?: string;
  photo_url?: string;
  created_at?: string;
  birth_time?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  eyes_open_date?: string;
  ears_open_date?: string;
  first_walk_date?: string;
  fully_mobile_date?: string;
  current_weight?: string;
  sale_price?: number;
  reservation_date?: string;
  deworming_dates?: string;
  vaccination_dates?: string;
  vet_check_dates?: string;
  presentation?: string;
  weight_unit?: WeightUnit;
  weight_notes?: string;
  health_notes?: string;
}

// Type used in PuppyForm for form values
export type PuppyFormValues = Partial<Puppy>;

// Type for PuppyForm component props
export interface PuppyFormProps {
  litterId: string;
  initialData?: PuppyFormValues;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Form data type for compatibility
export type PuppyFormData = Puppy;

// Socialization record type
export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: SocializationCategory | { id: string; name: string };
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}
