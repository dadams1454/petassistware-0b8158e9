
export enum HealthRecordTypeEnum {
  Vaccination = 'vaccination',
  Examination = 'examination',
  Medication = 'medication',
  Surgery = 'surgery',
  Observation = 'observation',
  Deworming = 'deworming',
  Grooming = 'grooming',
  Dental = 'dental',
  Allergy = 'allergy',
  Test = 'test',
  Other = 'other'
}

// Define HealthRecordType as an alias to HealthRecordTypeEnum for backwards compatibility
export type HealthRecordType = HealthRecordTypeEnum;

export enum WeightUnitEnum {
  Pounds = 'lbs',
  Kilograms = 'kg',
  Ounces = 'oz',
  Grams = 'g'
}

export interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: HealthRecordTypeEnum;
  title: string;
  description?: string;
  date: string; // ISO date format
  visit_date?: string; // For compatibility with the database format
  performed_by?: string;
  location?: string;
  next_due_date?: string;
  files?: string[];
  created_at: string;
  tags?: string[];
  // Additional fields from the database schema
  document_url?: string;
  vet_name?: string;
  vet_clinic?: string;
  record_notes?: string;
  attachments?: string[];
}

export interface VaccinationRecord extends HealthRecord {
  vaccine_type: string;
  vaccine_name?: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  administered_by?: string;
  route?: string;
  administration_route?: string;
  site?: string;
  dose?: string;
  next_dose_due?: string;
  reminder_sent?: boolean;
}

export interface MedicationRecord extends HealthRecord {
  medication_name: string;
  dosage?: number | string;
  dosage_unit?: string;
  frequency?: string;
  duration?: number | string;
  duration_unit?: string;
  start_date?: string;
  end_date?: string;
  prescribed_by?: string;
  pharmacy?: string;
  prescription_number?: string;
  refills_remaining?: number;
}

export interface ExaminationRecord extends HealthRecord {
  exam_type?: string;
  examination_type?: string;
  findings?: string;
  recommendations?: string;
  follow_up_date?: string;
  examiner?: string;
  facility?: string;
}

export interface SurgeryRecord extends HealthRecord {
  procedure_name?: string;
  surgeon?: string;
  anesthesia_used?: string;
  recovery_notes?: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  weight: number;
  unit: WeightUnitEnum; // The interface property - main property to use
  weight_unit?: string; // For database compatibility - kept for backward compatibility
  date: string;
  notes?: string;
  created_at: string;
  puppy_id?: string;
  percent_change?: number;
}

// Helper function to map database records to our interface
export const adaptHealthRecord = (record: any): HealthRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    record_type: record.record_type,
    title: record.title || '',
    description: record.description || record.record_notes || '',
    date: record.visit_date || record.date || new Date().toISOString(),
    visit_date: record.visit_date,
    performed_by: record.performed_by || record.vet_name || '',
    next_due_date: record.next_due_date,
    created_at: record.created_at,
    document_url: record.document_url,
    // Include any other fields that might be present
    ...record
  };
};

// Helper function to map database weight records to our interface
export const adaptWeightRecord = (record: any): WeightRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    weight: record.weight,
    unit: (record.unit || record.weight_unit) as WeightUnitEnum,
    weight_unit: record.weight_unit, // Keep the original property
    date: record.date,
    notes: record.notes,
    created_at: record.created_at,
    puppy_id: record.puppy_id,
    percent_change: record.percent_change
  };
};
