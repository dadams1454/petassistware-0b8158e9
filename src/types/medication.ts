
import { CareRecord } from '@/types/careRecord';

/**
 * Medication frequency options
 */
export enum MedicationFrequency {
  DAILY = 'daily',
  TWICE_DAILY = 'twice_daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
  AS_NEEDED = 'as_needed',
  CUSTOM = 'custom'
}

/**
 * Medication administration routes
 */
export enum MedicationRoute {
  ORAL = 'oral',
  INJECTION = 'injection',
  TOPICAL = 'topical',
  OPHTHALMIC = 'ophthalmic',
  OTIC = 'otic',
  NASAL = 'nasal',
  RECTAL = 'rectal',
  INHALATION = 'inhalation',
  OTHER = 'other'
}

/**
 * Medication status options
 */
export enum MedicationStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DISCONTINUED = 'discontinued',
  UPCOMING = 'upcoming',
  OVERDUE = 'overdue'
}

/**
 * Medication type categories
 */
export enum MedicationType {
  PREVENTATIVE = 'preventative',
  PRESCRIPTION = 'prescription',
  SUPPLEMENT = 'supplement',
  TREATMENT = 'treatment',
  VACCINE = 'vaccine'
}

/**
 * Medication administration record
 */
export interface MedicationAdministration {
  id: string;
  timestamp: string;
  administered_by: string;
  notes?: string;
}

/**
 * Extended medication record based on CareRecord
 */
export interface MedicationRecord extends CareRecord {
  medication_name: string;
  dosage?: string;
  dosage_unit?: string;
  frequency: MedicationFrequency;
  route?: MedicationRoute;
  start_date?: string;
  end_date?: string;
  next_due_date?: string;
  medication_type: MedicationType;
  prescription_id?: string;
  refills_remaining?: number;
  administered_by?: string;
  administrations?: MedicationAdministration[] | string;
  timestamp: string;
  // Make status compatible with both CareRecord status and MedicationStatus
  status: 'completed' | 'scheduled' | 'missed' | string;
}

/**
 * Data needed to create a medication record
 */
export interface MedicationFormData {
  dog_id: string;
  medication_name: string;
  dosage?: string;
  dosage_unit?: string;
  frequency: MedicationFrequency;
  route?: MedicationRoute;
  start_date: Date;
  end_date?: Date;
  notes?: string;
  medication_type: MedicationType;
  prescription_id?: string;
  refills_remaining?: number;
  next_due_date?: Date;
  created_by?: string;
}

/**
 * Medication schedule record
 */
export interface MedicationSchedule {
  id: string;
  dog_id: string;
  medication_record_id: string;
  scheduled_date: string;
  scheduled_time?: string;
  status: 'scheduled' | 'completed' | 'missed' | 'skipped';
  administered_at?: string;
  administered_by?: string;
  notes?: string;
  created_at: string;
}

/**
 * Medication summary statistics
 */
export interface MedicationStats {
  total: number;
  preventative: number;
  prescription: number;
  supplement: number;
  treatment: number;
  vaccine: number;
  activeCount: number;
  completedCount: number;
  overdueCount: number;
  upcomingCount: number;
  complianceRate: number;
}
