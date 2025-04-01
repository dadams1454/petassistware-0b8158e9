
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Other = 'other'
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
  duration?: number; // Added to fix HealthDetailView errors
  duration_unit?: string; // Added to fix HealthDetailView errors
  start_date?: string;
  end_date?: string;
  prescription_number?: string;
  
  // Vaccination fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  administration_route?: string; // Added to fix HealthDetailView errors
  
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
  vet_name?: string; // Make optional to fix useDogHealthRecords
  created_at?: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
  created_at: string;
  percent_change?: number;
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
