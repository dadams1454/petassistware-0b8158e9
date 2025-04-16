
/**
 * Core animal type definitions
 * Unified type system for dogs and puppies
 */
import { BaseEntity } from './index';
import { WeightUnit } from '../weight-units';

// Gender and Status enums
export enum AnimalGender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum DogStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DECEASED = 'deceased',
  SOLD = 'sold',
  REHOMED = 'rehomed',
  GUARDIAN = 'guardian'
}

export enum PuppyStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  UNAVAILABLE = 'unavailable'
}

// Base animal interface with common properties
export interface AnimalBase extends BaseEntity {
  name: string;
  gender?: AnimalGender | string;
  color?: string;
  birth_date?: string;
  photo_url?: string;
  weight?: number;
  weight_unit?: WeightUnit;
  microchip_number?: string;
  registration_number?: string;
  notes?: string;
}

// Dog specific interface
export interface Dog extends AnimalBase {
  breed: string;
  status?: DogStatus | string;
  is_pregnant?: boolean;
  dam_id?: string;
  sire_id?: string;
  reproductive_status?: string;
  tie_date?: string | null;
  last_heat_date?: string | null;
  next_heat_date?: string | null;
  litter_number?: number;
  tenant_id?: string;
  pedigree?: boolean;
  requires_special_handling?: boolean;
}

// Puppy specific interface
export interface Puppy extends AnimalBase {
  litter_id: string;
  status?: PuppyStatus | string;
  birth_order?: number;
  birth_weight?: number;
  birth_weight_unit?: WeightUnit;
  birth_time?: string;
  presentation?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  sale_price?: number;
  reservation_date?: string;
  akc_litter_number?: string;
  akc_registration_number?: string;
  health_notes?: string;
  weight_notes?: string;
}

// Litter interface
export interface Litter extends BaseEntity {
  litter_name?: string;
  dam_id: string;
  sire_id?: string;
  birth_date: string;
  expected_go_home_date?: string;
  status?: 'active' | 'completed' | 'planned' | 'archived';
  male_count?: number;
  female_count?: number;
  puppy_count?: number;
  akc_litter_number?: string;
  akc_registration_number?: string;
  akc_registration_date?: string;
  akc_verified?: boolean;
  notes?: string;
  breeding_notes?: string;
  archived?: boolean;
}

// Litter with related dogs
export interface LitterWithDogs extends Litter {
  dam?: Dog;
  sire?: Dog;
  puppies?: Puppy[];
}

// Simplified dog interface for use in litter context
export interface SimpleDog {
  id: string;
  name: string;
  breed?: string;
  color?: string;
  gender?: string;
  photo_url?: string;
}
