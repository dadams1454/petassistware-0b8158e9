
import { WeightUnit } from './common';

export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Surgery = 'surgery',
  Laboratory = 'laboratory',
  Imaging = 'imaging',
  AllergyTest = 'allergy_test',
  ParasiteControl = 'parasite_control',
  DentalCare = 'dental_care',
  EmergencyCare = 'emergency_care',
  RoutineCheckup = 'routine_checkup',
  SpecialistVisit = 'specialist_visit',
  PuppyVisit = 'puppy_visit',
  SeniorCheckup = 'senior_checkup',
  BehavioralConsult = 'behavioral_consult',
  NutritionalConsult = 'nutritional_consult',
  ReproductiveHealth = 'reproductive_health',
  Procedure = 'procedure',
  OtherRecord = 'other'
}

export enum AppetiteEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  Absent = 'absent'
}

export enum EnergyLevelEnum {
  VeryHigh = 'very_high',
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  VeryLow = 'very_low'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard'
}

export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: string | HealthRecordTypeEnum;
  title: string;
  description?: string;
  date: string;
  visit_date?: string;
  vaccine_name?: string;
  vaccine_lot?: string;
  vaccine_expiry?: string;
  next_due_date?: string;
  vet_name?: string;
  clinic_name?: string;
  document_url?: string;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  diagnosis?: string;
  treatment_plan?: string;
  follow_up_date?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  record_notes?: string;
  procedure_type?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  weight?: number;
  weight_unit?: WeightUnit;
  unit?: WeightUnit;
}

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
  status?: MedicationStatusResult;
}

export type MedicationStatusResult = 
  | 'active'
  | 'completed'
  | 'upcoming'
  | 'overdue'
  | 'expired'
  | 'discontinued'
  | 'paused'
  | string;

export interface MedicationStatus {
  status: MedicationStatusResult;
  nextDue?: Date | string | null;
  lastTaken?: Date | string | null;
  daysOverdue?: number;
  statusColor?: string;
}

export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name?: string;
  due_date: string;
  administered: boolean;
  scheduled_date?: string;
  notes?: string;
  created_at: string;
}

export interface GrowthStats {
  currentWeight: number;
  weightUnit: WeightUnit;
  percentChange: number;
  averageGrowth: number;
  growthRate: number;
  averageGrowthRate: number;
  lastWeekGrowth: number;
  weightGoal?: number;
  projectedWeight: number;
  onTrack: boolean;
}

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: AppetiteEnum;
  energy_level: EnergyLevelEnum;
  stool_consistency: StoolConsistencyEnum;
  water_intake: string;
  notes: string;
  created_at: string;
  created_by: string;
}

export interface HealthAlert {
  id: string;
  dog_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  resolved: boolean;
  created_at: string;
  resolved_at?: string;
  created_by: string;
}

export interface HealthCertificate {
  id: string;
  dog_id: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuing_vet: string;
  certificate_number: string;
  document_url?: string;
  notes?: string;
  created_at: string;
  created_by: string;
}

export interface MedicationAdministration {
  id: string;
  dog_id?: string;
  puppy_id?: string;
  medication_id: string;
  administered_by: string;
  administered_date: string;
  dosage: number;
  dosage_unit: string;
  notes?: string;
  created_at: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  unit?: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}

export function stringToHealthRecordType(type: string): HealthRecordTypeEnum {
  if (Object.values(HealthRecordTypeEnum).includes(type as HealthRecordTypeEnum)) {
    return type as HealthRecordTypeEnum;
  }
  return HealthRecordTypeEnum.OtherRecord;
}

export function mapToHealthRecord(record: any): HealthRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    record_type: record.record_type || HealthRecordTypeEnum.OtherRecord,
    title: record.title || record.vaccine_name || record.medication_name || 'Untitled Record',
    description: record.description || record.notes,
    date: record.date || record.visit_date || record.created_at,
    visit_date: record.visit_date,
    vaccine_name: record.vaccine_name,
    vaccine_lot: record.vaccine_lot,
    vaccine_expiry: record.vaccine_expiry,
    next_due_date: record.next_due_date,
    vet_name: record.vet_name,
    clinic_name: record.clinic_name,
    document_url: record.document_url,
    medication_name: record.medication_name,
    dosage: record.dosage,
    dosage_unit: record.dosage_unit,
    frequency: record.frequency,
    administration_route: record.administration_route,
    start_date: record.start_date,
    end_date: record.end_date,
    duration: record.duration,
    duration_unit: record.duration_unit,
    diagnosis: record.diagnosis,
    treatment_plan: record.treatment_plan,
    follow_up_date: record.follow_up_date,
    notes: record.notes || record.description,
    created_at: record.created_at,
    created_by: record.created_by,
    record_notes: record.record_notes,
    procedure_type: record.procedure_type,
    anesthesia_used: record.anesthesia_used,
    recovery_notes: record.recovery_notes,
    weight: record.weight,
    weight_unit: record.weight_unit,
    unit: record.weight_unit
  };
}

export function mapToWeightRecord(record: any): WeightRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    puppy_id: record.puppy_id,
    weight: record.weight,
    weight_unit: record.weight_unit,
    unit: record.weight_unit || record.unit,
    date: record.date,
    notes: record.notes,
    percent_change: record.percent_change,
    created_at: record.created_at,
    age_days: record.age_days,
    birth_date: record.birth_date
  };
}
