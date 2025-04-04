
import { WeightUnit } from './common';

export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title?: string;
  visit_date: string;
  date?: string; // For compatibility
  vet_name: string;
  description?: string;
  document_url?: string;
  record_notes?: string;
  created_at: string;
  next_due_date?: string;
  performed_by?: string;
  
  // Vaccination-specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Medication-specific fields
  medication_name?: string;
  dosage: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  
  // Examination-specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // Surgery-specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

export enum HealthRecordTypeEnum {
  VACCINATION = 'vaccination',
  EXAMINATION = 'examination',
  MEDICATION = 'medication',
  SURGERY = 'surgery',
  LABORATORY = 'laboratory',
  IMAGING = 'imaging',
  DENTAL = 'dental',
  ALLERGY = 'allergy',
  EMERGENCY = 'emergency',
  PREVENTIVE = 'preventive',
  OBSERVATION = 'observation',
  DEWORMING = 'deworming',
  GROOMING = 'grooming',
  TEST = 'test',
  OTHER = 'other',
  PROCEDURE = 'procedure'
}

// For backward compatibility, add aliases
export const HealthRecordTypeEnum_Aliases = {
  Vaccination: HealthRecordTypeEnum.VACCINATION,
  Examination: HealthRecordTypeEnum.EXAMINATION,
  Medication: HealthRecordTypeEnum.MEDICATION,
  Surgery: HealthRecordTypeEnum.SURGERY,
  Observation: HealthRecordTypeEnum.OBSERVATION,
  Deworming: HealthRecordTypeEnum.DEWORMING,
  Grooming: HealthRecordTypeEnum.GROOMING,
  Dental: HealthRecordTypeEnum.DENTAL,
  Allergy: HealthRecordTypeEnum.ALLERGY,
  Test: HealthRecordTypeEnum.TEST,
  Other: HealthRecordTypeEnum.OTHER,
  Procedure: HealthRecordTypeEnum.PROCEDURE,
  Laboratory: HealthRecordTypeEnum.LABORATORY,
  Imaging: HealthRecordTypeEnum.IMAGING,
  Preventive: HealthRecordTypeEnum.PREVENTIVE
};

export function stringToHealthRecordType(type: string): HealthRecordTypeEnum {
  // Convert case-insensitive string to enum
  const upperType = type.toUpperCase();
  
  if (Object.values(HealthRecordTypeEnum).includes(upperType as HealthRecordTypeEnum)) {
    return upperType as HealthRecordTypeEnum;
  }
  
  // Check aliases
  const aliasKey = type as keyof typeof HealthRecordTypeEnum_Aliases;
  if (HealthRecordTypeEnum_Aliases[aliasKey]) {
    return HealthRecordTypeEnum_Aliases[aliasKey];
  }
  
  // Default to OTHER if not found
  return HealthRecordTypeEnum.OTHER;
}

export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  active: boolean;
  created_at: string;
  notes?: string;
  last_administered?: string;
  medication_name?: string;
  administration_route?: string;
  is_active?: boolean;
}

export enum MedicationStatusEnum {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  SCHEDULED = 'scheduled',
  OVERDUE = 'overdue',
  UPCOMING = 'upcoming',
  DISCONTINUED = 'discontinued'
}

export interface MedicationStatus {
  status: MedicationStatusEnum;
  daysUntilNext?: number;
  daysOverdue?: number;
  nextDoseDue?: Date;
  lastDose?: Date;
  isOverdue?: boolean;
  overdue?: boolean;
  daysUntilNextDose?: number;
}

export type MedicationStatusResult = MedicationStatus;

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteEnum;
  energy?: EnergyEnum;
  stool_consistency?: StoolConsistencyEnum;
  abnormal?: boolean;
  notes?: string;
  alert_generated?: boolean;
  created_at: string;
  created_by?: string;
}

export enum AppetiteEnum {
  NORMAL = 'normal',
  INCREASED = 'increased',
  DECREASED = 'decreased',
  NONE = 'none'
}

export enum EnergyEnum {
  NORMAL = 'normal',
  INCREASED = 'increased',
  DECREASED = 'decreased',
  LETHARGIC = 'lethargic'
}

export enum StoolConsistencyEnum {
  NORMAL = 'normal',
  LOOSE = 'loose',
  WATERY = 'watery',
  HARD = 'hard',
  BLOODY = 'bloody',
  NONE = 'none'
}

// Compatibility with legacy names
export const AppetiteLevelEnum = AppetiteEnum;
export const EnergyLevelEnum = EnergyEnum;

export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: string;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

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
  birth_date?: string;
}

export interface MedicationAdministration {
  id: string;
  dog_id: string;
  medication_id: string;
  administration_date: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

export interface HealthCertificate {
  id: string;
  dog_id: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  notes?: string;
  file_url?: string;
  created_at: string;
}

// Maps from API format to internal format
export function mapToHealthRecord(apiRecord: any): HealthRecord {
  return {
    id: apiRecord.id,
    dog_id: apiRecord.dog_id,
    record_type: stringToHealthRecordType(apiRecord.record_type),
    title: apiRecord.title || '',
    visit_date: apiRecord.visit_date || apiRecord.date,
    date: apiRecord.visit_date || apiRecord.date, // For compatibility
    vet_name: apiRecord.vet_name || '',
    description: apiRecord.description || '',
    document_url: apiRecord.document_url || '',
    record_notes: apiRecord.record_notes || apiRecord.notes || '',
    created_at: apiRecord.created_at,
    next_due_date: apiRecord.next_due_date || null,
    performed_by: apiRecord.performed_by || '',
    
    // Type-specific fields with defaults
    vaccine_name: apiRecord.vaccine_name || '',
    manufacturer: apiRecord.manufacturer || '',
    lot_number: apiRecord.lot_number || '',
    expiration_date: apiRecord.expiration_date || '',
    
    medication_name: apiRecord.medication_name || '',
    dosage: apiRecord.dosage || 0,
    dosage_unit: apiRecord.dosage_unit || '',
    frequency: apiRecord.frequency || '',
    start_date: apiRecord.start_date || '',
    end_date: apiRecord.end_date || '',
    duration: apiRecord.duration || 0,
    duration_unit: apiRecord.duration_unit || '',
    administration_route: apiRecord.administration_route || '',
    
    examination_type: apiRecord.examination_type || '',
    findings: apiRecord.findings || '',
    recommendations: apiRecord.recommendations || '',
    follow_up_date: apiRecord.follow_up_date || null,
    
    procedure_name: apiRecord.procedure_name || '',
    surgeon: apiRecord.surgeon || '',
    anesthesia_used: apiRecord.anesthesia_used || '',
    recovery_notes: apiRecord.recovery_notes || ''
  };
}

export function mapToWeightRecord(apiRecord: any): WeightRecord {
  return {
    id: apiRecord.id,
    dog_id: apiRecord.dog_id,
    puppy_id: apiRecord.puppy_id || null,
    weight: apiRecord.weight,
    weight_unit: apiRecord.weight_unit,
    date: apiRecord.date,
    notes: apiRecord.notes || '',
    percent_change: apiRecord.percent_change || 0,
    created_at: apiRecord.created_at,
    age_days: apiRecord.age_days || null,
    birth_date: apiRecord.birth_date || null
  };
}

export interface GrowthStats {
  averageGrowthRate: number;
  maxGrowthRate: number;
  minGrowthRate: number;
  dailyGrowthAverage: number;
  weeklyGrowthAverage: number;
  lastWeight: number;
  firstWeight: number;
  totalGain: number;
  percentGain: number;
  currentWeight?: number;
  weightUnit?: string;
  projectedWeight?: number;
  weightGoal?: number;
  onTrack?: boolean;
  percentChange?: number;
}

export interface VaccinationSchedule {
  id: string;
  scheduled_date: string;
  vaccine_name: string;
  vaccination_type: string;
  administered: boolean;
  due_date?: string;
  notes?: string;
  puppy_id: string;
}
