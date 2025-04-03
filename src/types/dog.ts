
export enum DogGender {
  Male = 'Male',
  Female = 'Female'
}

export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Procedure = 'procedure',
  Medication = 'medication',
  LabTest = 'lab_test',
  ParasitePrevention = 'parasite_prevention',
  Note = 'note',
  Other = 'other'
}

export enum DocumentType {
  MedicalRecord = 'medical_record',
  VaccinationCertificate = 'vaccination_certificate',
  Registration = 'registration',
  Contract = 'contract',
  Pedigree = 'pedigree',
  Other = 'other'
}

export type WeightUnit = 'kg' | 'lb' | 'g' | 'oz';

export interface Dog {
  id: string;
  name: string;
  gender?: string;
  breed?: string;
  birthdate?: string;
  registration_number?: string;
  microchip_number?: string;
  color?: string;
  weight?: number;
  notes?: string;
  photo_url?: string;
  is_pregnant?: boolean;
  pedigree?: boolean;
  last_heat_date?: string;
  last_vaccination_date?: string;
  tie_date?: string;
  litter_number?: number;
  vaccination_type?: string;
  vaccination_notes?: string;
  created_at?: string;
  tenant_id?: string;
  owner_id?: string;
  max_time_between_breaks?: number;
  potty_alert_threshold?: number;
  requires_special_handling?: boolean;
  reproductive_status?: string;
}

export interface DogProfile extends Dog {
  healthRecords?: HealthRecord[];
  vaccinations?: Vaccination[];
  weightRecords?: WeightRecord[];
  litters?: Litter[];
  heatCycles?: HeatCycle[];
}

export interface HealthRecord {
  id: string;
  dog_id: string;
  date: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  vet_name?: string;
  document_url?: string;
  notes?: string;
  created_at?: string;
}

export interface Vaccination {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
  created_at?: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at?: string;
}

export interface Litter {
  id: string;
  dam_id: string;
  sire_id?: string;
  litter_name: string;
  birth_date: string;
  status: 'active' | 'completed' | 'planned' | 'archived';
  notes?: string;
  created_at?: string;
}

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  created_at: string;
}
