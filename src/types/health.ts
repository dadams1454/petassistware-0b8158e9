
import { MedicationStatusResult } from './medication-status';
import { AppetiteLevel, EnergyLevel, StoolConsistency } from './health-enums';
import { WeightUnit } from './weight-units';

/**
 * Health Record interfaces
 */

// Base Health Record
export interface HealthRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  record_type: string;
  timestamp?: string;
  date?: string;
  visit_date?: string;
  notes?: string;
  record_notes?: string;
  description?: string;
  vet_name?: string;
  title?: string;
  document_url?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  
  // For upcoming health records
  next_due_date?: string;
  
  // Vaccination-specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Medication-specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  
  // Examination-specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // Surgery-specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  name: string;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  status?: MedicationStatusResult;
  last_administered?: string;
  created_at?: string;
  is_active?: boolean;
  active?: boolean;
  nextDue?: string | Date | null;
  message?: string;
}

// Medication administration record
export interface MedicationAdministration {
  id?: string;
  medication_id: string;
  administered_date: string;
  administered_by: string;
  notes?: string;
  created_at?: string;
}

// Health indicator (vital signs) interface
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
  created_by?: string;
  created_at?: string;
}

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
}

// Export WeightUnit from here for compatibility
export { WeightUnit } from './weight-units';
// Export HealthRecordTypeEnum from health-enums
export { HealthRecordTypeEnum } from './health-enums';
