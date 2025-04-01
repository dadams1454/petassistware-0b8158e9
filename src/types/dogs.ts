
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
}

export enum DogGender {
  Male = 'Male',
  Female = 'Female'
}

export type WeightUnit = 'lbs' | 'kg' | 'oz' | 'g';
