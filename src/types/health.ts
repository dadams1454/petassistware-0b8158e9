
// Health related types and enums

export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Other = 'other',
  // Additional types used in the codebase
  Observation = 'observation',
  Dental = 'dental',
  Allergy = 'allergy',
  Test = 'test',
  Deworming = 'deworming',
  Grooming = 'grooming'
}

export enum AppetiteLevelEnum {
  Normal = 'normal',
  Reduced = 'reduced',
  Increased = 'increased',
  // Additional types used in the codebase
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  None = 'none'
}

export enum EnergyLevelEnum {
  Normal = 'normal',
  Low = 'low',
  High = 'high',
  // Additional types used in the codebase
  Hyperactive = 'hyperactive',
  Lethargic = 'lethargic'
}

export enum StoolConsistencyEnum {
  Normal = 'normal',
  Hard = 'hard',
  Soft = 'soft',
  Loose = 'loose',
  Watery = 'watery',
  Mucousy = 'mucousy',
  Bloody = 'bloody'
}

// Weight unit for health records
export type WeightUnit = 'oz' | 'g' | 'lb' | 'kg';

// Health record interface
export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum | string;
  visit_date: string;
  title: string;
  vet_name?: string;
  findings?: string;
  recommendations?: string;
  record_notes?: string;
  next_due_date?: string;
  document_url?: string;
  created_at?: string;
  // For backward compatibility
  date?: string;
  description?: string;
  // Medication specific fields
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string | null;
  duration?: number;
  duration_unit?: string;
  administration_route?: string;
  // Vaccine specific fields
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  // Examination specific fields
  examination_type?: string;
  follow_up_date?: string | null;
  // Surgery specific fields
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
  // Staff information
  performed_by?: string;
}

// Health indicator interface
export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: string;
  appetite?: AppetiteLevelEnum | string;
  energy?: EnergyLevelEnum | string;
  stool_consistency?: StoolConsistencyEnum | string;
  abnormal: boolean;
  notes?: string;
  created_by?: string;
  created_at: string;
  alert_generated?: boolean;
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
  end_date?: string | null;
  is_active: boolean;
  notes?: string;
  last_administered?: string;
  created_at?: string;
  // For puppy medications compatibility
  puppy_id?: string;
}

// Medication administration interface
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at?: string;
}

// Health certificate interface
export interface HealthCertificate {
  id: string;
  dog_id: string;
  certificate_type: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  file_url?: string;
  notes?: string;
  created_at?: string;
  // For puppy health certificates compatibility
  puppy_id?: string;
}

// Weight data interface
export interface WeightData {
  id: string;
  dog_id: string;
  weight: number;
  date: string;
  unit?: WeightUnit;
  notes?: string;
  created_at?: string;
}

// Weight record interface for both dogs and puppies
export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  date: string;
  weight_unit: string;
  notes?: string;
  percent_change?: number;
  created_at?: string;
  puppy_id?: string;
  // For calculations
  birth_date?: string;
  unit?: WeightUnit;
}

// Helper functions for health record types
export const healthRecordTypeToString = (type: HealthRecordTypeEnum): string => {
  switch (type) {
    case HealthRecordTypeEnum.Vaccination:
      return 'Vaccination';
    case HealthRecordTypeEnum.Examination:
      return 'Examination';
    case HealthRecordTypeEnum.Medication:
      return 'Medication';
    case HealthRecordTypeEnum.Surgery:
      return 'Surgery';
    case HealthRecordTypeEnum.Other:
      return 'Other';
    // Add cases for additional types
    case HealthRecordTypeEnum.Observation:
      return 'Observation';
    case HealthRecordTypeEnum.Dental:
      return 'Dental';
    case HealthRecordTypeEnum.Allergy:
      return 'Allergy';
    case HealthRecordTypeEnum.Test:
      return 'Test';
    case HealthRecordTypeEnum.Deworming:
      return 'Deworming';
    case HealthRecordTypeEnum.Grooming:
      return 'Grooming';
    default:
      return 'Unknown';
  }
};

export const stringToHealthRecordType = (type: string): HealthRecordTypeEnum => {
  switch (type.toLowerCase()) {
    case 'vaccination':
      return HealthRecordTypeEnum.Vaccination;
    case 'examination':
      return HealthRecordTypeEnum.Examination;
    case 'medication':
      return HealthRecordTypeEnum.Medication;
    case 'surgery':
      return HealthRecordTypeEnum.Surgery;
    // Additional types
    case 'observation':
      return HealthRecordTypeEnum.Observation;
    case 'dental':
      return HealthRecordTypeEnum.Dental;
    case 'allergy':
      return HealthRecordTypeEnum.Allergy;
    case 'test':
      return HealthRecordTypeEnum.Test;
    case 'deworming':
      return HealthRecordTypeEnum.Deworming;
    case 'grooming':
      return HealthRecordTypeEnum.Grooming;
    default:
      return HealthRecordTypeEnum.Other;
  }
};

// Helper for mapping data to health records
export const mapToHealthRecord = (data: any): HealthRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    record_type: data.record_type,
    visit_date: data.visit_date,
    title: data.title || 'Health Record',
    vet_name: data.vet_name,
    findings: data.findings,
    recommendations: data.recommendations,
    record_notes: data.record_notes,
    next_due_date: data.next_due_date,
    document_url: data.document_url,
    created_at: data.created_at,
    // Add mapped fields for backward compatibility
    date: data.visit_date,
    description: data.record_notes || data.findings
  };
};

// Helper for mapping data to weight records
export const mapToWeightRecord = (data: any): WeightRecord => {
  return {
    id: data.id,
    dog_id: data.dog_id,
    weight: data.weight,
    date: data.date,
    weight_unit: data.weight_unit || data.unit,
    notes: data.notes,
    percent_change: data.percent_change,
    created_at: data.created_at,
    puppy_id: data.puppy_id
  };
};

