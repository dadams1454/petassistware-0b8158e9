
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

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  record_type: HealthRecordType;
  record_notes?: string;
  date: string;
  vet_name?: string;
  document_url?: string;
  created_at: string;
  updated_at?: string;
  next_due_date?: string;
  
  // For vaccinations
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // For medications
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  duration?: number;
  start_date?: string;
  end_date?: string;
  administration_route?: string;
  
  // For examinations
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // For surgeries/procedures
  surgeon?: string;
  anesthesia_used?: string;
  recovery_time?: string;
  
  // For display purposes
  title?: string;
  visit_date?: string;
  performed_by?: string;
}

// Medication interface
export interface Medication {
  id: string;
  name: string;
  dog_id?: string;
  puppy_id?: string;
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
  medication_name?: string;
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
  notes?: string;
  created_at: string;
}
