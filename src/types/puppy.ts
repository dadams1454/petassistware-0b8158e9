
/**
 * Puppy type definitions
 */
import { WeightRecord } from './weight';
import { WeightUnit } from './weight-units';

/**
 * Base puppy interface
 */
export interface Puppy {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  birth_date: string;
  color?: string;
  litter_id: string;
  status?: 'Available' | 'Reserved' | 'Sold' | 'Unavailable';
  microchip_number?: string;
  photo_url?: string;
  current_weight?: number;
  weight_unit?: WeightUnit;
  birth_weight?: number;
  birth_order?: number;
  birth_time?: string;
  presentation?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  akc_litter_number?: string;
  akc_registration_number?: string;
  eyes_open_date?: string;
  ears_open_date?: string;
  first_walk_date?: string;
  fully_mobile_date?: string;
  sale_price?: number;
  vaccination_dates?: string;
  deworming_dates?: string;
  vet_check_dates?: string;
  health_notes?: string;
  weight_notes?: string;
  notes?: string;
  created_at: string;
  reservation_date?: string;
}

/**
 * Puppy with age data
 */
export interface PuppyWithAge extends Puppy {
  age?: number;                  // For backward compatibility
  age_days?: number;             // For backward compatibility
  ageInDays: number;             // Canonical field
  ageInWeeks: number;            // Canonical field
  ageDescription?: string;       // Human-readable age description
  weightHistory?: WeightRecord[]; // Weight history for this puppy
}

/**
 * Puppy photo record
 */
export interface PuppyPhoto {
  id: string;
  puppy_id: string;
  photo_url: string;
  is_main?: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * Puppy care log
 */
export interface PuppyCareLog {
  id: string;
  puppy_id: string;
  category: string;
  task_name: string;
  notes?: string;
  created_by: string;
  timestamp: string;
  created_at: string;
}
