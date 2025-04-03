
import { WeightUnit } from './common';

export interface Dog {
  id: string;
  name: string;
  breed?: string;
  gender?: DogGender;
  created_at: string;
  birth_date?: string;
  color?: string;
  registration_number?: string;
  markings?: string;
  microchip_number?: string;
  status?: string;
  notes?: string;
  owner_id?: string;
  is_breeding?: boolean;
  dam_id?: string;
  sire_id?: string;
  owner_name?: string;
  // Add reproductive properties
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  // Add weight fields
  weight?: number;
  weight_unit?: WeightUnit;
}

export enum DogGender {
  Male = 'Male',
  Female = 'Female'
}
