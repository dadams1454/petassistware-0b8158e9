
export interface HealthRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  visit_date: string;
  date?: string; // Added for backward compatibility
  next_due_date?: string;
  vet_name?: string;
  performed_by?: string;
  document_url?: string;
  notes?: string;
  created_at?: string;
  // Medication specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  duration?: number;
  duration_unit?: string;
  start_date?: string;
  end_date?: string;
  // Vaccination specific fields
  vaccine_name?: string;
  lot_number?: string;
  manufacturer?: string;
  administration_route?: string;
  // Examination specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

export enum HealthRecordTypeEnum {
  VACCINATION = 'vaccination',
  EXAMINATION = 'examination',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  TEST = 'test',
  OTHER = 'other'
}

export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

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
}

export interface HealthMarker {
  status: 'clear' | 'carrier' | 'at_risk';
  description: string;
}

export interface HealthProfile {
  markers: Record<string, HealthMarker>;
  vaccinations: VaccinationRecord[];
  weights: WeightRecord[];
  conditions: HealthCondition[];
}

export interface VaccinationRecord {
  id: string;
  name: string;
  date: string;
  next_due?: string;
  notes?: string;
}

export interface HealthCondition {
  id: string;
  name: string;
  diagnosed_date: string;
  status: 'active' | 'managed' | 'resolved';
  notes?: string;
}

// Add missing enums referenced in the codebase
export enum AppetiteLevelEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NONE = 'none'
}

export enum EnergyLevelEnum {
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
  LETHARGIC = 'lethargic'
}

export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  SOFT = 'soft',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard',
  NONE = 'none'
}

export interface WeightData {
  id: string;
  weight: number;
  unit: WeightUnit;
  date: string;
  age_days?: number;
  birth_date?: string;
}
