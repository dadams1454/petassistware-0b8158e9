
// Health Record Types

// Enums for health records
export enum HealthRecordTypeEnum {
  Examination = "examination",
  Vaccination = "vaccination",
  Medication = "medication",
  Surgery = "surgery",
  Laboratory = "laboratory",
  Imaging = "imaging",
  Dental = "dental",
  Wellness = "wellness",
  Emergency = "emergency",
  Specialist = "specialist",
  Other = "other",
  Test = "test"
}

// Appetite level enum
export enum AppetiteLevelEnum {
  Excellent = "excellent",
  Good = "good",
  Fair = "fair",
  Poor = "poor",
  None = "none"
}

// Energy level enum
export enum EnergyLevelEnum {
  High = "high",
  Normal = "normal",
  Low = "low",
  Lethargic = "lethargic"
}

// Stool consistency enum
export enum StoolConsistencyEnum {
  Normal = "normal",
  Soft = "soft",
  Loose = "loose",
  Watery = "watery",
  Hard = "hard"
}

// Convert enum to string for display
export const healthRecordTypeToString = (type: HealthRecordTypeEnum): string => {
  switch (type) {
    case HealthRecordTypeEnum.Examination:
      return "Examination";
    case HealthRecordTypeEnum.Vaccination:
      return "Vaccination";
    case HealthRecordTypeEnum.Medication:
      return "Medication";
    case HealthRecordTypeEnum.Surgery:
      return "Surgery";
    case HealthRecordTypeEnum.Laboratory:
      return "Laboratory";
    case HealthRecordTypeEnum.Imaging:
      return "Imaging";
    case HealthRecordTypeEnum.Dental:
      return "Dental";
    case HealthRecordTypeEnum.Wellness:
      return "Wellness";
    case HealthRecordTypeEnum.Emergency:
      return "Emergency";
    case HealthRecordTypeEnum.Specialist:
      return "Specialist";
    case HealthRecordTypeEnum.Test:
      return "Test";
    case HealthRecordTypeEnum.Other:
      return "Other";
    default:
      return "Unknown";
  }
};

// Convert string to enum for database operations
export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  switch (type.toLowerCase()) {
    case "examination":
      return HealthRecordTypeEnum.Examination;
    case "vaccination":
      return HealthRecordTypeEnum.Vaccination;
    case "medication":
      return HealthRecordTypeEnum.Medication;
    case "surgery":
      return HealthRecordTypeEnum.Surgery;
    case "laboratory":
      return HealthRecordTypeEnum.Laboratory;
    case "imaging":
      return HealthRecordTypeEnum.Imaging;
    case "dental":
      return HealthRecordTypeEnum.Dental;
    case "wellness":
      return HealthRecordTypeEnum.Wellness;
    case "emergency":
      return HealthRecordTypeEnum.Emergency;
    case "specialist":
      return HealthRecordTypeEnum.Specialist;
    case "test":
      return HealthRecordTypeEnum.Test;
    case "other":
      return HealthRecordTypeEnum.Other;
    default:
      return HealthRecordTypeEnum.Other;
  }
};

// The main health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  visit_date: string;
  record_notes?: string;
  vet_name: string;
  document_url?: string;
  next_due_date?: string;
  created_at: string;
  // Additional fields based on record type
  description?: string;
  findings?: string;
  recommendations?: string;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  duration?: number;
  duration_unit?: string;
  start_date?: string;
  end_date?: string;
  prescription_number?: string;
  administration_route?: string;
  // Vaccination specific
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  // Surgery specific
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  // Examination type
  examination_type?: string;
  follow_up_date?: string;
  // Lab test
  performed_by?: string;
}

// Health indicator record
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteLevelEnum;
  energy?: EnergyLevelEnum;
  stool_consistency?: StoolConsistencyEnum;
  abnormal?: boolean;
  notes?: string;
  alert_generated?: boolean;
  created_at: string;
  created_by?: string;
}

// Medication record
export interface Medication {
  id: string;
  dog_id: string;
  medication_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  administration_route: string;
  is_active: boolean;
  notes?: string;
  last_administered?: string;
  created_at: string;
}

// Medication administration record
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Health certificate
export interface HealthCertificate {
  id: string;
  dog_id: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Weight data for display
export interface WeightData {
  weight: number;
  date: string;
  unit: string;
}

// Weight record for a dog
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
  created_at: string;
  percent_change?: number;
  puppy_id?: string;
}

// Use the common WeightUnit type
export type { WeightUnit } from './common';

// Helper for safely converting database records to HealthRecord type
export const mapToHealthRecord = (record: any): HealthRecord => {
  if (!record) {
    throw new Error("Cannot map null or undefined to HealthRecord");
  }

  return {
    id: record.id || '',
    dog_id: record.dog_id || '',
    record_type: stringToHealthRecordType(record.record_type || ''),
    title: record.title || '',
    visit_date: record.visit_date || '',
    record_notes: record.record_notes,
    vet_name: record.vet_name || '',
    document_url: record.document_url,
    next_due_date: record.next_due_date,
    created_at: record.created_at || new Date().toISOString(),
    description: record.description,
    findings: record.findings,
    recommendations: record.recommendations,
    medication_name: record.medication_name,
    dosage: record.dosage ? Number(record.dosage) : undefined,
    dosage_unit: record.dosage_unit,
    frequency: record.frequency,
    duration: record.duration ? Number(record.duration) : undefined,
    duration_unit: record.duration_unit,
    start_date: record.start_date,
    end_date: record.end_date,
    prescription_number: record.prescription_number,
    administration_route: record.administration_route,
    vaccine_name: record.vaccine_name,
    manufacturer: record.manufacturer,
    lot_number: record.lot_number,
    expiration_date: record.expiration_date,
    procedure_name: record.procedure_name,
    surgeon: record.surgeon,
    anesthesia_used: record.anesthesia_used,
    recovery_notes: record.recovery_notes,
    examination_type: record.examination_type,
    follow_up_date: record.follow_up_date,
    performed_by: record.performed_by
  };
};

// Helper for safely converting database records to WeightRecord type 
export const mapToWeightRecord = (record: any): WeightRecord => {
  if (!record) {
    throw new Error("Cannot map null or undefined to WeightRecord");
  }

  return {
    id: record.id || '',
    dog_id: record.dog_id || '',
    weight: record.weight ? Number(record.weight) : 0,
    weight_unit: standardizeWeightUnit(record.weight_unit || record.unit),
    date: record.date || new Date().toISOString().split('T')[0],
    notes: record.notes,
    created_at: record.created_at || new Date().toISOString(),
    percent_change: record.percent_change ? Number(record.percent_change) : undefined,
    puppy_id: record.puppy_id
  };
};
