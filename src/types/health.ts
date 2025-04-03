
// Health record types
export enum HealthRecordTypeEnum {
  VACCINATION = 'vaccination',
  EXAMINATION = 'examination',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  OBSERVATION = 'observation',
  DEWORMING = 'deworming',
  GROOMING = 'grooming',
  DENTAL = 'dental',
  ALLERGY = 'allergy',
  TEST = 'test',
  OTHER = 'other'
}

export enum AppetiteLevelEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

export enum EnergyLevelEnum {
  HYPERACTIVE = 'hyperactive',
  VERY_HIGH = 'very_high',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  VERY_LOW = 'very_low',
  LETHARGIC = 'lethargic'
}

export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  SOLID = 'solid',
  SEMI_SOLID = 'semi_solid',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  BLOODY = 'bloody',
  MUCOUSY = 'mucousy',
  HARD = 'hard'
}

export type WeightUnit = 'oz' | 'g' | 'lbs' | 'kg' | 'lb';

export interface HealthRecord {
  id: string;
  dog_id?: string;
  record_type: HealthRecordTypeEnum;
  title?: string;
  visit_date: string;
  vet_name: string;
  vet_clinic?: string;
  description?: string;
  findings?: string;
  recommendations?: string;
  document_url?: string;
  follow_up_date?: string;
  reminder_sent?: boolean;
  record_notes?: string;
  recovery_notes?: string;
  performed_by?: string;
  // Vaccination specific
  vaccine_name?: string;
  lot_number?: string;
  manufacturer?: string;
  expiration_date?: string;
  // Medication specific
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  prescription_number?: string;
  next_due_date?: string;
  // Examination specific
  examination_type?: string;
  // Surgery specific
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  created_at?: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  date: string;
  weight: number;
  weight_unit: WeightUnit;
  notes?: string;
  created_at: string;
  percent_change?: number;
  age_days?: number;
  birth_date?: string;
}

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteLevelEnum;
  energy?: EnergyLevelEnum;
  stool_consistency?: StoolConsistencyEnum;
  abnormal?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  alert_generated?: boolean;
}

export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: 'active' | 'resolved';
  resolved?: boolean;
  resolved_at?: string;
  created_at: string;
}
