
// Health record constants and types

// HealthRecordType enum
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Laboratory = 'laboratory',
  Dental = 'dental',
  Allergy = 'allergy',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming'
}

// Health indicators enums
export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

export enum EnergyLevelEnum {
  Hyperactive = 'hyperactive',
  Normal = 'normal',
  LowEnergy = 'low_energy',
  Lethargic = 'lethargic'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Hard = 'hard',
  Watery = 'watery',
  Loose = 'loose',
  Mucousy = 'mucousy',
  Bloody = 'bloody'
}

// Helper for conversion between string and enum
export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  if (Object.values(HealthRecordTypeEnum).includes(type as HealthRecordTypeEnum)) {
    return type as HealthRecordTypeEnum;
  }
  return HealthRecordTypeEnum.Examination;
};

export const healthRecordTypeToString = (type: HealthRecordTypeEnum): string => {
  return type;
};

// Weight unit type
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Types
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title?: string;
  visit_date: string;
  vet_name: string;
  record_notes?: string;
  next_due_date?: string;
  document_url?: string;
  created_at: string;
  examination_type?: string;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  vaccine_name?: string;
  procedure_name?: string;
  recovery_notes?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  prescription_number?: string;
  lot_number?: string;
  expiration_date?: string;
  manufacturer?: string;
  surgeon?: string;
  anesthesia_used?: string;
  vet_clinic?: string;
  performed_by?: string;
}

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteLevelEnum;
  energy?: EnergyLevelEnum;
  stool_consistency?: StoolConsistencyEnum;
  abnormal?: boolean;
  alert_generated?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export interface Medication {
  id: string;
  dog_id: string;
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

export interface HealthCertificate {
  id: string;
  dog_id: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Weight data interfaces
export interface WeightData {
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  dog_id?: string;
  puppy_id?: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  percent_change?: number;
  notes?: string;
  created_at: string;
}
