export type WeightUnit = 'oz' | 'g' | 'lbs' | 'kg' | 'lb';

export interface WeightRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at?: string;
  birth_date?: string;
  age_days?: number;
  formatted_date?: string;
}

export interface WeightData {
  weights: WeightRecord[];
  isLoading: boolean;
  error: Error | null;
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
  Normal = 'normal',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard'
}

export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Test = 'test',
  Treatment = 'treatment',
  Other = 'other'
}

export interface HealthRecord {
  id: string;
  dog_id?: string;
  title?: string;
  record_type: HealthRecordTypeEnum;
  visit_date: string;
  vet_name: string;
  vet_clinic?: string;
  findings?: string;
  recommendations?: string;
  next_due_date?: string;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  prescription_number?: string;
  expiration_date?: string;
  follow_up_date?: string;
  document_url?: string;
  description?: string;
  record_notes?: string;
  examination_type?: string;
  created_at?: string;
  performed_by?: string;
  reminder_sent?: boolean;
}

// Other health-related interfaces can be added here
