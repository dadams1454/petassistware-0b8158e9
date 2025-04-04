import { Gender, WeightUnit } from './common';

// Dog gender enum
export enum DogGender {
  Male = 'Male',
  Female = 'Female',
}

// Dog profile interface for detailed dog information
export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  gender: Gender; // Using updated Gender type
  color?: string;
  birthdate?: string;
  weight?: number;
  weight_unit?: WeightUnit; // Use common WeightUnit type
  microchip_number?: string;
  microchip_location?: string;
  registration_number?: string;
  registration_organization?: string;
  owner_id?: string;
  notes?: string;
  photo_url?: string;
  created_at?: string;
  pedigree?: boolean;
  last_heat_date?: string;
  is_pregnant?: boolean;
  litter_number?: number;
  last_vaccination_date?: string;
  max_time_between_breaks?: number;
  potty_alert_threshold?: number;
  requires_special_handling?: boolean;
  vaccination_notes?: string;
  vaccination_type?: string;
  tie_date?: string;
  tenant_id?: string;
  status?: string; // For compatibility with Dog interface
  sire_id?: string; // For breeding compatibility
  reproductive_status?: string; // For reproductive tracking
  group_ids?: string[]; // For dog groups
}

// Dog interface for compatibility with all dog-related components
export interface Dog {
  id: string;
  name: string;
  status: string;
  gender: Gender; // Using updated Gender type
  breed: string;
  color?: string;
  birthdate?: string;
  weight?: number;
  weight_unit?: WeightUnit; // Use common WeightUnit type
  microchip_number?: string;
  registration_number?: string;
  owner_id?: string;
  notes?: string;
  photo_url?: string;
  created_at?: string;
  pedigree?: boolean;
  last_heat_date?: string;
  is_pregnant?: boolean;
  litter_number?: number;
  last_vaccination_date?: string;
  max_time_between_breaks?: number;
  potty_alert_threshold?: number;
  requires_special_handling?: boolean;
  vaccination_notes?: string;
  vaccination_type?: string;
  tie_date?: string;
  tenant_id?: string;
  reproductive_status?: string; // Add missing field
}

// Dogs query parameters interface
export interface DogsQueryParams {
  gender?: string;
  breed?: string;
  isPregnant?: boolean;
  status?: string;
  search?: string;
  order?: string;
  page?: number;
  pageSize?: number;
}

// Dog care status
export interface DogCareStatus {
  id: string;
  dog_id: string;
  last_potty_break?: Date | null;
  last_feeding?: Date | null;
  last_exercise?: Date | null;
  last_medication?: Date | null;
  needs_potty_break: boolean;
  needs_feeding: boolean;
  needs_exercise: boolean;
  needs_medication: boolean;
  next_scheduled_potty?: Date | null;
  next_scheduled_feeding?: Date | null;
  next_scheduled_exercise?: Date | null;
  next_scheduled_medication?: Date | null;
  potty_alert_threshold?: number;
}

// Dog export and import interfaces
export interface DogExportData {
  dogs: DogProfile[];
  health_records: any[];
  weight_records: any[];
  medications: any[];
  breeding_records: any[];
  heat_cycles: any[];
  genetic_data: any[];
}

export interface DogImportData {
  dog: Partial<DogProfile>;
  health_records?: any[];
  weight_records?: any[];
  medications?: any[];
  breeding_records?: any[];
  heat_cycles?: any[];
  genetic_data?: any[];
}

export const mapToDogProfile = (data: any): DogProfile => {
  return {
    id: data.id,
    name: data.name,
    breed: data.breed,
    gender: data.gender,
    color: data.color,
    birthdate: data.birthdate,
    weight: data.weight,
    weight_unit: data.weight_unit,
    microchip_number: data.microchip_number,
    microchip_location: data.microchip_location,
    registration_number: data.registration_number,
    registration_organization: data.registration_organization,
    owner_id: data.owner_id,
    notes: data.notes,
    photo_url: data.photo_url,
    created_at: data.created_at,
    pedigree: data.pedigree,
    last_heat_date: data.last_heat_date,
    is_pregnant: data.is_pregnant,
    litter_number: data.litter_number,
    last_vaccination_date: data.last_vaccination_date,
    max_time_between_breaks: data.max_time_between_breaks,
    potty_alert_threshold: data.potty_alert_threshold,
    requires_special_handling: data.requires_special_handling,
    vaccination_notes: data.vaccination_notes,
    vaccination_type: data.vaccination_type,
    tie_date: data.tie_date,
    tenant_id: data.tenant_id,
    status: data.status,
    sire_id: data.sire_id,
    reproductive_status: data.reproductive_status,
    group_ids: data.group_ids
  };
};

// Convert DogProfile to Dog interface
export const dogProfileToBasicDog = (profile: DogProfile): Dog => {
  return {
    id: profile.id,
    name: profile.name,
    status: profile.status || 'active',
    gender: profile.gender,
    breed: profile.breed,
    color: profile.color,
    birthdate: profile.birthdate,
    weight: profile.weight,
    weight_unit: profile.weight_unit,
    microchip_number: profile.microchip_number,
    registration_number: profile.registration_number,
    owner_id: profile.owner_id,
    notes: profile.notes,
    photo_url: profile.photo_url,
    created_at: profile.created_at,
    pedigree: profile.pedigree,
    last_heat_date: profile.last_heat_date,
    is_pregnant: profile.is_pregnant,
    litter_number: profile.litter_number,
    last_vaccination_date: profile.last_vaccination_date,
    max_time_between_breaks: profile.max_time_between_breaks,
    potty_alert_threshold: profile.potty_alert_threshold,
    requires_special_handling: profile.requires_special_handling,
    vaccination_notes: profile.vaccination_notes,
    vaccination_type: profile.vaccination_type,
    tie_date: profile.tie_date,
    tenant_id: profile.tenant_id,
    reproductive_status: profile.reproductive_status
  };
};

// Document type enum
export enum DocumentType {
  HealthRecord = 'health_record',
  Registration = 'registration',
  Pedigree = 'pedigree',
  Contract = 'contract',
  MedicalReport = 'medical_report',
  Vaccination = 'vaccination',
  Other = 'other'
}

// Health record type enum
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Laboratory = 'laboratory',
  Imaging = 'imaging',
  Dental = 'dental',
  Allergy = 'allergy',
  Emergency = 'emergency',
  Preventive = 'preventive',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Test = 'test',
  Other = 'other',
  Procedure = 'procedure'
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  visit_date: string;
  record_type: string;
  title: string;
  vet_name: string;
  description?: string;
  performed_by?: string;
  next_due_date?: string;
  document_url?: string;
  record_notes?: string;
  created_at?: string;
  // Vaccination-specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  // Medication-specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  // Examination-specific fields
  examination_type?: string;
  findings: string;
  recommendations: string;
  follow_up_date: string;
  // Surgery-specific fields
  procedure_name: string;
  surgeon: string;
  anesthesia_used: string;
  recovery_notes: string;
}

// Vaccination interface
export interface Vaccination {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
  created_at: string;
}
