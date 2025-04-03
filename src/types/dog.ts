
import { WeightUnit } from './common';

// Define Dog Gender as enum
export enum DogGender {
  Male = 'Male',
  Female = 'Female'
}

// Health record type enum
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Laboratory = 'laboratory',
  Imaging = 'imaging',
  Dental = 'dental',
  Allergy = 'allergy',
  Emergency = 'emergency',
  Preventive = 'preventive'
}

// Document type enum
export enum DocumentType {
  Registration = 'registration',
  Health = 'health',
  Genetic = 'genetic',
  Vaccination = 'vaccination',
  Contract = 'contract',
  Insurance = 'insurance',
  Pedigree = 'pedigree',
  Other = 'other'
}

// Base dog interface
export interface Dog {
  id: string;
  name: string;
  breed: string;
  gender: DogGender | string; // Accept string for backward compatibility
  color?: string;
  birthdate?: string;
  weight?: number;
  weight_unit?: WeightUnit;
  registration_number?: string;
  registration_organization?: string;
  microchip_number?: string;
  microchip_location?: string;
  owner_id?: string;
  notes?: string;
  photo_url?: string;
  created_at?: string;
  pedigree?: boolean;
  status?: string;
  // Health & breeding fields
  last_vaccination_date?: string;
  vaccination_type?: string;
  last_heat_date?: string;
  tie_date?: string;
  is_pregnant?: boolean;
  litter_number?: number;
  // Potty tracking fields
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  requires_special_handling?: boolean;
  group_ids?: string[];
}

// Expanded dog profile with additional data
export interface DogProfile extends Dog {
  owner?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  health_records?: HealthRecord[];
  vaccinations?: Vaccination[];
  weight_records?: WeightRecord[];
  heat_cycles?: HeatCycle[];
  litters?: Litter[];
  // Gallery
  photos?: { id: string; url: string }[];
}

// Health record interface for dogs
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum | string; // Use enum or string
  title: string;
  date: string;
  visit_date?: string; // For backwards compatibility
  description?: string;
  vet_name?: string;
  performed_by?: string;
  document_url?: string;
  notes?: string;
  record_notes?: string; // For backwards compatibility
  follow_up_date?: string;
  next_due_date?: string; // For scheduling future appointments
  created_at?: string;
  // Vaccination-specific fields
  vaccination_type?: string;
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  // Medication-specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  // Exam-specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  // Surgery-specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  // Prescription fields
  prescription_number?: string;
}

// Vaccination record
export interface Vaccination {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
  created_at?: string;
}

// Weight record
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  puppy_id?: string;
  age_days?: number;
}

// Heat cycle record
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_length?: number;
  intensity?: string;
  notes?: string;
  created_at: string;
}

// Litter record
export interface Litter {
  id: string;
  dam_id: string;
  sire_id?: string;
  whelp_date?: string;
  birth_date: string;
  puppy_count?: number;
  litter_name: string;
  status: 'active' | 'completed' | 'planned' | 'archived';
  notes?: string;
  created_at?: string;
}

// Dog status type
export type DogStatus = 'active' | 'inactive' | 'deceased' | 'sold' | 'transferred';
