
import { WeightUnit } from '@/types/common';

// Medication Status
export type MedicationStatus = 'active' | 'completed' | 'pending' | 'discontinued' | 'inactive';

// Medication Status Result
export interface MedicationStatusResult {
  status: MedicationStatus;
  statusColor: string;
  statusLabel: string;
}

// Define enums for health indicators
export enum AppetiteEnum {
  Poor = 'poor',
  Normal = 'normal',
  Excellent = 'excellent',
  Unknown = 'unknown'
}

export enum EnergyLevelEnum {
  Low = 'low',
  Normal = 'normal',
  High = 'high',
  Unknown = 'unknown'
}

export enum StoolConsistencyEnum {
  Loose = 'loose',
  Normal = 'normal',
  Hard = 'hard',
  Unknown = 'unknown'
}

// HealthRecord interface
export interface HealthRecord {
  id: string;
  dog_id?: string;
  record_type: string;
  title?: string;
  date?: string;
  visit_date?: string;
  description?: string;
  vet_name?: string;
  performed_by?: string;
  document_url?: string;
  notes?: string;
  // Medical Examination fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  // Vaccination fields
  vaccine_name?: string;
  lot_number?: string;
  expiration_date?: string;
  next_due_date?: string;
  // Procedure fields
  procedure_name?: string;
  anesthesia_used?: string;
  surgeon?: string;
  recovery_notes?: string;
  // Medication fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  duration?: number;
  duration_unit?: string;
  start_date?: string;
  end_date?: string;
  prescription_number?: string;
  manufacturer?: string;
  reminder_sent?: boolean;
  // General
  vet_clinic?: string;
  created_at?: string;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  administration_route?: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  active: boolean;
  created_at?: string;
}

// Medication Administration Record
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at?: string;
}

// Vaccination Schedule
export interface VaccinationSchedule {
  id: string;
  dog_id: string;
  puppy_id?: string;
  vaccination_type: string;
  scheduled_date: string;
  due_date: string;
  administered: boolean;
  vaccine_name?: string;
  notes?: string;
  created_at?: string;
}

// Weight Record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at?: string;
  age_days?: number;
  birth_date?: string;
}

// Health Indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: AppetiteEnum;
  energy: EnergyLevelEnum;
  stool_consistency: StoolConsistencyEnum;
  abnormal: boolean;
  notes?: string;
  alert_generated: boolean;
  created_by?: string;
  created_at: string;
}

// Health Alert interface
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: string;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Health Certificate interface
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

// Growth Statistics
export interface GrowthStats {
  currentWeight: number;
  weightUnit: WeightUnit;
  percentChange: number;
  averageGrowth: number;
  growthRate: number;
  averageGrowthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
  weightGoal: number;
  onTrack: boolean;
}

// Utility functions
export const stringToHealthRecordType = (type: string): string => {
  const recordTypeMap: Record<string, string> = {
    'exam': 'examination',
    'examination': 'examination',
    'vaccine': 'vaccination',
    'vaccination': 'vaccination',
    'procedure': 'procedure',
    'surgery': 'procedure',
    'med': 'medication',
    'medication': 'medication',
    'prescription': 'medication',
    'test': 'lab_test',
    'lab': 'lab_test',
    'lab_test': 'lab_test',
    'parasite': 'parasite_prevention',
    'prevention': 'parasite_prevention',
    'parasite_prevention': 'parasite_prevention',
    'note': 'note',
    'other': 'other'
  };
  
  const normalizedType = type.toLowerCase();
  return recordTypeMap[normalizedType] || 'other';
};

// Mapping functions for database records
export const mapToHealthRecord = (formData: Partial<HealthRecord>): Partial<HealthRecord> => {
  // Map form data to database record
  return {
    ...formData,
    // Convert any dates to ISO string if needed
    date: formData.date ? new Date(formData.date).toISOString().split('T')[0] : undefined,
    visit_date: formData.visit_date ? new Date(formData.visit_date).toISOString().split('T')[0] : undefined,
    follow_up_date: formData.follow_up_date ? new Date(formData.follow_up_date).toISOString().split('T')[0] : undefined,
    start_date: formData.start_date ? new Date(formData.start_date).toISOString().split('T')[0] : undefined,
    end_date: formData.end_date ? new Date(formData.end_date).toISOString().split('T')[0] : undefined,
    expiration_date: formData.expiration_date ? new Date(formData.expiration_date).toISOString().split('T')[0] : undefined,
    next_due_date: formData.next_due_date ? new Date(formData.next_due_date).toISOString().split('T')[0] : undefined,
  };
};

export const mapToWeightRecord = (formData: Partial<WeightRecord>): Partial<WeightRecord> => {
  return {
    ...formData,
    date: formData.date ? new Date(formData.date).toISOString().split('T')[0] : undefined,
  };
};
