
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

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at: string;
}

// Enums for health indicators
export enum AppetiteLevelEnum {
  Poor = 'poor',
  Fair = 'fair',
  Good = 'good',
  Excellent = 'excellent'
}

export enum EnergyLevelEnum {
  Low = 'low',
  Normal = 'normal',
  High = 'high'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Loose = 'loose',
  Hard = 'hard',
  Diarrhea = 'diarrhea'
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteLevelEnum;
  energy?: EnergyLevelEnum;
  stool_consistency?: StoolConsistencyEnum;
  abnormal: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  alert_generated?: boolean;
}

// Weight data for charts
export interface WeightData {
  date: string;
  weight: number;
  unit: WeightUnit;
}

// Utility functions
export const healthRecordTypeToString = (type: HealthRecordTypeEnum): string => {
  switch (type) {
    case HealthRecordTypeEnum.Examination:
      return 'Examination';
    case HealthRecordTypeEnum.Vaccination:
      return 'Vaccination';
    case HealthRecordTypeEnum.Medication:
      return 'Medication';
    case HealthRecordTypeEnum.Surgery:
      return 'Surgery';
    case HealthRecordTypeEnum.Test:
      return 'Test';
    case HealthRecordTypeEnum.Grooming:
      return 'Grooming';
    case HealthRecordTypeEnum.EmergencyCare:
      return 'Emergency Care';
    case HealthRecordTypeEnum.Therapy:
      return 'Therapy';
    case HealthRecordTypeEnum.Deworming:
      return 'Deworming';
    default:
      return 'Unknown';
  }
};

export const stringToHealthRecordType = (typeStr: string): HealthRecordTypeEnum => {
  const normalizedType = typeStr.toLowerCase().trim();
  
  switch (normalizedType) {
    case 'examination':
      return HealthRecordTypeEnum.Examination;
    case 'vaccination':
      return HealthRecordTypeEnum.Vaccination;
    case 'medication':
      return HealthRecordTypeEnum.Medication;
    case 'surgery':
      return HealthRecordTypeEnum.Surgery;
    case 'test':
      return HealthRecordTypeEnum.Test;
    case 'grooming':
      return HealthRecordTypeEnum.Grooming;
    case 'emergency_care':
    case 'emergency care':
      return HealthRecordTypeEnum.EmergencyCare;
    case 'therapy':
      return HealthRecordTypeEnum.Therapy;
    case 'deworming':
      return HealthRecordTypeEnum.Deworming;
    default:
      return HealthRecordTypeEnum.Examination; // Default fallback
  }
};

// Mapper functions
export const mapToHealthRecord = (data: any): HealthRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    title: data.title || '',
    record_type: data.record_type || HealthRecordTypeEnum.Examination,
    visit_date: data.visit_date,
    record_notes: data.record_notes,
    vet_name: data.vet_name || 'Unknown',
    document_url: data.document_url,
    next_due_date: data.next_due_date,
    created_at: data.created_at,
    
    // Medication fields
    medication_name: data.medication_name,
    dosage: data.dosage,
    dosage_unit: data.dosage_unit,
    administration_route: data.administration_route,
    start_date: data.start_date,
    end_date: data.end_date,
    frequency: data.frequency,
    duration: data.duration,
    duration_unit: data.duration_unit,
    prescription_number: data.prescription_number,
    
    // Vaccination fields
    vaccine_name: data.vaccine_name,
    manufacturer: data.manufacturer,
    lot_number: data.lot_number,
    expiration_date: data.expiration_date,
    performed_by: data.performed_by,
    
    // Surgery fields
    procedure_name: data.procedure_name,
    surgeon: data.surgeon,
    anesthesia_used: data.anesthesia_used,
    recovery_notes: data.recovery_notes,
    
    // Examination fields
    examination_type: data.examination_type,
    findings: data.findings,
    recommendations: data.recommendations,
    follow_up_date: data.follow_up_date,
    vet_clinic: data.vet_clinic,
    
    // Reminder field
    reminder_sent: data.reminder_sent
  };
};

export const mapToWeightRecord = (data: any): WeightRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    weight: Number(data.weight),
    weight_unit: data.weight_unit,
    date: data.date,
    notes: data.notes,
    created_at: data.created_at
  };
};

// Export medication administration record
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}
