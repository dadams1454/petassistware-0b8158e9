
// Export enums
export enum MedicationFrequency {
  DAILY = 'DAILY',
  TWICE_DAILY = 'TWICE_DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
  AS_NEEDED = 'AS_NEEDED',
  OTHER = 'OTHER',
  CUSTOM = 'CUSTOM'
}

export enum MedicationType {
  PREVENTATIVE = 'PREVENTATIVE',
  TREATMENT = 'TREATMENT',
  SUPPLEMENT = 'SUPPLEMENT',
  PRESCRIPTION = 'PRESCRIPTION',
  OVER_THE_COUNTER = 'OVER_THE_COUNTER',
  VACCINE = 'VACCINE'
}

export enum MedicationRoute {
  ORAL = 'ORAL',
  TOPICAL = 'TOPICAL',
  INJECTION = 'INJECTION',
  OPHTHALMIC = 'OPHTHALMIC',
  OTIC = 'OTIC',
  RECTAL = 'RECTAL',
  INHALATION = 'INHALATION',
  OTHER = 'OTHER'
}

export enum MedicationStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DISCONTINUED = 'DISCONTINUED',
  UPCOMING = 'UPCOMING',
  OVERDUE = 'OVERDUE',
  CURRENT = 'CURRENT',
  INACTIVE = 'INACTIVE'
}

// Medication record from the database
export interface MedicationRecord {
  id: string;
  dog_id: string;
  medication_name: string;
  dosage?: string;
  dosage_unit?: string;
  frequency: MedicationFrequency;
  route?: MedicationRoute;
  start_date: string;
  end_date?: string | null;
  next_due_date?: string | null;
  medication_type: MedicationType;
  prescription_id?: string;
  refills_remaining?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  last_administered?: string | null;
  status?: MedicationStatus | string;
  task_name?: string;
  category?: string;
  timestamp?: string;
  administered_by?: string;
  medication_metadata?: any;
  administrations?: any[];
}

// Data for creating/updating medication records
export interface MedicationFormData {
  dog_id: string;
  created_by?: string;
  medication_name: string;
  dosage?: string;
  dosage_unit?: string;
  frequency: MedicationFrequency;
  route?: MedicationRoute;
  start_date: Date;
  end_date?: Date | null;
  next_due_date?: Date | null;
  medication_type: MedicationType;
  prescription_id?: string;
  refills_remaining?: number;
  notes?: string;
}

// Interface for medication administration logs
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at?: string;
}

// Interface for medication statistics
export interface MedicationStats {
  total?: number;
  activeCount?: number;
  completedCount?: number;
  overdueCount?: number;
  upcomingCount?: number;
  preventative?: number;
  prescription?: number;
  supplement?: number;
  treatment?: number;
  vaccine?: number;
  complianceRate?: number;
  byType?: Record<MedicationType, number>;
  byFrequency?: Record<MedicationFrequency, number>;
  totalMedications?: number;
  activeMedications?: number;
}

// Light-weight medication info for display in lists
export interface MedicationInfo {
  id: string;
  name: string;
  frequency: MedicationFrequency;
  lastAdministered?: string;
  nextDue?: string;
  type?: MedicationType;
  medication_type?: MedicationType;
  status?: MedicationStatus | string;
  notes?: string;
  isPreventative?: boolean;
}

// Used for medication filter components
export interface MedicationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

// Schedule information for medications
export interface MedicationSchedule {
  id: string;
  medication_id: string;
  schedule_type: MedicationFrequency;
  next_due: string;
  days?: string[];
  times?: string[];
  custom_interval?: number;
  created_at?: string;
  updated_at?: string;
}
