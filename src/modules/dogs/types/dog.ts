import { WeightUnit } from '@/types/weight-units';
import { DogStatus as CoreDogStatus, DogGender as CoreDogGender } from '@/types/unified';

// Alias the imported enums to avoid conflicts
export enum DogGender {
  Male = CoreDogGender.MALE,
  Female = CoreDogGender.FEMALE
}

// Reuse the core enum but with a module-specific alias
export { CoreDogStatus as DogStatus };

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
  status?: DogStatus;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
  group_ids?: string[];
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // Added for compatibility
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
  weightUnit?: WeightUnit;
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
