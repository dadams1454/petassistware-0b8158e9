
import { WeightUnit } from './common';

// Health record type enum - exported for use in other files
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
  Preventive = 'preventive'
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum | string;
  title: string;
  visit_date: string;
  description?: string;
  vet_name?: string;
  performed_by?: string;
  document_url?: string;
  record_notes?: string;
  notes?: string;
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

// String to health record type converter
export function stringToHealthRecordType(type: string): HealthRecordTypeEnum {
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
    default:
      return HealthRecordTypeEnum.Examination;
  }
}

// Weight record
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For backwards compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  puppy_id?: string;
  age_days?: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  administration_route?: string;
  notes?: string;
  active: boolean;
  dog_id: string;
}

export interface MedicationStatus {
  status: string;
  statusColor: string;
  statusLabel?: string;
}

export interface MedicationStatusResult {
  status: string;
  statusColor: string;
  statusLabel: string;
}

export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  scheduled_date?: string; // Compatibility field
  administered?: boolean; // Compatibility field
  vaccine_name?: string; // Compatibility field
  created_at?: string;
}

// Enumeration of appetite levels
export enum AppetiteEnum {
  Poor = 'poor',
  Reduced = 'reduced',
  Normal = 'normal',
  Increased = 'increased',
  Excessive = 'excessive'
}

// Growth statistics
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

// Health indicator
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: string;
  energy: string;
  stool_consistency: string;
  abnormal: boolean;
  notes?: string;
  alert_generated: boolean;
  created_by?: string;
  created_at: string;
}

// Health alert
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: string;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Function to standardize weight unit - Backwards compatibility, now prefer the one in common.ts
export function standardizeWeightUnit(unit: string): WeightUnit {
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
