
// Dog interface
export interface Dog {
  id: string;
  name: string;
  breed?: string;
  gender?: string;
  color?: string;
  birthdate?: string;
  weight?: number;
  weight_unit?: string;
  microchip_number?: string;
  registration_number?: string;
  owner_id?: string;
  photo_url?: string;
  notes?: string;
  created_at?: string;
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  pedigree?: boolean;
  litter_number?: number;
  last_vaccination_date?: string;
  vaccination_notes?: string;
  vaccination_type?: string;
  tenant_id?: string;
  requires_special_handling?: boolean;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  reproductive_status?: string;
  status?: DogStatus;
  registration_organization?: string;
  microchip_location?: string;
  group_ids?: string[];
  sire_id?: string;
  dam_id?: string;
}

// Compatible with Dog but with potentially different field names
export interface DogProfile extends Dog {
  // Additional fields or overrides can be added here if needed
}

// Dog gender enum
export enum DogGender {
  Male = 'male',
  Female = 'female'
}

// Dog status enum
export enum DogStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deceased = 'deceased',
  Sold = 'sold',
  Rehomed = 'rehomed',
  Guardian = 'guardian'
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
  Preventive = 'preventive',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Test = 'test',
  Other = 'other',
  Procedure = 'procedure'
}

// Document type enum
export enum DocumentType {
  HealthCertificate = 'health_certificate',
  VaccinationRecord = 'vaccination_record',
  MedicalRecord = 'medical_record',
  Registration = 'registration',
  Pedigree = 'pedigree',
  Contract = 'contract',
  Image = 'image',
  Other = 'other'
}

// Health record interface
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

// Vaccination interface
export interface Vaccination {
  id?: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: Date | string | null;
  vaccination_dateStr?: string;
  notes?: string;
  created_at?: Date | string;
}

// Weight unit type
export type WeightUnit = 'kg' | 'g' | 'lb' | 'oz';

// Weight record interface
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

// Growth statistics interface
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
