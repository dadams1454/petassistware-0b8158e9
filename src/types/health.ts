
import { WeightUnit } from './common';

// Health-related enums
export enum AppetiteEnum {
  Poor = 'poor',
  Normal = 'normal',
  Increased = 'increased',
  Decreased = 'decreased',
  None = 'none',
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair'
}

// Backward compatibility enum names
export enum AppetiteLevelEnum {
  Poor = 'poor',
  Normal = 'normal',
  Increased = 'increased',
  Decreased = 'decreased',
  None = 'none',
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair'
}

export enum EnergyEnum {
  Low = 'low',
  Normal = 'normal',
  High = 'high',
  Hyperactive = 'hyperactive',
  Lethargic = 'lethargic'
}

// Backward compatibility enum names
export enum EnergyLevelEnum {
  Low = 'low',
  Normal = 'normal',
  High = 'high',
  Hyperactive = 'hyperactive',
  Lethargic = 'lethargic'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard',
  Bloody = 'bloody',
  None = 'none',
  Soft = 'soft',
  Mucousy = 'mucousy'
}

export enum MedicationStatusEnum {
  Active = 'active',
  Completed = 'completed',
  Discontinued = 'discontinued',
  Scheduled = 'scheduled',
  NotStarted = 'not_started'
}

// Define string literals for compatibility
export type MedicationStatus = 'active' | 'completed' | 'discontinued' | 'scheduled' | 'not_started' | 'overdue' | 'upcoming' | 'unknown';

// Health record type enum - synchronized with HealthRecordTypeEnum in dog.ts
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
  Procedure = 'procedure',
  Other = 'other'
}

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number; // For puppy weight tracking
  birth_date?: string; // For puppy weight tracking
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  created_at: string;
  last_administered?: string;
  is_active?: boolean;
}

// Medication status interface
export interface MedicationStatusInfo {
  id: string;
  medication_id: string;
  status: MedicationStatusEnum;
  updated_at: string;
  notes?: string;
}

// Medication status result
export interface MedicationStatusResult {
  status: MedicationStatusEnum | string;
  nextDue?: string;
  lastAdministered?: string;
  daysSinceStart?: number;
  daysUntilEnd?: number;
  isOverdue?: boolean;
  dosesTaken?: number;
  dosesRemaining?: number;
  adherenceRate?: number;
  statusLabel?: string;
  statusColor?: string;
}

// Medication administration
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_date: string;
  administered_at?: string; // For backward compatibility
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Vaccination schedule
export interface VaccinationSchedule {
  id: string;
  dog_id: string;
  vaccine_name: string;
  due_date: string;
  administered: boolean;
  administered_date?: string;
  scheduled_date?: string;
  notes?: string;
  created_at?: string;
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

// Health indicator
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteEnum;
  energy?: EnergyEnum;
  stool_consistency?: StoolConsistencyEnum;
  abnormal: boolean;
  notes?: string;
  alert_generated: boolean;
  created_at: string;
  created_by?: string;
}

// Health alert
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: 'active' | 'resolved';
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Health certificate
export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuing_authority: string;
  issuer?: string; // For compatibility
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Health record
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
  
  // Field groups for specific record types
  // Vaccination
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  
  // Medication
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  
  // Examination
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  
  // Surgery
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  notes?: string; // For compatibility
}

// Re-export WeightUnit for use in other modules
export type { WeightUnit };

// Helper functions
export function mapToHealthRecord(data: any): HealthRecord {
  return {
    id: data.id || '',
    dog_id: data.dog_id || '',
    record_type: stringToHealthRecordType(data.record_type),
    title: data.title || '',
    visit_date: data.visit_date || data.date || new Date().toISOString().split('T')[0],
    date: data.date || data.visit_date,
    vet_name: data.vet_name || '',
    description: data.description || '',
    document_url: data.document_url,
    record_notes: data.record_notes || data.notes,
    created_at: data.created_at || new Date().toISOString(),
    next_due_date: data.next_due_date,
    performed_by: data.performed_by,
    notes: data.notes,
    
    // Type-specific fields
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
    recovery_notes: data.recovery_notes
  };
}

export function mapToWeightRecord(data: any): WeightRecord {
  return {
    id: data.id || '',
    dog_id: data.dog_id || '',
    puppy_id: data.puppy_id,
    weight: Number(data.weight) || 0,
    weight_unit: data.weight_unit || data.unit || 'lb',
    unit: data.unit || data.weight_unit || 'lb',
    date: data.date || new Date().toISOString().split('T')[0],
    notes: data.notes || '',
    percent_change: data.percent_change,
    created_at: data.created_at || new Date().toISOString(),
    age_days: data.age_days,
    birth_date: data.birth_date
  };
}

export function stringToHealthRecordType(type: string): HealthRecordTypeEnum {
  if (Object.values(HealthRecordTypeEnum).includes(type as HealthRecordTypeEnum)) {
    return type as HealthRecordTypeEnum;
  }
  return HealthRecordTypeEnum.Other;
}
