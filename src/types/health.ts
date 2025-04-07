
/**
 * Health-related type definitions
 */
import { WeightUnit } from './weight-units';
import { 
  HealthRecordType, 
  MedicationStatus, 
  AppetiteLevel, 
  EnergyLevel, 
  StoolConsistency,
  // Value aliases for backward compatibility
  HealthRecordTypeEnum,
  MedicationStatusEnum,
  AppetiteLevelEnum,
  EnergyLevelEnum,
  StoolConsistencyEnum,
  // Helper functions
  stringToHealthRecordType
} from './health-enums';

// Re-export for backward compatibility
export {
  HealthRecordType,
  MedicationStatus,
  AppetiteLevel,
  EnergyLevel, 
  StoolConsistency,
  // Value aliases for backward compatibility 
  HealthRecordTypeEnum,
  MedicationStatusEnum,
  AppetiteLevelEnum,
  EnergyLevelEnum,
  StoolConsistencyEnum,
  // Helper functions
  stringToHealthRecordType
};

// Also re-export as types
export type {
  HealthRecordTypeEnum as HealthRecordTypeEnumType,
  MedicationStatusEnum as MedicationStatusEnumType,
  AppetiteLevelEnum as AppetiteLevelEnumType,
  EnergyLevelEnum as EnergyLevelEnumType,
  StoolConsistencyEnum as StoolConsistencyEnumType
};

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordType;
  title: string;
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

// Medication status result
export interface MedicationStatusResult {
  status: MedicationStatus;
  daysOverdue?: number;
  daysUntilDue?: number;
  nextDue?: Date | null;
  message: string;
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
  is_active: boolean;
  created_at: string;
  last_administered?: string;
}

// Medication administration
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
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
  created_at: string;
  created_by?: string;
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

// Health certificate
export interface HealthCertificate {
  id: string;
  dog_id: string;
  title: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
  created_at: string;
  puppy_id?: string;
}

// Import the WeightRecord type from the weight module
import { WeightRecord } from './weight';

// Re-export the WeightRecord type for convenience
export type { WeightRecord, WeightUnit };

// Helper function to map data to health record
export function mapToHealthRecord(data: any): HealthRecord {
  return {
    id: data.id || '',
    dog_id: data.dog_id || '',
    record_type: stringToHealthRecordType(data.record_type || 'examination'),
    title: data.title || '',
    visit_date: data.visit_date || data.date || new Date().toISOString().split('T')[0],
    vet_name: data.vet_name || '',
    description: data.description || '',
    document_url: data.document_url || undefined,
    record_notes: data.record_notes || data.notes || '',
    created_at: data.created_at || new Date().toISOString(),
    next_due_date: data.next_due_date || undefined,
    performed_by: data.performed_by || undefined,
    
    // Vaccination-specific fields
    vaccine_name: data.vaccine_name || undefined,
    manufacturer: data.manufacturer || undefined,
    lot_number: data.lot_number || undefined,
    expiration_date: data.expiration_date || undefined,
    
    // Medication-specific fields
    medication_name: data.medication_name || undefined,
    dosage: data.dosage || undefined,
    dosage_unit: data.dosage_unit || undefined,
    frequency: data.frequency || undefined,
    start_date: data.start_date || undefined,
    end_date: data.end_date || undefined,
    duration: data.duration || undefined,
    duration_unit: data.duration_unit || undefined,
    administration_route: data.administration_route || undefined,
    
    // Examination-specific fields
    examination_type: data.examination_type || undefined,
    findings: data.findings || undefined,
    recommendations: data.recommendations || undefined,
    follow_up_date: data.follow_up_date || undefined,
    
    // Surgery-specific fields
    procedure_name: data.procedure_name || undefined,
    surgeon: data.surgeon || undefined,
    anesthesia_used: data.anesthesia_used || undefined,
    recovery_notes: data.recovery_notes || undefined
  };
}

// Helper function to map data to weight record
export function mapToWeightRecord(data: any) {
  if (!data) return null;
  return {
    id: data.id || '',
    dog_id: data.dog_id || '',
    puppy_id: data.puppy_id || undefined,
    weight: typeof data.weight === 'number' ? data.weight : 0,
    weight_unit: data.weight_unit || data.unit || 'lb',
    date: data.date || new Date().toISOString().split('T')[0],
    notes: data.notes || '',
    percent_change: data.percent_change || 0,
    created_at: data.created_at || new Date().toISOString(),
    age_days: data.age_days || undefined,
    birth_date: data.birth_date || undefined
  };
}
