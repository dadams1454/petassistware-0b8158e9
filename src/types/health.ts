
import { HealthRecordTypeEnum } from './health-enums';

// Basic health record
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: string;
  visit_date?: string;
  date?: string; // For backward compatibility
  title?: string;
  description?: string;
  document_url?: string;
  record_notes?: string;
  created_at: string;
  next_due_date?: string;
  performed_by?: string; // Add this property
  vet_name?: string;
}

// Type guard to check if a health record is a vaccination
export function isVaccination(record: HealthRecord): boolean {
  return record.record_type === HealthRecordTypeEnum.VACCINATION;
}

// Add more type guards as needed
export function isExamination(record: HealthRecord): boolean {
  return record.record_type === HealthRecordTypeEnum.EXAMINATION;
}

export function isMedication(record: HealthRecord): boolean {
  return record.record_type === HealthRecordTypeEnum.MEDICATION;
}

// Vaccination record for viewing/editing
export interface Vaccination extends HealthRecord {
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  next_due_date?: string;
}

// Health indicator for tracking specific measurements
export interface HealthIndicator {
  id: string;
  dog_id: string;
  indicator_type: string;
  value: number;
  unit?: string;
  timestamp: string;
  normal_range_min?: number;
  normal_range_max?: number;
  is_abnormal?: boolean;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// Health alert notification
export interface HealthAlert {
  id: string;
  dog_id: string;
  alert_type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  is_resolved: boolean;
  created_at: string;
  resolved_at?: string;
}

// Temporary backward compatibility
export { HealthRecordTypeEnum };
