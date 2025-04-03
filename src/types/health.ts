
import { WeightUnit } from './common';

// Health record type enum
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Laboratory = 'laboratory',
  Imaging = 'imaging',
  Dental = 'dental',
  Allergy = 'allergy',
  Emergency = 'emergency',
  Preventive = 'preventive',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Test = 'test',
  Other = 'other'
}

// Health appetites enum
export enum AppetiteEnum {
  Poor = 'poor',
  Decreased = 'decreased',
  Normal = 'normal',
  Increased = 'increased',
  Voracious = 'voracious'
}

// Energy levels enum
export enum EnergyLevelEnum {
  Lethargic = 'lethargic',
  Low = 'low',
  Normal = 'normal',
  High = 'high',
  Hyperactive = 'hyperactive'
}

// Stool consistency enum
export enum StoolConsistencyEnum {
  Liquid = 'liquid',
  Soft = 'soft',
  Normal = 'normal',
  Hard = 'hard',
  None = 'none'
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: AppetiteEnum;
  energy: EnergyLevelEnum;
  stool_consistency: StoolConsistencyEnum;
  abnormal: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
  alert_generated?: boolean;
}

// Health alert interface
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: 'active' | 'resolved';
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Growth statistics interface
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

// Medication status
export type MedicationStatus = 'active' | 'completed' | 'pending' | 'discontinued' | 'inactive' | 'incomplete';

// Medication status result
export interface MedicationStatusResult {
  status: MedicationStatus;
  statusColor: string;
  statusLabel: string;
}

// Vaccination schedule interface
export interface VaccinationSchedule {
  id?: string;
  puppy_id: string;
  vaccination_type: string;
  scheduled_date: string;
  due_date: string;
  administered: boolean;
  vaccine_name?: string;
  notes?: string;
  created_at?: string;
}

// Medication interface
export interface Medication {
  id: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  administration_route?: string;
  start_date: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  dog_id: string;
  active: boolean;
  notes?: string;
  created_at: string;
}

// MedicationAdministration interface
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Health certificate interface
export interface HealthCertificate {
  id: string;
  puppy_id: string;
  certificate_type: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum | string;
  title: string;
  visit_date: string;
  description?: string;
  vet_name: string;
  performed_by?: string;
  document_url?: string;
  notes?: string;
  record_notes?: string;
  follow_up_date?: string;
  next_due_date?: string;
  created_at?: string;
  // Vaccination-specific fields
  vaccination_type?: string;
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  // Medication-specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  // Exam-specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  // Surgery-specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  // Prescription fields
  prescription_number?: string;
}

// Helper functions
export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  switch (type) {
    case 'examination':
      return HealthRecordTypeEnum.Examination;
    case 'vaccination':
      return HealthRecordTypeEnum.Vaccination;
    case 'medication':
      return HealthRecordTypeEnum.Medication;
    case 'surgery':
      return HealthRecordTypeEnum.Surgery;
    case 'laboratory':
      return HealthRecordTypeEnum.Laboratory;
    case 'imaging':
      return HealthRecordTypeEnum.Imaging;
    case 'dental':
      return HealthRecordTypeEnum.Dental;
    case 'allergy':
      return HealthRecordTypeEnum.Allergy;
    case 'emergency':
      return HealthRecordTypeEnum.Emergency;
    case 'preventive':
      return HealthRecordTypeEnum.Preventive;
    case 'observation':
      return HealthRecordTypeEnum.Observation;
    case 'deworming':
      return HealthRecordTypeEnum.Deworming;
    case 'grooming':
      return HealthRecordTypeEnum.Grooming;
    case 'test':
      return HealthRecordTypeEnum.Test;
    case 'other':
      return HealthRecordTypeEnum.Other;
    default:
      return HealthRecordTypeEnum.Other;
  }
};

// Mapping functions for health records
export const mapToHealthRecord = (data: any): HealthRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    record_type: stringToHealthRecordType(data.record_type),
    title: data.title || '',
    visit_date: data.visit_date || data.date || '',
    description: data.description || '',
    vet_name: data.vet_name || '',
    performed_by: data.performed_by || '',
    document_url: data.document_url || '',
    notes: data.notes || data.record_notes || '',
    record_notes: data.record_notes || data.notes || '',
    follow_up_date: data.follow_up_date || null,
    next_due_date: data.next_due_date || null,
    created_at: data.created_at || '',
    // Vaccination fields
    vaccination_type: data.vaccination_type || '',
    vaccine_name: data.vaccine_name || '',
    manufacturer: data.manufacturer || '',
    lot_number: data.lot_number || '',
    expiration_date: data.expiration_date || null,
    // Medication fields
    medication_name: data.medication_name || '',
    dosage: data.dosage || null,
    dosage_unit: data.dosage_unit || '',
    frequency: data.frequency || '',
    administration_route: data.administration_route || '',
    start_date: data.start_date || null,
    end_date: data.end_date || null,
    duration: data.duration || null,
    duration_unit: data.duration_unit || '',
    // Exam fields
    examination_type: data.examination_type || '',
    findings: data.findings || '',
    recommendations: data.recommendations || '',
    // Surgery fields
    procedure_name: data.procedure_name || '',
    surgeon: data.surgeon || '',
    anesthesia_used: data.anesthesia_used || '',
    recovery_notes: data.recovery_notes || '',
    // Prescription fields
    prescription_number: data.prescription_number || ''
  };
};

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  puppy_id?: string;
  age_days?: number;
}

// Weight mapping function
export const mapToWeightRecord = (data: any): WeightRecord => {
  return {
    id: data.id || '',
    dog_id: data.dog_id || '',
    weight: parseFloat(data.weight) || 0,
    weight_unit: standardizeWeightUnit(data.weight_unit || data.unit || 'lb'),
    date: data.date || '',
    notes: data.notes || '',
    percent_change: data.percent_change || null,
    created_at: data.created_at || '',
    puppy_id: data.puppy_id || null,
    age_days: data.age_days || null
  };
};

// Helper function to standardize weight unit
function standardizeWeightUnit(unit: string): WeightUnit {
  switch (unit.toLowerCase()) {
    case 'kg':
    case 'kilograms':
      return 'kg';
    case 'g':
    case 'grams':
      return 'g';
    case 'oz':
    case 'ounces':
      return 'oz';
    case 'lb':
    case 'lbs':
    case 'pounds':
      return 'lb';
    default:
      return 'lb'; // Default to pounds
  }
}
