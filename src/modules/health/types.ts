
/**
 * Health module type definitions
 */
import { 
  HealthRecord as BaseHealthRecord,
  HealthIndicator,
  Medication,
  MedicationAdministration,
  HealthCertificate
} from '@/types/health';

import {
  HealthRecordType,
  AppetiteLevel,
  EnergyLevel,
  StoolConsistency,
  MedicationStatusResult
} from '@/types/health-enums';

import { WeightUnit } from '@/types/weight-units';

// Re-export types from health and health-enums for convenience and consistency
export type { 
  BaseHealthRecord,
  HealthIndicator,
  Medication,
  MedicationAdministration,
  HealthCertificate,
  HealthRecordType,
  AppetiteLevel,
  EnergyLevel,
  StoolConsistency,
  MedicationStatusResult
};

// Define more specific derived health record types for different categories
export interface HealthRecord extends BaseHealthRecord {
  // Common properties all health records should have
  id: string;
  dog_id?: string;
  puppy_id?: string;
  record_type: HealthRecordType;
  title: string;
  date: string; // Universal date field
  visit_date?: string; // For backward compatibility
  created_at: string;
  updated_at?: string;
  description?: string; // For backward compatibility
  record_notes?: string;
  next_due_date?: string;
  performed_by?: string;
  vet_name?: string;
  document_url?: string;
}

export interface VaccinationRecord extends HealthRecord {
  record_type: 'vaccination';
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  administered?: boolean;
  administered_date?: string;
}

export interface ExaminationRecord extends HealthRecord {
  record_type: 'examination';
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
}

export interface MedicationRecord extends HealthRecord {
  record_type: 'medication';
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  duration?: number;
  duration_unit?: string;
  start_date?: string;
  end_date?: string;
  administration_route?: string;
}

export interface SurgeryRecord extends HealthRecord {
  record_type: 'surgery';
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

// Health record options interface for fetching/filtering
export interface HealthRecordOptions {
  dogId?: string;
  puppyId?: string;
  recordType?: HealthRecordType;
  startDate?: string;
  endDate?: string;
  includeArchived?: boolean;
}

// Define the WeightRecord interface in the health module for consistency
export interface WeightRecord {
  id: string;
  dog_id?: string;
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

// Health management stats
export interface HealthStats {
  totalRecords: number;
  byType: Record<HealthRecordType, number>;
  upcomingVaccinations: VaccinationRecord[];
  latestWeight?: WeightRecord;
  latestWeightTrend?: 'increasing' | 'decreasing' | 'stable';
  currentWeight?: {
    value: number;
    unit: string;
    date: string;
  };
  growthData?: {
    percentChange: number;
    averageGrowthRate?: number;
    weightGoal?: number;
    projectedWeight?: number;
    onTrack?: boolean;
  };
}
