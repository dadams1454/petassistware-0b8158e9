// Health-related type definitions

import { WeightUnit } from './common';

// Health Record Types
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
  Other = 'other',
  Procedure = 'procedure'
}

// Health measurement and indicators
export enum StoolConsistencyEnum {
  Normal = 'normal',
  Hard = 'hard',
  Soft = 'soft',
  Watery = 'watery',
  Mucousy = 'mucousy',
  Bloody = 'bloody',
  Loose = 'loose'
}

export enum AppetiteEnum {
  Normal = 'normal',
  Decreased = 'decreased',
  Increased = 'increased',
  None = 'none'
}

export enum EnergyEnum {
  Normal = 'normal',
  Lethargic = 'lethargic',
  Hyperactive = 'hyperactive',
  Low = 'low',
  VeryLow = 'very_low'
}

// For backward compatibility
export const AppetiteLevelEnum = AppetiteEnum;
export const EnergyLevelEnum = EnergyEnum;

// Helper function to map strings to HealthRecordTypeEnum
export const stringToHealthRecordType = (
  type: string
): HealthRecordTypeEnum => {
  switch (type.toLowerCase()) {
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
    case 'procedure':
      return HealthRecordTypeEnum.Procedure;
    default:
      return HealthRecordTypeEnum.Other;
  }
};

// Health Record Interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  visit_date: string;
  date?: string; // For backward compatibility
  vet_name: string;
  description?: string;
  document_url?: string;
  record_notes?: string;
  created_at: string;
  next_due_date?: string | null;
  performed_by?: string;
  
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
  
  // Examination specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Weight record type
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at: string;
  percent_change?: number;
  puppy_id?: string;
  unit?: WeightUnit; // For backward compatibility
  age_days?: number; // For puppy weight tracking
  birth_date?: string; // For puppy weight tracking
}

// Export WeightUnit so it can be used in other files
export { WeightUnit };

// Mapping function to convert DB results to WeightRecord
export const mapToWeightRecord = (data: any): WeightRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    weight: data.weight,
    weight_unit: data.weight_unit as WeightUnit,
    date: data.date,
    notes: data.notes || '',
    created_at: data.created_at,
    percent_change: data.percent_change || 0,
    puppy_id: data.puppy_id
  };
};

// Mapping function to convert form data to HealthRecord
export const mapToHealthRecord = (data: any): Partial<HealthRecord> => {
  return {
    dog_id: data.dog_id,
    record_type: stringToHealthRecordType(data.record_type),
    title: data.title,
    visit_date: data.visit_date,
    vet_name: data.vet_name,
    description: data.description,
    document_url: data.document_url,
    record_notes: data.record_notes,
    next_due_date: data.next_due_date,
    // Add other fields based on record type
    ...(data.record_type === 'vaccination' && {
      vaccine_name: data.vaccine_name,
      manufacturer: data.manufacturer,
      lot_number: data.lot_number
    }),
    ...(data.record_type === 'medication' && {
      medication_name: data.medication_name,
      dosage: data.dosage,
      dosage_unit: data.dosage_unit,
      frequency: data.frequency,
      start_date: data.start_date,
      end_date: data.end_date,
      duration: data.duration,
      duration_unit: data.duration_unit,
      administration_route: data.administration_route
    }),
    ...(data.record_type === 'examination' && {
      examination_type: data.examination_type,
      findings: data.findings,
      recommendations: data.recommendations,
      follow_up_date: data.follow_up_date
    }),
    ...(data.record_type === 'surgery' && {
      procedure_name: data.procedure_name,
      surgeon: data.surgeon,
      anesthesia_used: data.anesthesia_used,
      recovery_notes: data.recovery_notes
    })
  };
};

// Vaccination schedule type
export interface VaccinationSchedule {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  vaccination_type: string;
  scheduled_date: string;
  administered: boolean;
  vaccine_name?: string;
  due_date?: string;
  notes?: string;
}

// Medication status types
export enum MedicationStatusEnum {
  active = 'active',
  overdue = 'overdue',
  upcoming = 'upcoming',
  completed = 'completed',
  unknown = 'unknown'
}

export type MedicationStatus = MedicationStatusEnum | string;

export interface MedicationStatusResult {
  status: MedicationStatus;
  statusLabel: string;
  statusColor: string;
  nextDue?: Date;
  daysUntilNext?: number;
  isOverdue: boolean;
}

// Medication type
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
  lastAdministered?: string;
  status?: MedicationStatus | MedicationStatusResult;
  nextDue?: string;
}

// Medication administration record type
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_by: string;
  administered_at: string;
  notes?: string;
}

// Health growth stats
export interface GrowthStats {
  currentWeight: number;
  weightUnit: WeightUnit;
  percentChange: number;
  averageGrowth: number;
  growthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
  averageGrowthRate: number;
  weightGoal: number;
  onTrack: boolean;
}

// Health indicator record
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: AppetiteEnum;
  energy: EnergyEnum;
  stool_consistency: StoolConsistencyEnum;
  abnormal: boolean;
  notes?: string;
  alert_generated: boolean;
  created_at: string;
  created_by?: string;
}

// Health alert type
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: 'active' | 'resolved';
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Health certificate type
export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  issuing_vet: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Vaccination
export interface Vaccination {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes?: string;
  created_at: string;
}
