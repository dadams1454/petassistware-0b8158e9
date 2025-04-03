
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
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

export enum AppetiteEnum {
  Normal = 'normal',
  Increased = 'increased',
  Decreased = 'decreased',
  None = 'none'
}

export enum EnergyLevelEnum {
  Normal = 'normal',
  High = 'high',
  Low = 'low',
  Lethargic = 'lethargic',
  Hyperactive = 'hyperactive'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Soft = 'soft',
  Loose = 'loose',
  Hard = 'hard',
  Watery = 'watery',
  Bloody = 'bloody',
  Mucousy = 'mucousy'
}

export type WeightUnit = 'lb' | 'kg' | 'g' | 'oz';
export type WeightUnitWithLegacy = WeightUnit | string;

export enum MedicationStatus {
  Active = 'active',
  Expired = 'expired',
  Upcoming = 'upcoming',
  Due = 'due',
  Overdue = 'overdue'
}

export type MedicationStatusResult = 'active' | 'expired' | 'upcoming' | 'due' | 'overdue';

export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum | string;
  title?: string;
  visit_date: string;
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
  dosage?: number;
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

export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  puppy_id?: string;
}

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

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite: AppetiteEnum;
  energy: EnergyLevelEnum;
  stool_consistency: StoolConsistencyEnum;
  abnormal: boolean;
  notes?: string;
  alert_generated: boolean;
  created_at: string;
  created_by?: string;
}

export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: string;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Helper function to convert string to HealthRecordTypeEnum
export function stringToHealthRecordType(recordType: string): HealthRecordTypeEnum {
  if (Object.values(HealthRecordTypeEnum).includes(recordType as HealthRecordTypeEnum)) {
    return recordType as HealthRecordTypeEnum;
  }
  return HealthRecordTypeEnum.Other;
}

// Helper functions to map API responses to our types
export function mapToHealthRecord(record: any): HealthRecord {
  return {
    ...record,
    record_type: stringToHealthRecordType(record.record_type)
  };
}

export function mapToWeightRecord(record: any): WeightRecord {
  return {
    ...record,
    weight_unit: record.weight_unit || record.unit || 'lb'
  };
}
