
export enum HealthRecordTypeEnum {
  Vaccination = 'Vaccination',
  Examination = 'Examination',
  Medication = 'Medication',
  Surgery = 'Surgery',
  Observation = 'Observation',
  Deworming = 'Deworming',
  Grooming = 'Grooming',
  Dental = 'Dental',
  Allergy = 'Allergy',
  Test = 'Test',
  Other = 'Other'
}

export enum WeightUnitEnum {
  Pounds = 'lbs',
  Kilograms = 'kg',
  Ounces = 'oz',
  Grams = 'g'
}

export enum AppetiteLevelEnum {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor',
  None = 'None'
}

export enum EnergyLevelEnum {
  VeryHigh = 'VeryHigh',
  High = 'High',
  Normal = 'Normal',
  Low = 'Low',
  VeryLow = 'VeryLow'
}

export enum StoolConsistencyEnum {
  Solid = 'Solid',
  SemiSolid = 'SemiSolid',
  Soft = 'Soft',
  Loose = 'Loose',
  Watery = 'Watery',
  Bloody = 'Bloody',
  Mucousy = 'Mucousy'
}

export type WeightUnit = 'lbs' | 'kg' | 'oz' | 'g';

export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  performed_by: string;
  visit_date?: string;
  date?: string;
  next_due_date?: string;
  record_notes?: string;
  document_url?: string;
  vet_name?: string;
  created_at?: string;
  updated_at?: string;

  // Additional properties for medication records
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  prescribed_by?: string;
  pharmacy?: string;
  prescription_number?: string;
  refills_remaining?: number;
  
  // Additional properties for vaccination records
  vaccine_name?: string;
  vaccine_type?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Additional properties for examination records
  examination_type?: string;
  exam_type?: string;
  findings?: string;
  recommendations?: string;
  vet_clinic?: string;
  follow_up_date?: string;
  examiner?: string;
  facility?: string;
  
  // Additional properties for surgery records
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  date: string;
  weight: number;
  unit: WeightUnit;
  weight_unit: WeightUnit;
  notes?: string;
  created_at: string;
  percent_change?: number;
}
