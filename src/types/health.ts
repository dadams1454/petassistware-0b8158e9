
import { Dog } from './litter';

// Enum to define the different types of health records
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Observation = 'observation',
  Dental = 'dental',
  Allergy = 'allergy',
  Other = 'other'
}

// Weight unit type
export type WeightUnit = 'lb' | 'kg' | 'oz' | 'g';

// Enum for appetite level
export enum AppetiteLevelEnum {
  Normal = 'normal',
  Decreased = 'decreased',
  Increased = 'increased',
  None = 'none'
}

// Enum for energy level
export enum EnergyLevelEnum {
  Normal = 'normal',
  Low = 'low',
  High = 'high',
  Hyperactive = 'hyperactive',
  Lethargic = 'lethargic'
}

// Enum for stool consistency
export enum StoolConsistencyEnum {
  Normal = 'normal',
  Hard = 'hard',
  Soft = 'soft',
  Watery = 'watery',
  Mucousy = 'mucousy',
  Bloody = 'bloody'
}

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum | string;
  title: string;
  visit_date: string;
  vet_name: string;
  record_notes?: string;
  document_url?: string;
  next_due_date?: string | null;
  created_at?: string;
  // For backward compatibility with components using 'date' or 'description'
  date?: string;
  description?: string;
  
  // Vaccination specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string | null;
  
  // Medication specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string | null;
  end_date?: string | null;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  prescription_number?: string;
  
  // Examination specific fields
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string | null;
  
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  
  // Additional fields
  vet_clinic?: string;
  performed_by?: string;
  reminder_sent?: boolean;
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  energy?: string;
  appetite?: string;
  stool_consistency?: string;
  abnormal?: boolean;
  notes?: string;
  alert_generated?: boolean;
  created_by?: string;
  created_at?: string;
}

// Medication interface
export interface Medication {
  id: string;
  dog_id: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date?: string | null;
  administration_route: string;
  notes?: string;
  is_active: boolean;
  last_administered?: string;
  created_at?: string;
}

// Medication administration interface
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_by: string;
  administered_at: string;
  notes?: string;
  created_at?: string;
}

// Health certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
  created_at?: string;
}

// Weight data interface
export interface WeightData {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at?: string;
}

// Weight record interface
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: WeightUnit;
  date: string;
  notes?: string;
  created_at: string;
  percent_change?: number;
  // For backward compatibility
  unit?: WeightUnit;
}

// Helper function to convert between string and enum for health record types
export const healthRecordTypeToString = (type: HealthRecordTypeEnum): string => {
  return type;
};

export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  switch (type) {
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
    case 'dental':
      return HealthRecordTypeEnum.Dental;
    case 'allergy':
      return HealthRecordTypeEnum.Allergy;
    case 'other':
      return HealthRecordTypeEnum.Other;
    default:
      return HealthRecordTypeEnum.Examination;
  }
};

// Helper function to map DB result to HealthRecord object
export const mapToHealthRecord = (record: any): HealthRecord => {
  const healthRecord: HealthRecord = {
    id: record.id,
    dog_id: record.dog_id,
    record_type: stringToHealthRecordType(record.record_type),
    title: record.title,
    visit_date: record.visit_date,
    vet_name: record.vet_name,
    record_notes: record.record_notes,
    document_url: record.document_url,
    next_due_date: record.next_due_date,
    created_at: record.created_at,
    // Add backward compatibility fields
    date: record.visit_date,
    description: record.record_notes
  };
  
  // Add type-specific fields if they exist
  switch (healthRecord.record_type) {
    case HealthRecordTypeEnum.Vaccination:
      healthRecord.vaccine_name = record.vaccine_name;
      healthRecord.manufacturer = record.manufacturer;
      healthRecord.lot_number = record.lot_number;
      healthRecord.expiration_date = record.expiration_date;
      break;
    case HealthRecordTypeEnum.Medication:
      healthRecord.medication_name = record.medication_name;
      healthRecord.dosage = record.dosage;
      healthRecord.dosage_unit = record.dosage_unit;
      healthRecord.frequency = record.frequency;
      healthRecord.start_date = record.start_date;
      healthRecord.end_date = record.end_date;
      healthRecord.duration = record.duration;
      healthRecord.duration_unit = record.duration_unit;
      healthRecord.administration_route = record.administration_route;
      healthRecord.prescription_number = record.prescription_number;
      break;
    case HealthRecordTypeEnum.Examination:
      healthRecord.examination_type = record.examination_type;
      healthRecord.findings = record.findings;
      healthRecord.recommendations = record.recommendations;
      healthRecord.follow_up_date = record.follow_up_date;
      break;
    case HealthRecordTypeEnum.Surgery:
      healthRecord.procedure_name = record.procedure_name;
      healthRecord.surgeon = record.surgeon;
      healthRecord.anesthesia_used = record.anesthesia_used;
      healthRecord.recovery_notes = record.recovery_notes;
      break;
  }
  
  return healthRecord;
};

// Helper function to map DB result to WeightRecord object
export const mapToWeightRecord = (record: any): WeightRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    weight: record.weight,
    weight_unit: record.weight_unit,
    date: record.date,
    notes: record.notes,
    created_at: record.created_at,
    percent_change: record.percent_change,
    // Add backward compatibility
    unit: record.weight_unit
  };
};
