
import { 
  HealthRecordType, HealthRecordTypeEnum,
  MedicationStatus, MedicationStatusEnum,
  AppetiteLevel, AppetiteLevelEnum,
  EnergyLevel, EnergyLevelEnum,
  StoolConsistency, StoolConsistencyEnum
} from './health-enums';
import type { HeatIntensityType } from './heat-cycles';
import { HeatIntensity } from './heat-cycles';
import { WeightUnit } from './weight-units';

// Re-export all enums for simpler imports elsewhere
export {
  HealthRecordType, HealthRecordTypeEnum,
  MedicationStatus, MedicationStatusEnum,
  AppetiteLevel, AppetiteLevelEnum,
  EnergyLevel, EnergyLevelEnum,
  StoolConsistency, StoolConsistencyEnum,
  HeatIntensity
} from './health-enums';

// Re-export HeatIntensityType
export type { HeatIntensityType } from './heat-cycles';

// Re-export the stringToHealthRecordType helper
export { stringToHealthRecordType } from './health-enums';

// Health Record interface
export interface HealthRecord {
  id?: string;
  dog_id?: string;
  puppy_id?: string;
  record_type: HealthRecordType;
  title?: string;
  visit_date: string;
  vet_name: string;
  description?: string;
  document_url?: string;
  record_notes?: string;
  created_at?: string;
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
  prescription_number?: string;
  
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

// Weight Record interface (used in health tracking)
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

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  medication_name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  administration_route?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  last_administered?: string;
}

// Medication Administration interface
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Health Indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteLevel;
  energy?: EnergyLevel;
  stool_consistency?: StoolConsistency;
  notes?: string;
  abnormal: boolean;
  alert_generated: boolean;
  created_at: string;
  created_by?: string;
}

// Health Alert interface
export interface HealthAlert {
  id: string;
  dog_id: string;
  indicator_id: string;
  status: 'active' | 'resolved';
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

// Health Certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  title: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Medication status result interface
export interface MedicationStatusResult {
  status: MedicationStatus;
  daysOverdue?: number;
  daysUntilDue?: number;
  nextDue?: Date | null;
  message: string;
}

// Helper functions
export function mapToHealthRecord(data: any): HealthRecord {
  return {
    id: data.id,
    dog_id: data.dog_id,
    puppy_id: data.puppy_id,
    record_type: stringToHealthRecordType(data.record_type),
    title: data.title,
    visit_date: data.visit_date,
    vet_name: data.vet_name || '',
    description: data.description,
    document_url: data.document_url,
    record_notes: data.record_notes,
    created_at: data.created_at,
    next_due_date: data.next_due_date,
    performed_by: data.performed_by,
    
    // Vaccination-specific fields
    vaccine_name: data.vaccine_name,
    manufacturer: data.manufacturer,
    lot_number: data.lot_number,
    expiration_date: data.expiration_date,
    
    // Medication-specific fields
    medication_name: data.medication_name,
    dosage: data.dosage,
    dosage_unit: data.dosage_unit,
    frequency: data.frequency,
    start_date: data.start_date,
    end_date: data.end_date,
    duration: data.duration,
    duration_unit: data.duration_unit,
    administration_route: data.administration_route,
    prescription_number: data.prescription_number,
    
    // Examination-specific fields
    examination_type: data.examination_type,
    findings: data.findings,
    recommendations: data.recommendations,
    follow_up_date: data.follow_up_date,
    
    // Surgery-specific fields
    procedure_name: data.procedure_name,
    surgeon: data.surgeon,
    anesthesia_used: data.anesthesia_used,
    recovery_notes: data.recovery_notes,
  };
}

export function mapToWeightRecord(data: any) {
  return {
    id: data.id,
    dog_id: data.dog_id,
    puppy_id: data.puppy_id,
    weight: data.weight,
    weight_unit: data.weight_unit,
    date: data.date,
    notes: data.notes,
    percent_change: data.percent_change,
    created_at: data.created_at
  };
}

// Re-export the WeightUnit type for convenience
export type { WeightUnit };

// Heat cycle types - re-export from main heat-cycles.ts
export type { HeatCycle, HeatStage } from './heat-cycles';
