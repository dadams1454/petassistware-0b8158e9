
/**
 * Unified health record types for consistent health tracking
 */
import { HealthRecordType, AppetiteLevel, EnergyLevel, StoolConsistency } from './health-enums';
import { WeightUnit } from './weight-units';

// Base health record interface with common properties
export interface HealthRecordBase {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  record_type: HealthRecordType;
  title: string;
  date: string;
  created_at: string;
  updated_at?: string;
  description?: string; // Added for backward compatibility
  record_notes?: string;
  next_due_date?: string;
  performed_by?: string;
  vet_name?: string;
  document_url?: string;
  visit_date?: string; // Added for backward compatibility
}

// Extended health record types
export interface VaccinationRecord extends HealthRecordBase {
  record_type: HealthRecordType.VACCINATION;
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
}

export interface ExaminationRecord extends HealthRecordBase {
  record_type: HealthRecordType.EXAMINATION;
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
}

export interface MedicationRecord extends HealthRecordBase {
  record_type: HealthRecordType.MEDICATION;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  duration?: number;
  duration_unit?: string;
  start_date?: string;
  end_date?: string;
  administration_route?: string;
}

export interface HealthIndicator {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  date: string;
  appetite: AppetiteLevel;
  energy: EnergyLevel;
  stool_consistency: StoolConsistency;
  abnormal?: boolean;
  alert_generated?: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export interface WeightRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // Added for backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}

// Unified medication type
export interface Medication {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  name: string;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  created_at: string;
  status?: string;
  date?: string;
  administration_route?: string;
  last_administered?: string;
  is_active?: boolean;
}

// For health record options
export interface HealthRecordOptions {
  dogId?: string;
  puppyId?: string;
  recordType?: HealthRecordType;
  startDate?: string;
  endDate?: string;
  includeArchived?: boolean;
}

// For backward compatibility, re-export types as aliases
export type HealthRecord = HealthRecordBase;
