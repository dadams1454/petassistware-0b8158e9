
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
  date?: string;
  description?: string;
  performed_by?: string;
}

export interface Dog {
  id: string;
  name: string;
  breed?: string;
  gender?: string;
  birthdate?: string;
  color?: string;
  weight?: number;
  height?: number;
  microchip_id?: string;
  registration_id?: string;
  registration_number?: string;
  profile_photo_url?: string;
  owner_id?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  // Add reproductive properties
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
}

export enum DogGender {
  Male = 'Male',
  Female = 'Female'
}

export enum DogStatus {
  Active = 'active',
  Inactive = 'inactive',
  Sold = 'sold',
  Deceased = 'deceased'
}

export enum WeightUnit {
  Pounds = 'lbs',
  Kilograms = 'kg',
  Ounces = 'oz',
  Grams = 'g'
}

export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Dental = 'dental',
  Allergy = 'allergy',
  Test = 'test',
  Other = 'other'
}

export enum DocumentType {
  Registration = 'registration',
  Health = 'health',
  Pedigree = 'pedigree',
  Contract = 'contract',
  Other = 'other'
}

export interface DogProfile extends Dog {
  registration_number?: string;
  registration_organization?: string;
  microchip_number?: string;
  microchip_location?: string;
  status?: DogStatus;
  group_ids?: string[];
  sire_id?: string;
  dam_id?: string;
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  litter_number?: number;
  pedigree?: boolean;
  requires_special_handling?: boolean;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  vaccination_type?: string;
  vaccination_notes?: string;
  last_vaccination_date?: string;
  photo_url?: string;
  weight_unit?: WeightUnit;
}
