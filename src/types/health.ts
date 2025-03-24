
// Health record types for the dog health management system
export enum HealthRecordType {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Other = 'other'
}

// Base health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  date: string;
  record_type: HealthRecordType;
  title: string;
  description?: string;
  performed_by?: string;
  next_due_date?: string;
  attachments?: string[];
  created_at: string;
  updated_at?: string;
  
  // Extended fields for specific record types
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  administration_route?: string;
  expiration_date?: string;
  reminder_sent?: boolean;
  
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  duration?: number;
  duration_unit?: string;
  start_date?: string;
  end_date?: string;
  prescription_number?: string;
  
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  vet_name?: string;
  vet_clinic?: string;
  
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  follow_up_date?: string;
}

export interface VaccinationRecord extends HealthRecord {
  record_type: HealthRecordType.Vaccination;
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  administration_route?: 'oral' | 'subcutaneous' | 'intramuscular' | 'intranasal' | 'other';
  expiration_date?: string;
  reminder_sent?: boolean;
}

export interface MedicationRecord extends HealthRecord {
  record_type: HealthRecordType.Medication;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  duration?: number;
  duration_unit?: 'days' | 'weeks' | 'months';
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  prescription_number?: string;
}

export interface ExaminationRecord extends HealthRecord {
  record_type: HealthRecordType.Examination;
  examination_type?: 'routine' | 'sick' | 'pre-breeding' | 'specialized' | 'follow-up';
  findings?: string;
  recommendations?: string;
  vet_name?: string;
  vet_clinic?: string;
}

export interface SurgeryRecord extends HealthRecord {
  record_type: HealthRecordType.Surgery;
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  follow_up_date?: string;
}

// Health Status tracking
export interface HealthStatus {
  dog_id: string;
  last_vaccination_date?: string;
  next_vaccination_due?: string;
  last_examination_date?: string;
  next_examination_due?: string;
  current_medications?: MedicationRecord[];
  health_alerts?: HealthAlert[];
  vaccination_status: 'current' | 'due_soon' | 'overdue' | 'incomplete';
}

export interface HealthAlert {
  id: string;
  dog_id: string;
  alert_type: 'vaccination_due' | 'medication_reminder' | 'examination_due' | 'abnormal_finding';
  title: string;
  description: string;
  due_date?: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  resolved_date?: string;
  created_at: string;
}

// Weight tracking
export interface WeightRecord {
  id: string;
  dog_id: string;
  date: string;
  weight: number;
  weight_unit: 'lbs' | 'kg' | 'g' | 'oz';
  notes?: string;
  created_at: string;
}
