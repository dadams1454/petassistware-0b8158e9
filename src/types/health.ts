
import { WeightUnit } from './common';

// Health Record Type Enum
export enum HealthRecordTypeEnum {
  VACCINATION = 'vaccination',
  MEDICATION = 'medication',
  EXAMINATION = 'examination',
  SURGERY = 'surgery',
  DENTAL = 'dental',
  WELLNESS = 'wellness',
  DIAGNOSTIC = 'diagnostic',
  INJURY = 'injury',
  EMERGENCY = 'emergency',
  OTHER = 'other'
}

// Helper function to convert string to enum
export function stringToHealthRecordType(type: string): HealthRecordTypeEnum {
  return type as HealthRecordTypeEnum;
}

// Basic Health Record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  date?: string; // For compatibility with older code
  visit_date: string;
  vet_name: string;
  performed_by?: string;
  record_notes?: string;
  description?: string;
  next_due_date?: string | null;
  document_url?: string;
  created_at: string;
  
  // Vaccination specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Medication specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  prescription_number?: string;
  
  // Examination specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string | null;
  vet_clinic?: string;
  
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Health Certificate for puppies or dogs
export interface HealthCertificate {
  id: string;
  dog_id: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Medication for tracking ongoing treatments
export interface Medication {
  id: string;
  dog_id: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  last_administered?: string;
}

// Medication administration records
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at?: string;
}

// Health indicator (daily health checks)
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: string;
  energy?: string;
  stool_consistency?: string;
  abnormal?: boolean;
  alert_generated?: boolean;
  notes?: string;
  created_by?: string;
  created_at: string;
}

// Health Alert for dashboard display
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: string;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Genetic health marker
export interface HealthMarker {
  id: string;
  name: string;
  status: string;
  risk_level: string;
  description?: string;
}

// Field definitions for HealthRecordForm
export interface RecordTypeFieldProps {
  onTypeChange: (value: string) => void;
  disabled?: boolean;
}

export interface TitleFieldProps {
  form: any;
}

export interface VisitDateFieldProps {
  form: any;
}

export interface VetNameFieldProps {
  form: any;
}

export interface NotesFieldProps {
  form: any;
}

export interface NextDueDateFieldProps {
  form: any;
}

export interface DocumentUrlFieldProps {
  form: any;
}

export interface DialogFooterButtonsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export interface HealthRecordFormProps {
  onSubmit: (data: Partial<HealthRecord>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<HealthRecord>;
  dogId?: string;
}
