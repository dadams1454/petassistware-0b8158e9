
import { Status } from '@/types/common';

export interface Dog {
  id: string;
  name: string;
  gender?: 'Male' | 'Female';
  breed?: string;
  birthdate?: string;
  microchip_number?: string;
  registration_number?: string;
  color?: string;
  weight?: number;
  weight_unit?: string;
  height?: number;
  height_unit?: string;
  status: Status;
  health_status?: string;
  reproductive_status?: string;
  is_pregnant?: boolean;
  last_heat_date?: string;
  next_heat_date?: string;
  litter_number?: number;
  last_vaccination_date?: string;
  next_vaccine_due?: string;
  last_deworming_date?: string;
  next_deworming_due?: string;
  profile_image?: string;
  breeder_id?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export type DogInput = Omit<Dog, 'id' | 'created_at' | 'updated_at'>;

export interface DogWithLitter extends Dog {
  puppies?: any[];
  litters_as_dam?: any[];
  litters_as_sire?: any[];
}
