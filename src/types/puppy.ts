
import { WeightUnit } from './weight-units';
import { WeightRecord } from './weight';

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
  weight_unit?: WeightUnit;
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
  created_at: string;
  updated_at?: string;
  is_test_data?: boolean;
  
  // Visual tracking fields
  eyes_open_date?: string;
  ears_open_date?: string;
  first_walk_date?: string;
  fully_mobile_date?: string;
  reservation_date?: string;
}

export interface PuppyWithAge extends Puppy {
  age: number;
  ageInDays: number;
  ageInWeeks: number;
  developmentalStage: string;
  weightHistory?: WeightRecord[];
  age_days?: number; // For backward compatibility
  age_weeks?: number; // For backward compatibility
  ageDescription?: string;
}

export interface PuppyPhoto {
  id: string;
  puppy_id: string;
  photo_url: string;
  created_at: string;
  is_main?: boolean;
}

export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  date: string;
  activity_type: string;
  notes?: string;
  performed_by?: string;
  created_at: string;
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

// Export WeightRecord type for Puppy usage
export type { WeightRecord };
