
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Other = 'other',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Dental = 'dental',
  Allergy = 'allergy',
  Test = 'test'
}

export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  performed_by?: string;
  date?: string;
  visit_date: string; // Required for db insert
  next_due_date?: string;
  document_url?: string;
  
  // Medication fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  duration?: number;
  duration_unit?: string;
  start_date?: string;
  end_date?: string;
  prescription_number?: string;
  expiration_date?: string; // Added for MedicationTracker component
  
  // Vaccination fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  administration_route?: string;
  
  // Examination fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // Surgery fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
  // For database
  vet_name?: string;
  created_at?: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: string;
  unit?: string; // Alias for compatibility with existing components
  date: string;
  notes?: string;
  created_at: string;
  percent_change?: number;
  birth_date?: string; // For puppy weight tracking
}

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  energy?: string;
  appetite?: string;
  stool_consistency?: string;
  abnormal: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Add missing enums for health indicators
export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

export enum EnergyLevelEnum {
  Hyperactive = 'hyperactive',
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic',
  VeryHigh = 'very_high',
  VeryLow = 'very_low'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard',
  Mucousy = 'mucousy',
  Bloody = 'bloody',
  Solid = 'solid',
  SemiSolid = 'semi_solid'
}

// Add weight unit enum
export enum WeightUnitEnum {
  Pounds = 'lbs',
  Kilograms = 'kg',
  Grams = 'g',
  Ounces = 'oz'
}

// For backwards compatibility
export type WeightUnit = string;
