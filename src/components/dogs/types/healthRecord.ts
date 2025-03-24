
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: 'vaccination' | 'examination' | 'medication' | 'surgery' | 'observation' | 'other';
  title: string;
  description: string;
  visit_date: string; // ISO date format
  vet_name?: string;
  performed_by?: string;
  next_due_date?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  document_url?: string;
}

export interface VaccinationRecord extends HealthRecord {
  record_type: 'vaccination';
  vaccine_type: string;
  lot_number?: string;
  manufacturer?: string;
}

export interface MedicationRecord extends HealthRecord {
  record_type: 'medication';
  medication_name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
}
