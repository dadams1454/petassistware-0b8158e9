
// Health record types and enums
export enum HealthRecordTypeEnum {
  Examination = 'examination',
  Vaccination = 'vaccination',
  Medication = 'medication',
  Procedure = 'procedure',
  Test = 'test',
  Laboratory = 'laboratory',
  Imaging = 'imaging',
  Preventive = 'preventive',
  // Additional types for compatibility
  Surgery = 'surgery',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Dental = 'dental',
  Allergy = 'allergy'
}

// Health record status enums
export enum MedicationStatusEnum {
  Active = 'active',
  Completed = 'completed',
  Discontinued = 'discontinued',
  NotStarted = 'not_started',
  Scheduled = 'scheduled',
  UpcomingDue = 'upcoming_due'
}

// Appetite level enum
export enum AppetiteLevelEnum {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

// Backward compatibility
export const AppetiteEnum = AppetiteLevelEnum;

// Energy level enum
export enum EnergyLevelEnum {
  High = 'high',
  Normal = 'normal',
  Low = 'low',
  Lethargic = 'lethargic'
}

// Backward compatibility
export const EnergyEnum = EnergyLevelEnum;

// Stool consistency enum
export enum StoolConsistencyEnum {
  Normal = 'normal',
  Loose = 'loose',
  Watery = 'watery',
  Hard = 'hard',
  Absent = 'absent'
}

// Weight unit type
export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

// For backward compatibility
export type WeightUnitWithLegacy = WeightUnit;

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  title: string;
  record_type: HealthRecordTypeEnum;
  date: string;
  visit_date?: string;
  performed_by?: string;
  vet_name?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  medication_name?: string;
  vaccine_name?: string;
  procedure_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  duration_unit?: string;
  next_due_date?: string;
  prescription_number?: string;
  lot_number?: string;
  manufacturer?: string;
  expiration_date?: string;
  document_url?: string;
  record_notes?: string;
  description?: string;
  created_at: string;
}

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  percent_change?: number;
  notes?: string;
  created_at: string;
}

// Vaccination record interface
export interface Vaccination extends HealthRecord {
  vaccine_name: string;
  lot_number?: string;
  manufacturer?: string;
  next_due_date?: string;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  medication_name?: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
  next_due_date?: string;
  last_administered?: string;
  status?: string;
  active: boolean;
  notes?: string;
  created_at: string;
}

// Medication status result interface
export interface MedicationStatusResult {
  statusLabel: string;
  statusColor: string;
  icon: string;
}

// Medication status
export type MedicationStatus = 'active' | 'completed' | 'discontinued' | 'scheduled' | 'not_started' | 'upcoming_due';

// Medication administration record
export interface MedicationAdministration {
  id: string;
  dog_id: string;
  medication_id: string;
  administration_date: string;
  administered_at?: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Vaccination schedule interface
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccine_name: string;
  vaccination_type: string;
  scheduled_date: string;
  due_date?: string;
  administered: boolean;
  notes?: string;
  created_at: string;
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: string;
  energy: string;
  stool_consistency: string;
  abnormal: boolean;
  alert_generated: boolean;
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Health indicator type
export type HealthIndicatorType = HealthIndicator;

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

// Health certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Growth stats interface
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

// Helper function to map database record to health record
export function mapToHealthRecord(record: any): HealthRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    title: record.title || '',
    record_type: stringToHealthRecordType(record.record_type),
    date: record.visit_date,
    visit_date: record.visit_date,
    performed_by: record.performed_by,
    vet_name: record.vet_name,
    findings: record.findings,
    recommendations: record.recommendations,
    follow_up_date: record.follow_up_date,
    medication_name: record.medication_name,
    vaccine_name: record.vaccine_name,
    procedure_name: record.procedure_name,
    dosage: record.dosage,
    dosage_unit: record.dosage_unit,
    frequency: record.frequency,
    administration_route: record.administration_route,
    start_date: record.start_date,
    end_date: record.end_date,
    duration: record.duration,
    duration_unit: record.duration_unit,
    next_due_date: record.next_due_date,
    prescription_number: record.prescription_number,
    lot_number: record.lot_number,
    manufacturer: record.manufacturer,
    expiration_date: record.expiration_date,
    document_url: record.document_url,
    record_notes: record.record_notes || record.notes,
    description: record.description,
    created_at: record.created_at
  };
}

// Helper function to map database record to weight record
export function mapToWeightRecord(record: any): WeightRecord {
  return {
    id: record.id,
    dog_id: record.dog_id,
    puppy_id: record.puppy_id,
    weight: record.weight,
    weight_unit: record.weight_unit,
    date: record.date,
    percent_change: record.percent_change,
    notes: record.notes,
    created_at: record.created_at
  };
}

// Helper function to convert a string to health record type
export function stringToHealthRecordType(type: string): HealthRecordTypeEnum {
  switch (type?.toLowerCase()) {
    case 'examination':
      return HealthRecordTypeEnum.Examination;
    case 'vaccination':
      return HealthRecordTypeEnum.Vaccination;
    case 'medication':
      return HealthRecordTypeEnum.Medication;
    case 'procedure':
      return HealthRecordTypeEnum.Procedure;
    case 'test':
      return HealthRecordTypeEnum.Test;
    case 'laboratory':
      return HealthRecordTypeEnum.Laboratory;
    case 'imaging':
      return HealthRecordTypeEnum.Imaging;
    case 'preventive':
      return HealthRecordTypeEnum.Preventive;
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
    default:
      return HealthRecordTypeEnum.Examination;
  }
}
