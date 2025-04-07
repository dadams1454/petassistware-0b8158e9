
/**
 * Puppy-related type definitions
 */
import { WeightUnit } from './weight-units';

// Base puppy interface
export interface Puppy {
  id: string;
  name: string;
  litter_id?: string;
  birth_date?: string;
  birth_weight?: string;
  birth_order?: number;
  gender?: string;
  color?: string;
  status?: 'Available' | 'Reserved' | 'Sold' | 'Unavailable';
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

// Enhanced puppy interface with calculated age fields
export interface PuppyWithAge extends Puppy {
  ageInDays?: number;
  ageInWeeks?: number;
  age_days?: number; // For backward compatibility
  age?: number; // For backward compatibility
  ageDescription?: string;
  weight?: number;
  weightUnit?: WeightUnit;
  growth?: number;
}

// Puppy photo type
export interface PuppyPhoto {
  id: string;
  puppy_id: string;
  url: string;
  caption?: string;
  taken_date?: string;
  created_at: string;
}

// Puppy care log entry
export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  care_type: string;
  care_date: string;
  notes?: string;
  performed_by?: string;
  created_at: string;
}
