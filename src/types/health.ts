
import { WeightUnit } from './common';

// Health record type enum for strong typing
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Test = 'test',
  Grooming = 'grooming',
  EmergencyCare = 'emergency_care',
  Therapy = 'therapy',
  Deworming = 'deworming'
}

// Medication frequency enum for consistent timing
export enum MedicationFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Annual = 'annual',
  AsNeeded = 'as_needed'
}

// Health record interface for examinations, vaccinations, etc.
export interface HealthRecord {
  id: string;
  dog_id: string;
  title: string;
  record_type: HealthRecordTypeEnum | string;
  visit_date: string;
  record_notes?: string;
  vet_name: string;
  document_url?: string;
  next_due_date?: string;
  created_at: string;
  
  // Specific fields for different record types
  // For medications
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  frequency?: string;
  duration?: number;
  duration_unit?: string;
  prescription_number?: string;
  
  // For vaccinations
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  performed_by?: string;
  
  // For surgeries
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
  // For lab tests and examinations
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  vet_clinic?: string;
  
  // For reminders
  reminder_sent?: boolean;
}

// Health certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  certificate_type: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Medication tracking interface
export interface Medication {
  id: string;
  dog_id: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  administration_route: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  last_administered?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
}

// The WeightUnit is imported from common.ts

// Vaccination schedule interface
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccine_name: string;
  vaccination_type: string;
  due_date: string;
  administered: boolean;
  notes?: string;
  created_at: string;
  scheduled_date?: string;
}

// Milestone interface 
export interface Milestone {
  id: string;
  puppy_id: string;
  title: string;
  milestone_type: string;
  expected_age_days: number;
  is_completed: boolean;
  completion_date?: string;
  description?: string;
  notes?: string;
  created_at?: string;
}

// Health marker for genetic insights
export interface HealthMarker {
  gene: string;
  status: 'carrier' | 'at_risk' | 'clear';
  description: string;
  impact: 'high' | 'medium' | 'low';
}

// Medication info for display components
export interface MedicationInfo {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  lastAdministered?: string;
  frequency: string;
  status: 'active' | 'completed' | 'upcoming' | 'overdue';
}
