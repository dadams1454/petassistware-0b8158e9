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

export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  color?: string;
  gender?: string;
  birthdate?: string;
  photo_url?: string;
  weight?: number;
  weight_unit?: string;
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
  microchip_location?: string;
  registration_number?: string;
  registration_organization?: string;
  reproductive_status?: string;
  status?: DogStatus;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  group_ids?: string[];
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: string;
  unit?: string; // Added for compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
}

export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: string;
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
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // Surgery-specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
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

// Health indicator types
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

export enum DocumentType {
  Health = 'health',
  Registration = 'registration',
  Contract = 'contract',
  Insurance = 'insurance',
  Other = 'other'
}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  color?: string;
  gender?: string;
  birthdate?: string;
  photo_url?: string;
  weight?: number;
  weight_unit?: string;
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
  microchip_location?: string;
  registration_number?: string;
  registration_organization?: string;
  reproductive_status?: string;
  status?: DogStatus;
}

export interface Litter {
  id: string;
  litter_name: string;
  dam_id: string;
  sire_id?: string;
  birth_date: string;
  whelp_date?: string;
  puppy_count?: number;
  status: 'active' | 'completed' | 'planned' | 'archived';
  notes?: string;
  created_at?: string;
  male_count?: number;
  female_count?: number;
  breeding_notes?: string;
  akc_litter_number?: string;
  akc_registration_number?: string;
  akc_registration_date?: string;
  akc_verified?: boolean;
  expected_go_home_date?: string;
}

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  cycle_number?: number;
  cycle_length?: number;
  intensity?: string;
  symptoms?: string[];
  fertility_indicators?: any;
  notes?: string;
  created_at: string;
  updated_at?: string;
  recorded_by?: string;
}

export interface Vaccination {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
}
