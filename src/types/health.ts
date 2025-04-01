
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Test = 'test',
  Other = 'other',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Dental = 'dental',
  Allergy = 'allergy'
}

export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

export enum EnergyLevelEnum {
  VeryHigh = 'very_high',
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  VeryLow = 'very_low'
}

export enum StoolConsistencyEnum {
  Solid = 'solid',
  SemiSolid = 'semi_solid',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Bloody = 'bloody',
  Mucousy = 'mucousy'
}

export enum WeightUnitEnum {
  Pounds = 'lbs',
  Kilograms = 'kg',
  Grams = 'g',
  Ounces = 'oz'
}

export interface HealthRecord {
  id: string;
  dog_id?: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  visit_date: string;
  date: string; // Adding this for compatibility with existing code
  next_due_date?: string;
  document_url?: string;
  vet_name?: string;
  performed_by?: string;
  // Vaccination specific fields
  vaccine_name?: string;
  vaccine_type?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  // Medication specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  administration_route?: string;
  frequency?: string;
  duration?: number;
  duration_unit?: string;
  start_date?: string;
  end_date?: string;
  prescription_number?: string;
  prescribed_by?: string;
  pharmacy?: string;
  refills_remaining?: number;
  // Examination specific fields
  examination_type?: string;
  exam_type?: string;
  findings?: string;
  recommendations?: string;
  vet_clinic?: string;
  follow_up_date?: string;
  examiner?: string;
  facility?: string;
  // Surgery specific fields
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
  weight_unit: string;
  unit: string; // Adding this for compatibility with existing code
  notes?: string;
  percent_change?: number;
}

export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: 'active' | 'resolved';
  created_at: string;
  resolved_at?: string;
  resolved: boolean;
}

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  temperature?: number;
  heart_rate?: number;
  respiration_rate?: number;
  appetite?: AppetiteLevelEnum | null;
  energy_level?: EnergyLevelEnum | null;
  stool_consistency?: StoolConsistencyEnum | null;
  hydration?: string;
  gum_color?: string;
  mucous_membrane?: string;
  notes?: string;
  abnormal: boolean;
  created_by?: string;
  created_at?: string;
}

export interface HealthIndicatorFormValues {
  dog_id: string;
  date: string;
  temperature?: number | null;
  heart_rate?: number | null;
  respiration_rate?: number | null;
  appetite?: AppetiteLevelEnum | null;
  energy_level?: EnergyLevelEnum | null;
  stool_consistency?: StoolConsistencyEnum | null;
  hydration?: string | null;
  gum_color?: string | null;
  mucous_membrane?: string | null;
  notes?: string | null;
}

// Helper function to adapt health record data
export const adaptHealthRecord = (record: any): HealthRecord => {
  return {
    ...record,
    date: record.visit_date || record.date || new Date().toISOString(),
    record_type: record.record_type || HealthRecordTypeEnum.Other
  };
};

// Helper function to adapt weight record data
export const adaptWeightRecord = (record: any): WeightRecord => {
  return {
    ...record,
    unit: record.weight_unit || 'lbs'
  };
};
