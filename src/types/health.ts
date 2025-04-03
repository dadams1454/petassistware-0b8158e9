
import { WeightUnit } from './common';

// Medication status options
export type MedicationStatus = 'active' | 'completed' | 'paused' | 'discontinued' | 'scheduled';

// Medication frequency options
export type MedicationFrequency = 'once' | 'daily' | 'twice_daily' | 'three_times_daily' | 'weekly' | 'monthly' | 'as_needed';

// Medication administration route options
export type MedicationAdministrationRoute = 'oral' | 'topical' | 'injection' | 'inhaled' | 'rectal' | 'ophthalmic' | 'otic';

// Medication record
export interface Medication {
  id: string;
  dog_id: string;
  puppy_id?: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: MedicationFrequency;
  administration_route: MedicationAdministrationRoute;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  last_administered?: string;
}

// Medication log entry
export interface MedicationLog {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Medication administration record
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Result object for medication status UI
export interface MedicationStatusResult {
  status: MedicationStatus;
  statusLabel: string;
  statusColor: string;
  dueIn?: number;
  overdue?: boolean;
}

// Health certificate for puppies
export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  notes?: string;
  file_url?: string;
  created_at: string;
}

// Health record type
export interface HealthRecord {
  id: string;
  dog_id?: string;
  record_type?: string;
  title?: string;
  visit_date: string;
  vet_name?: string;
  vet_clinic?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  record_notes?: string;
  document_url?: string;
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
  
  // Vaccination specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Procedure specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
  // Examination specific fields
  examination_type?: string;
  
  // Common fields
  created_at?: string;
  description?: string;
  performed_by?: string;
}
