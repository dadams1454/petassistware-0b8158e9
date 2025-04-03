
import { WeightUnit } from '@/types/common';

export enum DogGender {
  Male = 'Male',
  Female = 'Female'
}

export enum DogStatus {
  Active = 'active',
  Inactive = 'inactive',
  Sold = 'sold',
  Deceased = 'deceased',
  Rehomed = 'rehomed',
  Guardian = 'guardian'
}

export interface Dog {
  id: string;
  name: string;
  breed?: string;
  gender?: DogGender;
  birthdate?: string;
  color?: string;
  weight?: number;
  microchip_number?: string;
  registration_number?: string;
  photo_url?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  status?: DogStatus;
  owner_id?: string;
  tenant_id?: string;
  // Add reproductive properties
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
}

export interface DogProfile extends Dog {
  pedigree?: boolean;
  requires_special_handling?: boolean;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  litter_number?: number;
  vaccination_type?: string;
  vaccination_notes?: string;
  last_vaccination_date?: string;
  weight_unit?: WeightUnit;
}

export interface HealthRecord {
  id: string;
  dog_id: string;
  title: string;
  record_type: string;
  visit_date: string;
  record_notes?: string;
  vet_name: string;
  document_url?: string;
  next_due_date?: string;
  created_at: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For backward compatibility
  date: string;
  notes?: string;
  created_at: string;
}
