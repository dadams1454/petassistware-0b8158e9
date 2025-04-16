
/**
 * Core health record type definitions
 * Unified type system for health records across dogs and puppies
 */
import { BaseEntity } from './index';
import { AppetiteLevel, EnergyLevel, StoolConsistency } from '../health-enums';
import { WeightUnit } from '../weight-units';

// Base health record that all specific record types extend
export interface HealthRecordBase extends BaseEntity {
  dog_id?: string;
  puppy_id?: string;
  record_type: string;
  title: string;
  date: string;
  record_notes?: string;
  document_url?: string;
  next_due_date?: string;
  performed_by?: string;
  vet_name?: string;
}

// Specific health record types
export interface VaccinationRecord extends HealthRecordBase {
  record_type: 'vaccination';
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  administered?: boolean;
  administered_date?: string;
}

export interface ExaminationRecord extends HealthRecordBase {
  record_type: 'examination';
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
}

export interface MedicationRecord extends HealthRecordBase {
  record_type: 'medication';
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

export interface SurgeryRecord extends HealthRecordBase {
  record_type: 'surgery';
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Medication interface for tracking administered medications
export interface Medication extends BaseEntity {
  dog_id?: string;
  puppy_id?: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  status?: string;
  administration_route?: string;
  last_administered?: string;
  is_active?: boolean;
}

// Medication administration record
export interface MedicationAdministration extends BaseEntity {
  medication_id: string;
  administered_date: string;
  administered_by: string;
  notes?: string;
}

// Health indicator (vital signs) interface
export interface HealthIndicator extends BaseEntity {
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
}

// Health certificate type
export interface HealthCertificate extends BaseEntity {
  dog_id?: string;
  puppy_id?: string;
  issue_date: string;
  expiry_date?: string;
  certificate_type: string;
  issuer: string;
  certificate_number?: string;
  document_url?: string;
  notes?: string;
}

// Representing a generic health record for backward compatibility
export type HealthRecord = HealthRecordBase | VaccinationRecord | ExaminationRecord | MedicationRecord | SurgeryRecord;
