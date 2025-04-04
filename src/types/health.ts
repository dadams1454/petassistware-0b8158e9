
// Medication status enum
export enum MedicationStatusEnum {
  Active = 'active',
  Completed = 'completed',
  Discontinued = 'discontinued',
  NotStarted = 'not_started',
  Scheduled = 'scheduled',
  Unknown = 'unknown'
}

// Medication status result interface
export interface MedicationStatusResult {
  status: MedicationStatusEnum;
  nextDue?: Date | null;
  daysUntilNextDose?: number;
  isOverdue?: boolean;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date?: string;
  end_date?: string;
  active: boolean;
  last_administered?: string;
  notes?: string;
  created_at: string;
  medication_name?: string; // For compatibility with puppy medications
  is_active?: boolean; // For compatibility with puppy medications
}

// Medication administration interface
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administration_date: string;
  administered_by: string;
  notes?: string;
  created_at: string;
  administered_at?: string; // For compatibility
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  visit_date: string;
  vet_name: string;
  description?: string;
  notes?: string;
  created_at?: string;
  next_due_date?: string;
  
  // Extended fields for UI compatibility
  title?: string;
  date?: string;
  record_notes?: string;
  document_url?: string;
  performed_by?: string;
  
  // Vaccination specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  
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

// Vaccination interface
export interface Vaccination {
  id?: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: Date;
  vaccination_dateStr?: string;
  notes?: string;
  created_at?: string;
}

// Vaccination schedule interface
export interface VaccinationSchedule {
  id: string;
  vaccination_type: string;
  age_in_weeks: number;
  notes?: string;
  created_at?: string;
  
  // Extended fields for puppy vaccinations
  puppy_id?: string;
  scheduled_date?: string;
  due_date?: string;
  administered?: boolean;
  vaccine_name?: string;
}

// Growth stats interface
export interface GrowthStats {
  id: string;
  dog_id: string;
  date: string;
  weight: number;
  height: number;
  notes?: string;
  created_at?: string;
  
  // Additional properties for compatibility
  currentWeight: number;
  weightUnit: string;
  averageGrowth: number;
  growthRate: number;
  lastWeekGrowth: number;
  projectedWeight: number;
  percentChange: number;
  averageGrowthRate: number;
  weightGoal: number | null;
  onTrack: boolean | null;
}

// Health indicator interface
export interface HealthIndicator {
  id?: string;
  dog_id: string;
  indicator_type: HealthIndicatorType;
  record_date: string | Date;
  value: number;
  notes?: string;
  created_at?: string;
}

// Health indicator type
export type HealthIndicatorType =
  | 'temperature'
  | 'heart_rate'
  | 'respiratory_rate'
  | 'blood_pressure'
  | 'glucose_level'
  | 'hydration_level'
  | 'custom';

// Health alert interface
export interface HealthAlert {
  id: string;
  dog_id: string;
  alert_type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  created_at?: string;
}

// Health certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  issue_date: string;
  expiry_date?: string;
  veterinarian: string;
  notes?: string;
  created_at?: string;
  
  // For puppy health certificates
  puppy_id?: string;
  certificate_type?: string;
  issuer?: string;
  file_url?: string;
}

// Weight record interface
export interface WeightRecord {
  id?: string;
  puppy_id?: string;
  dog_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  record_date?: string; // For backward compatibility
  notes?: string;
  percent_change?: number;
  created_at?: string;
  age_days?: number; // For puppy weight tracking
  birth_date?: string; // For age calculation
  unit?: string; // For backward compatibility
}

// Weight unit type
export type WeightUnit = 'g' | 'kg' | 'lb' | 'oz';

// Enums
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Dental = 'dental',
  Allergy = 'allergy',
  Test = 'test',
  Laboratory = 'laboratory',
  Imaging = 'imaging',
  Preventive = 'preventive',
  Procedure = 'procedure',
  Other = 'other'
}

export enum AppetiteEnum {
  Normal = 'normal',
  Increased = 'increased',
  Decreased = 'decreased',
  None = 'none',
  Good = 'good',
  Poor = 'poor',
  Ravenous = 'ravenous',
  Finicky = 'finicky',
  Excellent = 'excellent',
  Fair = 'fair'
}

export enum EnergyEnum {
  Normal = 'normal',
  High = 'high',
  Low = 'low',
  Restless = 'restless',
  Hyperactive = 'hyperactive',
  Energetic = 'energetic',
  Lethargic = 'lethargic'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Loose = 'loose',
  Diarrhea = 'diarrhea',
  Constipated = 'constipated',
  Soft = 'soft',
  Watery = 'watery',
  Hard = 'hard',
  Mucousy = 'mucousy',
  Bloody = 'bloody'
}

export enum AppetiteLevelEnum {
  Normal = 'normal',
  Good = 'good',
  Poor = 'poor',
  Ravenous = 'ravenous',
  Finicky = 'finicky',
  Excellent = 'excellent',
  Fair = 'fair',
  None = 'none'
}

export enum EnergyLevelEnum {
  Normal = 'normal',
  High = 'high',
  Low = 'low',
  Energetic = 'energetic',
  Lethargic = 'lethargic',
  Hyperactive = 'hyperactive'
}

// Helper function to map string to HealthRecordTypeEnum
export const stringToHealthRecordType = (str: string): HealthRecordTypeEnum => {
  switch (str) {
    case 'vaccination':
      return HealthRecordTypeEnum.Vaccination;
    case 'examination':
      return HealthRecordTypeEnum.Examination;
    case 'medication':
      return HealthRecordTypeEnum.Medication;
    case 'surgery':
      return HealthRecordTypeEnum.Surgery;
    case 'observation':
      return HealthRecordTypeEnum.Observation;
    case 'deworming':
      return HealthRecordTypeEnum.Deworming;
    case 'grooming':
      return HealthRecordTypeEnum.Grooming;
    case 'dental':
      return HealthRecordTypeEnum.Dental;
    case 'allergy':
      return HealthRecordTypeEnum.Allergy;
    case 'test':
      return HealthRecordTypeEnum.Test;
    case 'laboratory':
      return HealthRecordTypeEnum.Laboratory;
    case 'imaging':
      return HealthRecordTypeEnum.Imaging;
    case 'preventive':
      return HealthRecordTypeEnum.Preventive;
    case 'procedure':
      return HealthRecordTypeEnum.Procedure;
    default:
      return HealthRecordTypeEnum.Other;
  }
};

// Map to HealthRecord
export const mapToHealthRecord = (data: any): HealthRecord => ({
  id: data.id,
  dog_id: data.dog_id,
  record_type: data.record_type as HealthRecordTypeEnum,
  visit_date: data.visit_date,
  vet_name: data.vet_name,
  description: data.description,
  notes: data.notes,
  created_at: data.created_at,
  next_due_date: data.next_due_date,
  // Map extended fields
  title: data.title,
  date: data.visit_date, // For compatibility
  record_notes: data.notes, // For compatibility
  document_url: data.document_url,
  performed_by: data.performed_by,
  // Vaccination specific fields
  vaccine_name: data.vaccine_name,
  manufacturer: data.manufacturer,
  lot_number: data.lot_number,
  // Medication specific fields
  medication_name: data.medication_name,
  dosage: data.dosage,
  dosage_unit: data.dosage_unit,
  frequency: data.frequency,
  start_date: data.start_date,
  end_date: data.end_date,
  duration: data.duration,
  duration_unit: data.duration_unit,
  administration_route: data.administration_route,
  // Examination specific fields
  examination_type: data.examination_type,
  findings: data.findings,
  recommendations: data.recommendations,
  follow_up_date: data.follow_up_date,
  // Surgery specific fields
  procedure_name: data.procedure_name,
  surgeon: data.surgeon,
  anesthesia_used: data.anesthesia_used,
  recovery_notes: data.recovery_notes
});

// Map to WeightRecord
export const mapToWeightRecord = (data: any): WeightRecord => ({
  id: data.id,
  puppy_id: data.puppy_id,
  dog_id: data.dog_id,
  weight: data.weight,
  weight_unit: data.weight_unit || data.unit, // For compatibility
  date: data.date || data.record_date, // For compatibility
  record_date: data.date || data.record_date, // For compatibility
  notes: data.notes,
  percent_change: data.percent_change,
  created_at: data.created_at,
  age_days: data.age_days,
  birth_date: data.birth_date,
  unit: data.weight_unit || data.unit // For compatibility
});
