
// Weight unit definitions
export type WeightUnit = 'kg' | 'lb' | 'g' | 'oz';
export type WeightUnitWithLegacy = WeightUnit | 'lbs';

// Medication status types
export type MedicationStatus = 'active' | 'pending' | 'completed' | 'expired' | 'discontinued' | 'upcoming' | 'due' | 'overdue' | 'unknown';

export interface MedicationStatusResult {
  status: MedicationStatus;
  statusColor: string;
  statusLabel?: string;
  daysOverdue?: number;
  dueDate?: string;
}

// Medication frequencies
export enum MedicationFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  TWICE_DAILY = 'twice_daily',
  THREE_TIMES_DAILY = 'three_times_daily',
  EVERY_OTHER_DAY = 'every_other_day',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  AS_NEEDED = 'as_needed',
  CUSTOM = 'custom'
}

// Health record types
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Laboratory = 'laboratory',
  Imaging = 'imaging',
  Dental = 'dental',
  Allergy = 'allergy',
  Preventive = 'preventive',
  Emergency = 'emergency'
}

// Health indicator enums
export enum AppetiteEnum {
  Normal = 'normal',
  Increased = 'increased',
  Decreased = 'decreased',
  None = 'none'
}

export enum EnergyLevelEnum {
  Normal = 'normal',
  Hyperactive = 'hyperactive',
  Decreased = 'decreased',
  Lethargic = 'lethargic'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Firm = 'firm',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Mucousy = 'mucousy',
  Bloody = 'bloody'
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title?: string;
  visit_date: string;
  vet_name: string;
  description?: string;
  document_url?: string;
  record_notes?: string;
  created_at: string;
  
  // Examination specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // Vaccination specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  next_due_date?: string;
  
  // Medication specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: string;
  unit?: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  puppy_id?: string;
  age_days?: number;
  birth_date?: string;
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteEnum;
  energy?: EnergyLevelEnum;
  stool_consistency?: StoolConsistencyEnum;
  abnormal: boolean;
  notes?: string;
  alert_generated?: boolean;
  created_by?: string;
  created_at: string;
}

// Health certificates interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  notes?: string;
  file_url?: string;
  created_at: string;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  administration_route?: string;
  start_date: string;
  end_date?: string;
  active: boolean;
  notes?: string;
  medication_name?: string;
  last_administered?: string;
  is_active?: boolean;
  created_at: string;
}
