
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Certification = 'certification'
}

export type WeightUnit = 'lb' | 'kg' | 'oz';

export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  visit_date: string;
  vet_name: string;
  record_notes?: string;
  document_url?: string;
  next_due_date?: string;
}

export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

export enum EnergyLevelEnum {
  VeryHigh = 'veryHigh',
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  VeryLow = 'veryLow'
}

export enum StoolConsistencyEnum {
  Solid = 'solid',
  SemiSolid = 'semiSolid',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Bloody = 'bloody',
  Mucousy = 'mucousy'
}

export type WeightRecord = {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  notes?: string;
  percent_change?: number;
};

export interface HealthCertificate {
  id: string;
  puppy_id: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

export interface Medication {
  id: string;
  puppy_id: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  administration_route: string;
  notes?: string;
  last_administered?: string;
  is_active: boolean;
  created_at: string;
}

export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}
