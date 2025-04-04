
import { WeightUnit } from '@/types/common';

// Health record types
export enum HealthRecordTypeEnum {
  Exam = 'exam',
  Vaccination = 'vaccination',
  Parasite = 'parasite',
  Medication = 'medication',
  Surgery = 'surgery',
  Emergency = 'emergency',
  Lab = 'lab',
  Dental = 'dental',
  Xray = 'xray',
  Ultrasound = 'ultrasound',
  Other = 'other',
  Examination = 'examination',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Allergy = 'allergy',
  Test = 'test',
  Procedure = 'procedure'
}

// Health indicators enums
export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

export enum EnergyLevelEnum {
  Hyperactive = 'hyperactive',
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard',
  Mucousy = 'mucousy',
  Bloody = 'bloody'
}

// Define the AppetiteEnum, EnergyEnum for backward compatibility
export const AppetiteEnum = AppetiteLevelEnum;
export const EnergyEnum = EnergyLevelEnum;

// Medication status types
export enum MedicationStatusEnum {
  Active = 'active',
  Discontinued = 'discontinued',
  Scheduled = 'scheduled',
  NotStarted = 'not_started',
  Completed = 'completed',
  Due = 'due',
  Overdue = 'overdue'
}

export type MedicationStatus = 
  | 'active' 
  | 'discontinued' 
  | 'scheduled' 
  | 'not_started'
  | 'completed'
  | 'overdue'
  | 'upcoming'
  | 'due';

export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  nextDue: Date | null;
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  visit_date: string;
  title: string;
  description: string;
  performed_by: string;
  vet_name: string;
  next_due_date?: string;
  notes?: string;
  created_at: string;
  
  // Backward compatibility fields
  date?: string;
  record_notes?: string;
  document_url?: string;
  
  // Vaccination fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Medication fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  
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
  alert_generated: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export type HealthIndicatorType = Omit<HealthIndicator, 'id' | 'created_at'>;

// Health alert interface
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: string;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // Backwards compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  next_due?: string;
  status?: MedicationStatus;
  is_preventative?: boolean;
}

// Medication administration record
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Vaccination schedule
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name?: string;
  due_date: string;
  scheduled_date?: string;
  administered?: boolean;
  notes?: string;
  created_at?: string;
}

// Health certificate
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

// Growth statistics
export interface GrowthStats {
  percentChange: number;
  averageGrowthRate: number;
  weightGoal: number | null;
  onTrack: boolean | null;
  totalGrowth?: number | null;
  currentWeight?: number;
  weightUnit?: string;
  averageGrowth?: number;
  growthRate?: number;
  lastWeekGrowth?: number;
  projectedWeight?: number;
}

// Utility functions
export const mapToHealthRecord = (data: any): HealthRecord => {
  return {
    id: data.id || '',
    dog_id: data.dog_id || '',
    record_type: data.record_type || HealthRecordTypeEnum.Exam,
    visit_date: data.visit_date || new Date().toISOString().split('T')[0],
    title: data.title || '',
    description: data.description || '',
    performed_by: data.performed_by || '',
    vet_name: data.vet_name || '',
    next_due_date: data.next_due_date,
    notes: data.notes,
    created_at: data.created_at || new Date().toISOString(),
    // Map additional fields
    vaccine_name: data.vaccine_name,
    manufacturer: data.manufacturer,
    lot_number: data.lot_number,
    expiration_date: data.expiration_date,
    medication_name: data.medication_name,
    dosage: data.dosage,
    dosage_unit: data.dosage_unit,
    frequency: data.frequency,
    start_date: data.start_date,
    end_date: data.end_date,
    duration: data.duration,
    duration_unit: data.duration_unit,
    administration_route: data.administration_route,
    examination_type: data.examination_type,
    findings: data.findings,
    recommendations: data.recommendations,
    follow_up_date: data.follow_up_date,
    procedure_name: data.procedure_name,
    surgeon: data.surgeon,
    anesthesia_used: data.anesthesia_used,
    recovery_notes: data.recovery_notes,
    // Backward compatibility
    date: data.visit_date || data.date,
    record_notes: data.notes || data.record_notes,
    document_url: data.document_url
  };
};

// Utility function to map data to weight record
export const mapToWeightRecord = (data: any): WeightRecord => {
  return {
    id: data.id || '',
    dog_id: data.dog_id || '',
    puppy_id: data.puppy_id,
    weight: parseFloat(data.weight || '0'),
    weight_unit: data.weight_unit || 'lb',
    unit: data.unit || data.weight_unit || 'lb', // Backward compatibility
    date: data.date || new Date().toISOString().split('T')[0],
    notes: data.notes,
    percent_change: data.percent_change,
    created_at: data.created_at || new Date().toISOString(),
    age_days: data.age_days,
    birth_date: data.birth_date
  };
};

// Convert string to HealthRecordTypeEnum
export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  const normalizedType = type.toLowerCase();
  
  // Check if it's a valid enum value
  const isValidType = Object.values(HealthRecordTypeEnum).includes(normalizedType as HealthRecordTypeEnum);
  
  if (isValidType) {
    return normalizedType as HealthRecordTypeEnum;
  }
  
  // Map common aliases
  const typeMap: Record<string, HealthRecordTypeEnum> = {
    'check-up': HealthRecordTypeEnum.Exam,
    'checkup': HealthRecordTypeEnum.Exam,
    'check up': HealthRecordTypeEnum.Exam,
    'annual': HealthRecordTypeEnum.Exam,
    'vaccine': HealthRecordTypeEnum.Vaccination,
    'shot': HealthRecordTypeEnum.Vaccination,
    'antiparasitic': HealthRecordTypeEnum.Parasite,
    'worm': HealthRecordTypeEnum.Parasite,
    'deworming': HealthRecordTypeEnum.Parasite,
    'medicine': HealthRecordTypeEnum.Medication,
    'rx': HealthRecordTypeEnum.Medication,
    'prescription': HealthRecordTypeEnum.Medication,
    'operation': HealthRecordTypeEnum.Surgery,
    'procedure': HealthRecordTypeEnum.Surgery,
    'emergency visit': HealthRecordTypeEnum.Emergency,
    'urgent': HealthRecordTypeEnum.Emergency,
    'test': HealthRecordTypeEnum.Lab,
    'laboratory': HealthRecordTypeEnum.Lab,
    'blood test': HealthRecordTypeEnum.Lab,
    'teeth': HealthRecordTypeEnum.Dental,
    'dental cleaning': HealthRecordTypeEnum.Dental,
    'radiograph': HealthRecordTypeEnum.Xray,
    'x-ray': HealthRecordTypeEnum.Xray,
    'sonogram': HealthRecordTypeEnum.Ultrasound
  };
  
  return typeMap[normalizedType] || HealthRecordTypeEnum.Other;
};
