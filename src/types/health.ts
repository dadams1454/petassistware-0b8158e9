
import { WeightUnit } from './common';

// Health record types
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Medication = 'medication',
  Examination = 'examination',
  Exam = 'exam',
  Surgery = 'surgery',
  Procedure = 'procedure',
  Dental = 'dental',
  Emergency = 'emergency',
  Test = 'test',
  Lab = 'lab',
  Xray = 'xray',
  Ultrasound = 'ultrasound',
  Parasite = 'parasite',
  Deworming = 'deworming',
  Allergy = 'allergy',
  Grooming = 'grooming',
  Observation = 'observation',
  Other = 'other'
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  date: string;
  visit_date: string;
  next_due_date?: string;
  expiration_date?: string;
  vet_name?: string;
  performed_by?: string;
  document_url?: string;
  notes?: string;
  record_notes?: string;
  created_at: string;
  
  // Medication-specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  
  // Surgery-specific fields
  anesthesia_used?: string;
  recovery_notes?: string;
  procedure_details?: string;
  
  // Vaccination-specific fields
  vaccine_name?: string;
  lot_number?: string;
  manufacturer?: string;
  vaccination_site?: string;
  
  // Test-specific fields
  test_name?: string;
  test_results?: string;
  lab_name?: string;
  
  // Internal tracking fields
  duration?: number;
  duration_unit?: string;
  is_recurring?: boolean;
  recurrence_interval?: number;
  recurrence_unit?: string;
}

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: AppetiteLevelEnum;
  energy: EnergyLevelEnum;
  stool_consistency: StoolConsistencyEnum;
  abnormal: boolean;
  notes: string;
  alert_generated: boolean;
  created_by: string;
  created_at: string;
}

// Health alert interface
export interface HealthAlert {
  id: string;
  dog_id: string;
  alert_type: string;
  description: string;
  date_generated: string;
  resolved: boolean;
  resolved_date?: string;
  resolved_by?: string;
  notes?: string;
  related_record_id?: string;
  created_at: string;
}

// Vaccination interface
export interface Vaccination {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  next_due_date?: string;
  administered_by?: string;
  notes?: string;
  lot_number?: string;
  manufacturer?: string;
  created_at: string;
}

// Appetite level enum
export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

// Energy level enum
export enum EnergyLevelEnum {
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic'
}

// Stool consistency enum
export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Diarrhea = 'diarrhea',
  Constipated = 'constipated'
}

// Medication status enum
export enum MedicationStatusEnum {
  Active = 'active',
  Upcoming = 'upcoming',
  Due = 'due',
  Overdue = 'overdue',
  AsNeeded = 'as_needed',
  Unknown = 'unknown'
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

// Medication status result
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  nextDue: Date | null;
}

// Vaccination schedule
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccine_name: string;
  vaccination_type: string;
  scheduled_date: string;
  administered: boolean;
  administration_date?: string;
  notes?: string;
  created_at: string;
}

// Growth stats
export interface GrowthStats {
  currentWeight: number;
  weightUnit: WeightUnit;
  percentChange: number;
  averageGrowth: number;
  growthRate: number;
  averageGrowthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
  weightGoal?: number;
  onTrack: boolean;
}

// Medication administration
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administration_date: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Health certificate
export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  issue_date: string;
  expiration_date: string;
  certificate_number: string;
  vet_name: string;
  vet_license: string;
  document_url?: string;
  notes?: string;
  created_at: string;
}

// Helper function to map form data to health record
export const mapToHealthRecord = (formData: any, dogId: string): Omit<HealthRecord, 'id' | 'created_at'> => {
  return {
    dog_id: dogId,
    record_type: formData.record_type,
    title: formData.title,
    description: formData.description || '',
    visit_date: formData.visit_date,
    date: formData.visit_date, // For compatibility
    next_due_date: formData.next_due_date || null,
    vet_name: formData.vet_name || '',
    performed_by: formData.performed_by || '',
    document_url: formData.document_url || '',
    notes: formData.notes || '',
    // Include other fields based on record type
    ...(formData.record_type === HealthRecordTypeEnum.Medication && {
      medication_name: formData.medication_name,
      dosage: formData.dosage,
      dosage_unit: formData.dosage_unit,
      frequency: formData.frequency,
      administration_route: formData.administration_route,
      start_date: formData.start_date,
      end_date: formData.end_date,
      expiration_date: formData.expiration_date
    }),
    ...(formData.record_type === HealthRecordTypeEnum.Vaccination && {
      vaccine_name: formData.vaccine_name,
      lot_number: formData.lot_number,
      manufacturer: formData.manufacturer,
      vaccination_site: formData.vaccination_site
    })
  };
};

// Helper function to map form data to weight record
export const mapToWeightRecord = (formData: any, dogId: string): Omit<WeightRecord, 'id' | 'created_at'> => {
  return {
    dog_id: dogId,
    weight: parseFloat(formData.weight),
    weight_unit: formData.weight_unit,
    date: formData.date,
    notes: formData.notes || '',
  };
};

// Helper function to convert string to health record type enum
export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  if (Object.values(HealthRecordTypeEnum).includes(type as HealthRecordTypeEnum)) {
    return type as HealthRecordTypeEnum;
  }
  return HealthRecordTypeEnum.Other;
};
