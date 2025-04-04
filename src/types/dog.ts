
// Import WeightUnit from common
import { WeightUnit } from './common';
import { HeatIntensityType } from './reproductive';

export enum DogGender {
  Male = 'male',
  Female = 'female'
}

export enum DogStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deceased = 'deceased',
  Sold = 'sold',
  Rehomed = 'rehomed',
  Guardian = 'guardian'
}

export enum DocumentType {
  HealthRecord = 'health_record',
  VaccinationCertificate = 'vaccination_certificate',
  Registration = 'registration',
  PurchaseAgreement = 'purchase_agreement',
  Other = 'other'
}

// To match with health.ts
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
  Preventive = 'preventive',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Test = 'test',
  Other = 'other',
  Procedure = 'procedure'
}

export interface Dog {
  id: string;
  name: string;
  breed?: string;
  gender?: string;
  birthdate?: string;
  color?: string;
  created_at?: string;
  last_heat_date?: string;
  next_heat_date?: string;
  registration_number?: string;
  microchip_number?: string;
  registration_organization?: string;
  microchip_location?: string;
  reproductive_status?: string;
  status?: string;
  is_pregnant?: boolean;
  tie_date?: string;
  weight?: number;
  weight_unit?: WeightUnit;
  litter_number?: number;
}

export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  color?: string;
  gender?: string;
  birthdate?: string;
  photo_url?: string;
  weight?: number;
  weight_unit?: WeightUnit;
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  vaccination_type?: string;
  vaccination_notes?: string;
  last_vaccination_date?: string;
  requires_special_handling?: boolean;
  pedigree?: boolean;
  litter_number?: number;
  owner_id?: string;
  notes?: string;
  microchip_number?: string;
  registration_number?: string;
  registration_organization?: string;
  microchip_location?: string;
  reproductive_status?: string;
  status?: string;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  group_ids?: string[];
  sire_id?: string;
  dam_id?: string;
  created_at?: string;
}

// Export WeightRecord and HealthRecord that match the health.ts definitions
// These are simplified references - the full definitions come from health.ts
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
}

export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title?: string;
  visit_date: string;
  date?: string; // For compatibility
  vet_name: string;
  description?: string;
  document_url?: string;
  record_notes?: string;
  created_at: string;
  next_due_date?: string;
  performed_by?: string;
  expiration_date?: string;
  
  // Field groups for specific record types
  // Vaccination
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  
  // Medication
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  
  // Examination
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // Surgery
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

export interface Vaccination {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
  created_at: string;
}

export interface GrowthStats {
  percentChange: number;
  averageGrowthRate: number;
  weightGoal: number | null;
  onTrack: boolean | null;
  totalGrowth?: number | null;
  currentWeight?: number;
  weightUnit?: string;
  averageGrowth?: number;
  growthRate?: number;
  lastWeekGrowth?: number;
  projectedWeight?: number;
}

// Heat cycle interface for compatibility
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_number?: number;
  cycle_length?: number;
  intensity: HeatIntensityType;
  symptoms?: string[];
  fertility_indicators?: any;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  recorded_by?: string;
}
