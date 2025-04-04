
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
  Other = 'other'
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

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}

// Utility function to map data to weight record
export const mapToWeightRecord = (data: any): WeightRecord => {
  return {
    id: data.id || '',
    dog_id: data.dog_id || '',
    puppy_id: data.puppy_id,
    weight: parseFloat(data.weight || '0'),
    weight_unit: data.weight_unit || 'lb',
    date: data.date || new Date().toISOString().split('T')[0],
    notes: data.notes,
    percent_change: data.percent_change,
    created_at: data.created_at || new Date().toISOString(),
    age_days: data.age_days,
    birth_date: data.birth_date
  };
};
