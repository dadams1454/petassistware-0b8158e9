
/**
 * Health-related type definitions
 */

import { 
  HealthRecordType,
  AppetiteLevel,
  EnergyLevel,
  StoolConsistency,
  MedicationStatusResult
} from './health-enums';
import { WeightUnit } from './weight-units';

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  record_type: HealthRecordType;
  title?: string;
  date: string;
  visit_date?: string;
  record_notes?: string;
  document_url?: string;
  created_at: string;
  updated_at?: string;
  next_due_date?: string;
  performed_by?: string;
  vet_name?: string;
  
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
  start_date?: string;
  end_date?: string;
  notes?: string;
  created_at: string;
  record_id?: string;
  status?: string;
  date?: string;
  
  // Extended properties for medication tracking
  administration_route?: string;
  last_administered?: string;
  is_active?: boolean;
}

// Medication administration record
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_date: string;
  administered_by: string;
  notes?: string;
  created_at: string;
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
  created_at: string;
  created_by?: string;
  
  // For compatibility with existing code
  name?: string;
  value?: string;
}

// Health certificate type
export interface HealthCertificate {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  issue_date: string;
  expiry_date?: string;
  certificate_type: string;
  issuer: string;
  certificate_number?: string;
  document_url?: string;
  file_url?: string; // For backward compatibility
  notes?: string;
  created_at: string;
}

// Health alert interface
export interface HealthAlert {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  resolved: boolean;
  created_at: string;
  resolved_at?: string;
  record_id?: string;
}

// Re-export WeightRecord here for backwards compatibility
export { WeightUnit };
export type WeightRecord = {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
};
