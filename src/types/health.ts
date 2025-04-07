
import { WeightUnit } from './weight-units';
import { MedicationStatusEnum } from './health-enums';
import { WeightRecord } from './weight';

export interface HealthRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  record_type: string;
  visit_date: string;
  vet_name: string;
  vet_clinic?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  record_notes?: string;
  title?: string;
  document_url?: string;
  vaccine_name?: string;
  lot_number?: string;
  manufacturer?: string;
  expiration_date?: string;
  next_due_date?: string;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  prescription_number?: string;
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  duration?: number;
  duration_unit?: string;
  recovery_notes?: string;
  examination_type?: string;
  created_at: string;
  reminder_sent?: boolean;
  
  // Backward compatibility fields
  description?: string;
  date?: string;
  performed_by?: string;
}

export interface MedicationStatusResult {
  status: MedicationStatusEnum | string;
  message: string;
  daysUntilDue?: number;
  daysOverdue?: number;
  nextDue?: Date | string | null;
}

export interface Medication {
  id: string;
  dog_id: string;
  medication_name: string;
  name?: string; // For backward compatibility
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  is_active: boolean;
  active?: boolean; // For backward compatibility
  created_at: string;
  last_administered?: string;
}

export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: string;
  energy?: string;
  stool_consistency?: string;
  abnormal?: boolean;
  notes?: string;
  alert_generated?: boolean;
  created_by?: string;
  created_at: string;
}

// Re-export WeightRecord for backward compatibility
export type { WeightRecord, WeightUnit };
